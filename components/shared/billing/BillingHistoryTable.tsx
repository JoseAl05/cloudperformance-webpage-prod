'use client'

import { useCallback, useMemo, type ReactNode } from 'react';
import { Download, Info } from 'lucide-react';
import { LoaderComponent } from '@/components/general_aws/LoaderComponent';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { exportHistoricalBillingToExcel } from '@/lib/exportExcelHistoricalBilling';
import type { BillingHistory } from '@/interfaces/billing';

interface BillingHistoryTableProps {
    data: BillingHistory | null;
    isLoading: boolean;
    cloudLabel: string;
}

const formatCurrency = (value: number | null | undefined): string => {
    if (value === undefined || value === null) return '-';
    const formatted = Math.abs(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return value < 0 ? `($${formatted})` : `$${formatted}`;
};

const devLabel = (toMonth: string, months: string[]) => {
    const index = months.indexOf(toMonth);
    return index > 0 ? `${months[index - 1]} vs ${toMonth}` : `vs ${toMonth}`;
};

const SummaryLabel = ({ label, help }: { label: string; help: ReactNode }) => (
    <div className="flex items-center gap-1.5">
        {label}
        <Tooltip>
            <TooltipTrigger asChild>
                <Info className="h-3.5 w-3.5 cursor-pointer text-slate-300 hover:text-white transition-colors" />
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-xs">
                <p className="text-xs font-normal">{help}</p>
            </TooltipContent>
        </Tooltip>
    </div>
);

export const BillingHistoryTable = ({ data, isLoading, cloudLabel }: BillingHistoryTableProps) => {
    const months = useMemo(() => {
        const all = new Set<string>();
        data?.services.forEach((row) => row.months.forEach((c) => all.add(c.month)));
        return Array.from(all).sort();
    }, [data]);
    const deviationMonths = months.slice(1);

    const handleExportExcel = useCallback(async () => {
        if (!data) return;
        try {
            await exportHistoricalBillingToExcel(data, months, `Historico_Consumo_${cloudLabel}.xlsx`);
        } catch (error) {
            console.error('Error al exportar a Excel:', error);
        }
    }, [data, months, cloudLabel]);

    if (isLoading) return <LoaderComponent size="large" />;
    if (!data || data.services.length === 0) {
        return <div className="text-center py-10 text-muted-foreground">No hay datos para mostrar en este rango de fechas.</div>;
    }

    const cellBase = 'px-2 py-1.5 text-right text-sm whitespace-nowrap border-r border-slate-300 dark:border-slate-700';
    const headerCell = 'px-2 py-2 text-center text-xs font-bold whitespace-nowrap border-r border-slate-300 dark:border-slate-700 uppercase tracking-wider';
    const summaryHead = 'px-4 py-2 font-bold bg-[#002060] text-white border-r border-slate-300';

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button onClick={handleExportExcel} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar a Excel
                </Button>
            </div>

            <div className="overflow-x-auto rounded-md border border-slate-300 dark:border-slate-700 shadow-sm">
                <table className="w-full border-collapse bg-white dark:bg-slate-900">
                    <thead>
                        <tr className="bg-[#002060] text-white">
                            <th className={headerCell}></th>
                            <th colSpan={months.length + 1} className={`${headerCell} border-l border-white/20`}>
                                CONSUMO HISTÓRICO
                            </th>
                            {deviationMonths.length > 0 && (
                                <th colSpan={deviationMonths.length} className={`${headerCell} border-l border-white/20`}>
                                    DESVIACIONES MENSUALES
                                </th>
                            )}
                        </tr>
                        <tr className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                            <th className={`${headerCell} text-left pl-4`}>Service Category</th>
                            {months.map((m) => <th key={m} className={headerCell}>{m}</th>)}
                            <th className={`${headerCell} bg-slate-200 dark:bg-slate-700`}>Total</th>
                            {deviationMonths.map((m) => <th key={m} className={headerCell}>{devLabel(m, months)}</th>)}
                        </tr>
                    </thead>

                    <tbody>
                        {data.services.map((row) => (
                            <tr key={row.service} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                <td className={`${cellBase} text-left pl-4 font-medium`}>{row.service}</td>
                                {months.map((m) => (
                                    <td key={m} className={cellBase}>
                                        {formatCurrency(row.months.find((c) => c.month === m)?.cost ?? 0)}
                                    </td>
                                ))}
                                <td className={`${cellBase} font-bold bg-slate-50 dark:bg-slate-800`}>{formatCurrency(row.total)}</td>
                                {deviationMonths.map((m) => {
                                    const deviation = row.deviations.find((d) => d.to_month === m);
                                    if (!deviation) return <td key={m} className={`${cellBase} text-slate-400`}>-</td>;
                                    const colorClass = deviation.value > 0 ? 'text-amber-500 font-medium' : deviation.value < 0 ? 'text-emerald-500 font-medium' : 'text-slate-400';
                                    return <td key={m} className={`${cellBase} ${colorClass}`}>{formatCurrency(deviation.value)}</td>;
                                })}
                            </tr>
                        ))}

                        <tr className="bg-[#002060] text-white font-bold">
                            <td className={`${cellBase} text-left pl-4 border-white/20`}>Total General</td>
                            {months.map((m) => (
                                <td key={m} className={`${cellBase} border-white/20`}>
                                    {formatCurrency(data.totals.by_month.find((t) => t.month === m)?.total ?? 0)}
                                </td>
                            ))}
                            <td className={`${cellBase} border-white/20 bg-blue-900`}>{formatCurrency(data.totals.total)}</td>
                            <td colSpan={deviationMonths.length} className="bg-slate-100 dark:bg-slate-900 border-l border-slate-300 dark:border-slate-700"></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {deviationMonths.length > 0 && data.deviations.length > 0 && (
                <div className="flex justify-end mt-6">
                    <div className="w-full overflow-hidden rounded-md border border-slate-300 dark:border-slate-700 shadow-sm">
                        <TooltipProvider>
                            <table className="w-full text-sm border-collapse">
                                <thead>
                                    <tr className="bg-[#002060] text-white">
                                        <th className="px-4 py-2 text-left font-bold border-r border-white/20">Resumen Desviaciones Mensuales</th>
                                        {data.deviations.map((r) => (
                                            <th key={r.to_month} className="px-4 py-2 text-center font-bold border-r border-white/20">
                                                {devLabel(r.to_month, months)}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-slate-900">
                                    <tr className="border-b border-slate-200 dark:border-slate-800">
                                        <td className={summaryHead}>
                                            <SummaryLabel label="T10-Alzas" help={<>Suma total de los incrementos de costo de los servicios que <strong>subieron</strong> frente al mes anterior.</>} />
                                        </td>
                                        {data.deviations.map((r) => (
                                            <td key={r.to_month} className="px-4 py-2 text-right text-amber-500 font-bold border-r border-slate-200">
                                                {formatCurrency(r.increases)}
                                            </td>
                                        ))}
                                    </tr>
                                    <tr className="border-b border-slate-200 dark:border-slate-800">
                                        <td className={summaryHead}>
                                            <SummaryLabel label="T10-Bajas" help={<>Suma total de los ahorros o reducciones de costo de los servicios que <strong>bajaron</strong> frente al mes anterior.</>} />
                                        </td>
                                        {data.deviations.map((r) => (
                                            <td key={r.to_month} className="px-4 py-2 text-right text-emerald-500 font-bold border-r border-slate-200">
                                                {formatCurrency(r.decreases)}
                                            </td>
                                        ))}
                                    </tr>
                                    <tr className="bg-slate-100 dark:bg-slate-800">
                                        <td className={summaryHead}>
                                            <SummaryLabel label="Neto" help={<>Balance final del mes (Alzas + Bajas). Un valor negativo (en verde) indica que hubo un <strong>ahorro real global</strong> en ese mes.</>} />
                                        </td>
                                        {data.deviations.map((r) => (
                                            <td key={r.to_month} className={`px-4 py-2 text-right font-bold border-r border-slate-200 ${r.net < 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                                                {formatCurrency(r.net)}
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </TooltipProvider>
                    </div>
                </div>
            )}
        </div>
    );
};
