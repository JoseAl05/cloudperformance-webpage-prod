'use client'

import { Activity, Cpu, DollarSign, HardDrive, Network, PiggyBank, Server } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { BreakdownCard } from '@/components/shared/BreakdownCard';
import { StatCard, StatCardColor } from '@/components/shared/StatCard';
import { formatCurrency } from '@/lib/format';
import { formatValue, metricKey, toNumberOrNull } from '@/lib/consumption';
import { combineSummary, getUnusedMetric, resourceField, summaryFromResources } from '@/lib/unused';
import type { UnusedMetricSummary, UnusedResource } from '@/interfaces/unused';
import type { BreakdownDef, UnusedViewConfig } from '@/components/shared/unused/types';

const metricIcon = (metric: string): LucideIcon => {
    const key = metricKey(metric);
    if (key.includes('cpu')) return Cpu;
    if (key.includes('network') || key.includes('connection') || key.includes('flow') || key.includes('bytes')) return Network;
    if (key.includes('disk') || key.includes('volume') || key.includes('memory') || key.includes('burst') || key.includes('storage')) return HardDrive;
    return Activity;
};

const COLORS: StatCardColor[] = ['blue', 'purple', 'amber', 'green', 'slate'];

const breakdownEntries = (breakdown: BreakdownDef, resources: UnusedResource[]): Array<[string, number]> => {
    const totals = new Map<string, number>();
    resources.forEach((r) => {
        if (breakdown.measure === 'cost' && r.cost === null) return;
        const value = resourceField(r, breakdown.key);
        const label = value === null || value === undefined || value === '' ? breakdown.emptyLabel ?? 'Sin dato' : String(value);
        totals.set(label, (totals.get(label) ?? 0) + (breakdown.measure === 'cost' ? r.cost ?? 0 : 1));
    });
    return [...totals.entries()];
};

const UnusedBreakdownCard = ({ breakdown, resources, currency }: { breakdown: BreakdownDef; resources: UnusedResource[]; currency: string }) => (
    <BreakdownCard
        title={breakdown.label}
        entries={breakdownEntries(breakdown, resources)}
        format={breakdown.measure === 'cost' ? (value) => formatCurrency(value, { currency }) : undefined}
    />
);

interface UnusedCardsProps {
    config: UnusedViewConfig;
    summary: UnusedMetricSummary[];
    resources: UnusedResource[];
}

export const UnusedCards = ({ config, summary, resources }: UnusedCardsProps) => {
    const withCost = resources.filter((r) => r.cost !== null);
    const withSavings = resources.filter((r) => r.potential_savings !== null);
    const totalCost = withCost.reduce((sum, r) => sum + (r.cost ?? 0), 0);
    const costCurrency = withCost[0]?.currency ?? 'USD';
    const totalSavings = withSavings.reduce((sum, r) => sum + (r.potential_savings ?? 0), 0);
    const underutilized = resources.filter((r) => r.diagnosis.status === 'underutilized').length;
    const lowUsage = resources.filter((r) => r.diagnosis.status === 'low_usage').length;
    const totals = (config.attributes ?? []).filter((a) => a.total);
    const costBreakdowns = withCost.length > 0 ? (config.breakdowns ?? []).filter((b) => b.measure === 'cost') : [];
    const countBreakdowns = (config.breakdowns ?? []).filter((b) => b.measure !== 'cost');
    const topCards = (withCost.length > 0 ? 1 : 0) + (withSavings.length > 0 ? 1 : 0) + costBreakdowns.length;

    return (
        <div className="space-y-4">
            {(withCost.length > 0 || withSavings.length > 0) && (
                <div className={`grid grid-cols-1 ${topCards > 1 ? 'md:grid-cols-2' : ''} gap-4`}>
                    {withCost.length > 0 && (
                        <StatCard
                            title={`Costo total ${config.serviceName}`}
                            value={formatCurrency(totalCost, { currency: costCurrency })}
                            description={`Gasto de los recursos analizados en el período seleccionado (${costCurrency}).`}
                            icon={DollarSign}
                            color="green"
                        />
                    )}
                    {costBreakdowns.map((breakdown) => (
                        <UnusedBreakdownCard key={`${breakdown.key}-cost`} breakdown={breakdown} resources={withCost} currency={costCurrency} />
                    ))}
                    {withSavings.length > 0 && (
                        <StatCard
                            title="Ahorro mensual estimado"
                            value={formatCurrency(totalSavings, { currency: 'USD' })}
                            description="Si se eliminan los recursos sin uso (USD por mes)."
                            icon={PiggyBank}
                            color="amber"
                        />
                    )}
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <StatCard
                    title="Recursos analizados"
                    value={resources.length}
                    unit={config.serviceName}
                    description={`${underutilized} infrautilizados · ${lowUsage} con bajo uso. ${config.diagnosisRule}`}
                    icon={Server}
                    color="red"
                />
                {totals.map((attr) => {
                    const total = resources.reduce((sum, r) => sum + (toNumberOrNull(r.attributes[attr.key]) ?? 0), 0);
                    return (
                        <StatCard
                            key={attr.key}
                            title={`${attr.label} (total)`}
                            value={attr.format && attr.format !== 'text' && attr.format !== 'boolean' && attr.format !== 'date'
                                ? formatValue(total, attr.format, attr.unit)
                                : total.toLocaleString('es-CL')}
                            description="Suma de la última sincronización de cada recurso."
                            icon={HardDrive}
                            color="slate"
                        />
                    );
                })}
                {countBreakdowns.map((breakdown) => (
                    <UnusedBreakdownCard key={breakdown.key} breakdown={breakdown} resources={resources} currency={costCurrency} />
                ))}
                {config.cardMetrics.map((group, i) => {
                    const values = config.summaryFromResources ? summaryFromResources(resources, group) : combineSummary(summary, group);
                    if (!values) return null;
                    const definition = getUnusedMetric(group.metrics[0], config.metricOverrides);
                    const fmt = (v: number | null) => formatValue(v, definition.format, definition.unit);
                    return (
                        <StatCard
                            key={group.label}
                            title={group.label}
                            value={fmt(values.avg)}
                            description={values.peak !== null ? `Promedio del período · peak ${fmt(values.peak)}` : 'Promedio del período'}
                            icon={metricIcon(group.metrics[0])}
                            color={COLORS[i % COLORS.length]}
                        />
                    );
                })}
            </div>
        </div>
    );
};
