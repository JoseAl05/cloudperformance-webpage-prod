'use client'

import { Activity, Cpu, DollarSign, HardDrive, Network, PiggyBank, Server } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
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

const BreakdownCard = ({ breakdown, resources }: { breakdown: BreakdownDef; resources: UnusedResource[] }) => {
    const counts = new Map<string, number>();
    resources.forEach((r) => {
        const value = resourceField(r, breakdown.key);
        const label = value === null || value === undefined || value === '' ? 'Sin dato' : String(value);
        counts.set(label, (counts.get(label) ?? 0) + 1);
    });
    const entries = [...counts.entries()].sort((a, b) => b[1] - a[1]);
    const max = Math.max(1, ...entries.map(([, n]) => n));
    return (
        <Card className="border-l-4 border-l-slate-400 shadow-sm">
            <CardContent className="p-6 space-y-3">
                <p className="text-sm font-medium text-muted-foreground">{breakdown.label}</p>
                {entries.map(([label, n]) => (
                    <div key={label} className="space-y-1">
                        <div className="flex justify-between text-xs gap-2">
                            <span className="truncate" title={label}>{label}</span>
                            <span className="font-bold">{n}</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-blue-500" style={{ width: `${(n / max) * 100}%` }} />
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};

interface UnusedCardsProps {
    config: UnusedViewConfig;
    summary: UnusedMetricSummary[];
    resources: UnusedResource[];
}

export const UnusedCards = ({ config, summary, resources }: UnusedCardsProps) => {
    const withCost = resources.filter((r) => r.cost !== null);
    const withSavings = resources.filter((r) => r.potential_savings !== null);
    const totalCost = withCost.reduce((sum, r) => sum + (r.cost ?? 0), 0);
    const totalSavings = withSavings.reduce((sum, r) => sum + (r.potential_savings ?? 0), 0);
    const underutilized = resources.filter((r) => r.diagnosis.status === 'underutilized').length;
    const lowUsage = resources.filter((r) => r.diagnosis.status === 'low_usage').length;
    const totals = (config.attributes ?? []).filter((a) => a.total);

    return (
        <div className="space-y-4">
            {(withCost.length > 0 || withSavings.length > 0) && (
                <div className={`grid grid-cols-1 ${withCost.length > 0 && withSavings.length > 0 ? 'md:grid-cols-2' : ''} gap-4`}>
                    {withCost.length > 0 && (
                        <StatCard
                            title={`Costo total ${config.serviceName}`}
                            value={formatCurrency(totalCost, { currency: 'USD' })}
                            description="Gasto de los recursos analizados en el período seleccionado (USD)."
                            icon={DollarSign}
                            color="green"
                        />
                    )}
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
                {(config.breakdowns ?? []).map((breakdown) => (
                    <BreakdownCard key={breakdown.key} breakdown={breakdown} resources={resources} />
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
