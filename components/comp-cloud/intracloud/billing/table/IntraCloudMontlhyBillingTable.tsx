import { useMemo, useCallback } from 'react'
import {
  IntraCloudMonthlyBilling,
  IntraCloudMonthlyBillingData,
} from '@/interfaces/vista-intracloud/billing/intraCloudBillingInterfaces'
import { LoaderComponent } from '@/components/general_aws/LoaderComponent';
import { Button } from '@/components/ui/button'
import { buildExportRows, exportToCSV, exportToExcel } from '@/lib/exportExcelBillingIntracloud';

interface IntraCloudMonthlyBillingTableProps {
  data: IntraCloudMonthlyBilling[];
  isLoading: boolean;
}

const formatCurrency = (value: number): string => {
  const abs = Math.abs(value)
  const formatted = abs.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
  return value < 0 ? `($${formatted})` : `$${formatted}`
}

const formatPercent = (value: number): string => {
  const formatted = Math.abs(value).toFixed(1)
  return value < 0 ? `-${formatted}%` : `${formatted}%`
}

const generateDummyBudget = (invoiced: number): number =>
  Math.round(invoiced * 1.05)

const generateDummyProjected = (invoiced: number): number =>
  Math.round(invoiced * 1.02)

export const IntraCloudMonthlyBillingTable = ({
  data, isLoading
}: IntraCloudMonthlyBillingTableProps) => {
  const months = useMemo(() => {
    if (data && data.length === 0 || !data) return [];
    const monthSet = new Set<string>()
    data.forEach((tenant) =>
      tenant.billing_data?.forEach((bd) => {
        monthSet.add(`${bd.month}-${bd.year}`)
      })
    )
    return Array.from(monthSet).sort((a, b) => {
      const [mA, yA] = a.split('-').map(Number)
      const [mB, yB] = b.split('-').map(Number)
      return yA !== yB ? yA - yB : mA - mB
    })
  }, [data])

  const billingMap = useMemo(() => {
    if (data && data.length === 0 || !data) return {};
    const map: Record<string, Record<string, IntraCloudMonthlyBillingData>> = {}
    data.forEach((tenant) => {
      map[tenant.tenant_id] = {}
      if (!tenant.billing_data || tenant.billing_data.length === 0) return {};
      tenant.billing_data.forEach((bd) => {
        map[tenant.tenant_id][`${bd.month}-${bd.year}`] = bd
      })
    })
    return map
  }, [data])

  const summaryByMonth = useMemo(() => {
    if (data && data.length === 0 || !data) return {};
    const totals: Record<string, number> = {}
    months.forEach((m) => {
      totals[m] = data.reduce((sum, t) => {
        const bd = billingMap[t.tenant_id]?.[m]
        return sum + (bd?.cost_in_usd ?? 0)
      }, 0)
    })
    return totals
  }, [data, months, billingMap])

  const summaryTotal = useMemo(
    () => Object.values(summaryByMonth).reduce((a, b) => a + b, 0),
    [summaryByMonth]
  )

  const formatMonth = (key: string) => {
    const [m, y] = key.split('-')
    return `${m.padStart(2, '0')}-${y}`
  }

  const deviationColor = (value: number) =>
    value < 0 ? 'text-green-400' : value > 0 ? 'text-yellow-400' : ''

  const cellBase = 'px-2 py-1 text-right text-sm whitespace-nowrap border-r border-white/10'
  const headerCell = 'px-2 py-1 text-center text-sm font-semibold whitespace-nowrap border-r border-white/10'
  const labelCell = 'px-3 py-1 text-left text-sm whitespace-nowrap border-r border-white/10'

  const renderSectionRows = (
    label: string,
    monthlyInvoiced: Record<string, number>,
    totalInvoiced: number,
    bgBase: string,
    headerBg?: string,
  ) => {
    const monthlyBudget: Record<string, number> = {}
    const monthlyProjected: Record<string, number> = {}
    let budgetSum = 0
    let projectedSum = 0

    months.forEach((m) => {
      const inv = monthlyInvoiced[m] ?? 0
      monthlyBudget[m] = generateDummyBudget(inv)
      monthlyProjected[m] = generateDummyProjected(inv)
      budgetSum += monthlyBudget[m]
      projectedSum += monthlyProjected[m]
    })

    const devTotal = budgetSum - totalInvoiced
    const devPctTotal = budgetSum !== 0 ? ((budgetSum - totalInvoiced) / budgetSum) * 100 : 0

    const facDiff: Record<string, number | null> = {}
    const facDiffPct: Record<string, number | null> = {}

    months.forEach((m, i) => {
      if (i === 0) {
        facDiff[m] = null
        facDiffPct[m] = null
      } else {
        const prev = monthlyInvoiced[months[i - 1]] ?? 0
        const curr = monthlyInvoiced[m] ?? 0
        facDiff[m] = curr - prev
        facDiffPct[m] = prev !== 0 ? ((curr - prev) / prev) * 100 : 0
      }
    })

    return (
      <>
        <tr className={headerBg ?? bgBase}>
          <td className={`${labelCell} font-semibold`}>{label}</td>
          {months.map((m) => (
            <td key={m} className={`${cellBase} font-semibold`}>{formatCurrency(monthlyBudget[m])}</td>
          ))}
          <td className={`${cellBase} font-semibold`}>{formatCurrency(budgetSum)}</td>
        </tr>
        <tr className={bgBase}>
          <td className={`${labelCell} pl-6`}>Facturado</td>
          {months.map((m) => (
            <td key={m} className={cellBase}>{formatCurrency(monthlyInvoiced[m] ?? 0)}</td>
          ))}
          <td className={`${cellBase} font-semibold`}>{formatCurrency(totalInvoiced)}</td>
        </tr>
        <tr className={`${bgBase} border-t border-yellow-400/40`}>
          <td className={`${labelCell} pl-6 italic text-yellow-200`}>↕ Var. vs mes anterior ($)</td>
          {months.map((m) => (
            <td key={m} className={`${cellBase} font-medium ${facDiff[m] !== null ? deviationColor(facDiff[m]!) : 'text-white/40'}`}>
              {facDiff[m] !== null ? formatCurrency(facDiff[m]!) : '-'}
            </td>
          ))}
          <td className={`${cellBase} text-white/40`}>-</td>
        </tr>
        <tr className={`${bgBase} border-b border-yellow-400/40`}>
          <td className={`${labelCell} pl-6 italic text-yellow-200`}>↕ Var. vs mes anterior (%)</td>
          {months.map((m) => (
            <td key={m} className={`${cellBase} font-medium ${facDiffPct[m] !== null ? deviationColor(facDiffPct[m]!) : 'text-white/40'}`}>
              {facDiffPct[m] !== null ? formatPercent(facDiffPct[m]!) : '-'}
            </td>
          ))}
          <td className={`${cellBase} text-white/40`}>-</td>
        </tr>
        <tr className={bgBase}>
          <td className={`${labelCell} pl-6`}>Proyectado</td>
          {months.map((m) => (
            <td key={m} className={cellBase}>{formatCurrency(monthlyProjected[m])}</td>
          ))}
          <td className={cellBase}>{formatCurrency(projectedSum)}</td>
        </tr>
        <tr className={bgBase}>
          <td className={`${labelCell} font-semibold`}>Total</td>
          {months.map((m) => (
            <td key={m} className={`${cellBase} font-semibold`}>{formatCurrency(monthlyInvoiced[m] ?? 0)}</td>
          ))}
          <td className={`${cellBase} font-semibold`}>{formatCurrency(totalInvoiced)}</td>
        </tr>
        <tr className={bgBase}>
          <td className={`${labelCell} pl-6`}>Desviación ($)</td>
          {months.map((m) => {
            const dev = monthlyBudget[m] - (monthlyInvoiced[m] ?? 0)
            return (
              <td key={m} className={`${cellBase} ${deviationColor(dev)}`}>
                {formatCurrency(dev)}
              </td>
            )
          })}
          <td className={`${cellBase} ${deviationColor(devTotal)}`}>{formatCurrency(devTotal)}</td>
        </tr>
        <tr className={bgBase}>
          <td className={`${labelCell} pl-6`}>Desviación (%)</td>
          {months.map((m) => {
            const bgt = monthlyBudget[m]
            const inv = monthlyInvoiced[m] ?? 0
            const pct = bgt !== 0 ? ((bgt - inv) / bgt) * 100 : 0
            return (
              <td key={m} className={`${cellBase} ${deviationColor(pct)}`}>
                {formatPercent(pct)}
              </td>
            )
          })}
          <td className={`${cellBase} ${deviationColor(devPctTotal)}`}>{formatPercent(devPctTotal)}</td>
        </tr>
      </>
    )
  }

  const handleExportCSV = useCallback(() => {
    const rows = buildExportRows(data, months, billingMap, summaryByMonth, summaryTotal)
    exportToCSV(rows)
  }, [data, months, billingMap, summaryByMonth, summaryTotal])

  const handleExportExcel = useCallback(async () => {
    const rows = buildExportRows(data, months, billingMap, summaryByMonth, summaryTotal)
    await exportToExcel(rows, months.length)
  }, [data, months, billingMap, summaryByMonth, summaryTotal])

  if (isLoading) {
    return <LoaderComponent />
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2 justify-end">
        <Button variant="outline" size="sm" onClick={handleExportCSV}>
          Export CSV
        </Button>
        <Button variant="outline" size="sm" onClick={handleExportExcel}>
          Export Excel
        </Button>
      </div>
    <div className="overflow-x-auto rounded-md border border-border">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-blue-900 dark:bg-blue-950 text-white">
            <th className={headerCell}>Apertura</th>
            {months.map((m) => (
              <th key={m} className={headerCell}>{formatMonth(m)}</th>
            ))}
            <th className={headerCell}>Total</th>
          </tr>
        </thead>
        <tbody>
          {renderSectionRows(
            'Presupuesto (Total)',
            Object.fromEntries(months.map((m) => [m, summaryByMonth[m] ?? 0])),
            summaryTotal,
            'bg-blue-800/90 dark:bg-blue-900/90 text-white',
          )}
        </tbody>

        {data.map((tenant, index) => {
          const tenantMonthly: Record<string, number> = {}
          months.forEach((m) => {
            tenantMonthly[m] = billingMap[tenant.tenant_id]?.[m]?.cost_in_usd ?? 0
          })
          const tenantTotal = Object.values(tenantMonthly).reduce((a, b) => a + b, 0)

          return (
            <tbody key={tenant.tenant_id}>
              <tr>
                <td colSpan={months.length + 2} className="py-1 bg-gray-100 dark:bg-gray-950" />
              </tr>
              {renderSectionRows(
                `Ppto ${tenant.tenant_alias}`,
                tenantMonthly,
                tenantTotal,
                'bg-blue-600/90 dark:bg-blue-800/90 text-white',
                'bg-blue-800 dark:bg-blue-950 text-white',
              )}
            </tbody>
          )
        })}
      </table>
    </div>
    </div>
  )
}