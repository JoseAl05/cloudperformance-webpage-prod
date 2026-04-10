import ExcelJS from 'exceljs'
import {
  IntraCloudMonthlyBilling,
  IntraCloudMonthlyBillingData,
} from '@/interfaces/vista-intracloud/billing/intraCloudBillingInterfaces'

export type RowType = 'header' | 'budget' | 'invoiced' | 'var_dollar' | 'var_pct' | 'projected' | 'total' | 'dev_dollar' | 'dev_pct' | 'separator'

export type ExportRow = {
  values: (string | number)[]
  type: RowType
}

const generateDummyBudget = (invoiced: number): number =>
  Math.round(invoiced * 1.05)

const generateDummyProjected = (invoiced: number): number =>
  Math.round(invoiced * 1.02)

const formatMonth = (key: string) => {
  const [m, y] = key.split('-')
  return `${m.padStart(2, '0')}-${y}`
}

const buildSectionRows = (
  label: string,
  monthlyInvoiced: Record<string, number>,
  totalInvoiced: number,
  months: string[],
  isSummary: boolean,
): ExportRow[] => {
  const rows: ExportRow[] = []
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
  const devPctTotal = budgetSum !== 0 ? Math.round(((budgetSum - totalInvoiced) / budgetSum) * 1000) / 10 : 0

  const facDiff: (number | null)[] = months.map((m, i) => {
    if (i === 0) return null
    return (monthlyInvoiced[m] ?? 0) - (monthlyInvoiced[months[i - 1]] ?? 0)
  })
  const facDiffPct: (number | null)[] = months.map((m, i) => {
    if (i === 0) return null
    const prev = monthlyInvoiced[months[i - 1]] ?? 0
    const curr = monthlyInvoiced[m] ?? 0
    return prev !== 0 ? Math.round(((curr - prev) / prev) * 1000) / 10 : 0
  })

  rows.push({ values: [label, ...months.map((m) => monthlyBudget[m]), budgetSum], type: isSummary ? 'budget' : 'header' })
  rows.push({ values: ['  Facturado CHT', ...months.map((m) => monthlyInvoiced[m] ?? 0), totalInvoiced], type: 'invoiced' })
  rows.push({ values: ['  Var. vs mes anterior ($)', ...facDiff.map((v) => v ?? '-'), '-'], type: 'var_dollar' })
  rows.push({ values: ['  Var. vs mes anterior (%)', ...facDiffPct.map((v) => v !== null ? `${v}%` : '-'), '-'], type: 'var_pct' })
  rows.push({ values: ['  Proyectado CHT', ...months.map((m) => monthlyProjected[m]), projectedSum], type: 'projected' })
  rows.push({ values: ['  Total', ...months.map((m) => monthlyInvoiced[m] ?? 0), totalInvoiced], type: 'total' })
  rows.push({ values: ['  Desviación ($)', ...months.map((m) => monthlyBudget[m] - (monthlyInvoiced[m] ?? 0)), devTotal], type: 'dev_dollar' })
  rows.push({
    values: ['  Desviación (%)', ...months.map((m) => {
      const bgt = monthlyBudget[m]
      const inv = monthlyInvoiced[m] ?? 0
      return bgt !== 0 ? `${(Math.round(((bgt - inv) / bgt) * 1000) / 10)}%` : '0%'
    }), `${devPctTotal}%`],
    type: 'dev_pct',
  })

  return rows
}

export const buildExportRows = (
  data: IntraCloudMonthlyBilling[],
  months: string[],
  billingMap: Record<string, Record<string, IntraCloudMonthlyBillingData>>,
  summaryByMonth: Record<string, number>,
  summaryTotal: number,
): ExportRow[] => {
  const header: ExportRow = { values: ['Apertura', ...months.map(formatMonth), 'Total'], type: 'header' }
  const summaryInvoiced = Object.fromEntries(months.map((m) => [m, summaryByMonth[m] ?? 0]))
  const rows: ExportRow[] = [header]

  rows.push(...buildSectionRows('Presupuesto (Total)', summaryInvoiced, summaryTotal, months, true))

  data.forEach((tenant) => {
    rows.push({ values: [], type: 'separator' })
    const tenantMonthly: Record<string, number> = {}
    months.forEach((m) => {
      tenantMonthly[m] = billingMap[tenant.tenant_id]?.[m]?.cost_in_usd ?? 0
    })
    const tenantTotal = Object.values(tenantMonthly).reduce((a, b) => a + b, 0)
    rows.push(...buildSectionRows(tenant.tenant_id, tenantMonthly, tenantTotal, months, false))
  })

  return rows
}

export const exportToCSV = (rows: ExportRow[], filename = 'intracloud_monthly_billing.csv') => {
  const csv = rows.map((r) =>
    r.values.map((c) => {
      const s = String(c)
      return s.includes(',') || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s
    }).join(',')
  ).join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export const exportToExcel = async (rows: ExportRow[], monthCount: number, filename = 'intracloud_monthly_billing.xlsx') => {
  const wb = new ExcelJS.Workbook()
  const ws = wb.addWorksheet('Monthly Billing')

  const white: Partial<ExcelJS.Font> = { color: { argb: 'FFFFFFFF' }, size: 10, name: 'Calibri' }
  const whiteBold: Partial<ExcelJS.Font> = { ...white, bold: true }
  const yellowItalic: Partial<ExcelJS.Font> = { color: { argb: 'FFFFFFCC' }, size: 10, name: 'Calibri', italic: true }
  const greenFont: Partial<ExcelJS.Font> = { color: { argb: 'FF4ADE80' }, size: 10, name: 'Calibri' }
  const redFont: Partial<ExcelJS.Font> = { color: { argb: 'FFF87171' }, size: 10, name: 'Calibri' }

  const fill = (argb: string): ExcelJS.Fill => ({
    type: 'pattern', pattern: 'solid', fgColor: { argb },
  })

  const headerFill = fill('FF1E3A5F')
  const summaryBudgetFill = fill('FF1E40AF')
  const summaryFill = fill('FF1D4ED8')
  const tenantHeaderFill = fill('FF1E3A5F')
  const tenantFill = fill('FF2563EB')
  const varFill = fill('FF1E40AF')
  const tenantVarFill = fill('FF1D4ED8')

  const thinBorder: Partial<ExcelJS.Borders> = {
    top: { style: 'thin', color: { argb: 'FF4A5568' } },
    bottom: { style: 'thin', color: { argb: 'FF4A5568' } },
    left: { style: 'thin', color: { argb: 'FF4A5568' } },
    right: { style: 'thin', color: { argb: 'FF4A5568' } },
  }

  const styleMap: Record<RowType, { font: Partial<ExcelJS.Font>; fill: ExcelJS.Fill }> = {
    header: { font: whiteBold, fill: headerFill },
    budget: { font: whiteBold, fill: summaryBudgetFill },
    invoiced: { font: white, fill: summaryFill },
    var_dollar: { font: yellowItalic, fill: varFill },
    var_pct: { font: yellowItalic, fill: varFill },
    projected: { font: white, fill: summaryFill },
    total: { font: whiteBold, fill: summaryFill },
    dev_dollar: { font: white, fill: summaryFill },
    dev_pct: { font: white, fill: summaryFill },
    separator: { font: white, fill: fill('FF111827') },
  }

  let inTenantSection = false

  rows.forEach((r) => {
    const row = ws.addRow(r.values)

    if (r.type === 'separator') {
      inTenantSection = true
      row.height = 8
      return
    }

    let baseStyle = styleMap[r.type]
    if (inTenantSection && r.type !== 'header') {
      const tenantFills: Partial<Record<RowType, ExcelJS.Fill>> = {
        invoiced: tenantFill,
        projected: tenantFill,
        total: tenantFill,
        dev_dollar: tenantFill,
        dev_pct: tenantFill,
        var_dollar: tenantVarFill,
        var_pct: tenantVarFill,
        budget: tenantFill,
      }
      baseStyle = { ...baseStyle, fill: tenantFills[r.type] ?? baseStyle.fill }
    }
    if (inTenantSection && r.type === 'header') {
      baseStyle = { font: whiteBold, fill: tenantHeaderFill }
    }

    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      cell.font = { ...baseStyle.font }
      cell.fill = baseStyle.fill
      cell.border = thinBorder
      cell.alignment = colNumber === 1
        ? { horizontal: 'left', vertical: 'middle' }
        : { horizontal: 'right', vertical: 'middle' }

      if ((r.type === 'dev_dollar' || r.type === 'dev_pct' || r.type === 'var_dollar' || r.type === 'var_pct') && colNumber > 1) {
        const val = r.values[colNumber - 1]
        if (typeof val === 'number') {
          cell.font = val > 0 ? { ...greenFont } : val < 0 ? { ...redFont } : { ...baseStyle.font }
        } else if (typeof val === 'string' && val !== '-') {
          const num = parseFloat(val)
          if (!isNaN(num)) {
            cell.font = num > 0 ? { ...greenFont } : num < 0 ? { ...redFont } : { ...baseStyle.font }
          }
        }
      }
    })
  })

  ws.getColumn(1).width = 28
  for (let i = 2; i <= monthCount + 2; i++) {
    ws.getColumn(i).width = 16
  }

  const buffer = await wb.xlsx.writeBuffer()
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}