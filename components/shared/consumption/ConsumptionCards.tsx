'use client'

import { Activity, Database, DollarSign, HardDrive, TrendingDown, Zap } from 'lucide-react';
import { StatCard, StatCardColor } from '@/components/shared/StatCard';
import { formatCurrency } from '@/lib/format';
import { formatValue, getMetricDefinition } from '@/lib/consumption';
import type { ConsumptionSummary, EfficiencyLevel, EfficiencyResponse } from '@/interfaces/consumption';
import type { ConsumptionViewConfig } from '@/components/shared/consumption/types';

const LEVEL_COLOR: Record<EfficiencyLevel, StatCardColor> = {
    low: 'red',
    medium: 'amber',
    high: 'green',
    no_data: 'slate',
};

const METRIC_COLORS: StatCardColor[] = ['blue', 'green', 'amber', 'purple', 'slate'];

interface ConsumptionCardsProps {
    config: ConsumptionViewConfig;
    summary?: ConsumptionSummary;
    efficiency?: EfficiencyResponse;
}

export const ConsumptionCards = ({ config, summary, efficiency }: ConsumptionCardsProps) => {
    const showEfficiency = !!efficiency && efficiency.global_efficiency_level !== 'no_data';
    const costDescription = !summary?.has_billing
        ? 'Sin detalle de facturación para estos recursos.'
        : summary.cost_total === 0
            ? 'Sin costo registrado en el período (p. ej. capa gratuita).'
            : 'Costo total del período seleccionado.';

    return (
        <div className="space-y-6">
            {showEfficiency && (
                <StatCard
                    title="Eficiencia Global"
                    value={efficiency.global_efficiency_score !== null
                        ? `${efficiency.global_efficiency_score.toFixed(1)}%`
                        : efficiency.global_efficiency_label}
                    subtitle={efficiency.global_efficiency_score !== null ? efficiency.global_efficiency_label : undefined}
                    description={efficiency.metrics_detail[0]?.samples
                        ? `Calculada sobre ${efficiency.metrics_detail[0].samples.toLocaleString('es-CL')} muestras.`
                        : 'Puntaje unificado de eficiencia de recursos.'}
                    icon={Zap}
                    color={LEVEL_COLOR[efficiency.global_efficiency_level]}
                    large
                />
            )}

            {summary && (
                <div className={`grid grid-cols-1 md:grid-cols-2 ${config.showStorageInefficient ? 'xl:grid-cols-5' : 'xl:grid-cols-4'} gap-4`}>
                    <StatCard
                        title={config.labels.total}
                        value={summary.total_resources}
                        unit={config.labels.unit}
                        description={`Total de recursos ${config.serviceName}.`}
                        icon={Database}
                        color="blue"
                    />
                    <StatCard
                        title={config.labels.idle}
                        value={summary.idle_resources}
                        unit="sin uso"
                        description="Recursos encendidos sin actividad."
                        icon={Activity}
                        color="red"
                    />
                    <StatCard
                        title={config.labels.underutilized}
                        value={summary.underutilized_resources}
                        unit="recursos"
                        description="Con sobre-provisionamiento de recursos."
                        icon={TrendingDown}
                        color="amber"
                    />
                    {config.showStorageInefficient && (
                        <StatCard
                            title="Almacenamiento Ineficiente"
                            value={summary.storage_inefficient_resources ?? 0}
                            unit="recursos"
                            description="Con bajo uso del almacenamiento asignado."
                            icon={HardDrive}
                            color="purple"
                        />
                    )}
                    <StatCard
                        title="Costo Total"
                        value={summary.cost_total !== null ? formatCurrency(summary.cost_total, { currency: summary.currency ?? 'USD' }) : '—'}
                        unit={summary.currency ?? undefined}
                        description={costDescription}
                        icon={DollarSign}
                        color="green"
                    />
                </div>
            )}

            {efficiency && efficiency.metrics_detail.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    {efficiency.metrics_detail.map((detail, index) => {
                        const definition = getMetricDefinition(detail.metric);
                        return (
                            <StatCard
                                key={detail.metric}
                                title={`${definition.label} (promedio)`}
                                value={formatValue(detail.avg_value, definition.format, definition.unit)}
                                description={`Máx observado: ${formatValue(detail.max_value, definition.format, definition.unit)}`}
                                subtitle={detail.efficiency_score !== null ? `Score Eficiencia: ${detail.efficiency_score.toFixed(0)}/100` : undefined}
                                icon={Activity}
                                color={METRIC_COLORS[index % METRIC_COLORS.length]}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
};
