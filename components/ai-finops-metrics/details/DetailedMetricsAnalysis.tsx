import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
    AlertCircle,
    BarChart3,
    CalendarClock,
    CheckCircle2,
    Cpu,
    DollarSign,
    Lightbulb,
    LineChart,
    MousePointerClick,
    Scale,
    Search,
    Target,
    TrendingUp,
    Zap,
    ArrowRight
} from 'lucide-react';
import {
    AiFinopsMetrics,
    CostVolatilityAnalysis,
    CpuEfficiencyAnalysis,
    ElasticityAnalysis,
    ForecastPeriod,
    MaturityAssessmentAnalysis,
    OpportunityCostAnalysis,
    ResourceAnalysisReport
} from '@/interfaces/ai-finops-metrics/aiFinopsMetricsInterfaces';

interface DetailedMetricsAnalysisProps {
    data: AiFinopsMetrics;
}

// Mapeo de opciones para el Selector
const METRIC_OPTIONS = [
    { value: 'opportunity_cost', label: 'Costo de Oportunidad', icon: DollarSign },
    { value: 'cost_volatility', label: 'Volatilidad de Costos', icon: TrendingUp },
    { value: 'cpu_efficiency', label: 'Eficiencia de CPU', icon: Cpu },
    { value: 'elasticity', label: 'Elasticidad', icon: Scale },
    { value: 'maturity_assessment', label: 'Evaluación de Madurez', icon: CheckCircle2 },
    { value: 'spending_forecast', label: 'Proyección de Gasto (Forecast)', icon: LineChart },
];

export const DetailedMetricsAnalysis = ({ data }: DetailedMetricsAnalysisProps) => {
    const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

    const renderContent = () => {
        switch (selectedMetric) {
            case 'opportunity_cost':
                return <StandardMetricDetail metricData={data.metrics_analysis.opportunity_cost} type="opportunity_cost" />;
            case 'cost_volatility':
                return <StandardMetricDetail metricData={data.metrics_analysis.cost_volatility} type="cost_volatility" />;
            case 'cpu_efficiency':
                return <StandardMetricDetail metricData={data.metrics_analysis.cpu_efficiency} type="cpu_efficiency" />;
            case 'elasticity':
                return <StandardMetricDetail metricData={data.metrics_analysis.elasticity} type="elasticity" />;
            case 'maturity_assessment':
                return <MaturityDetail metricData={data.metrics_analysis.maturity_assessment} />;
            case 'spending_forecast':
                return <ForecastDetail forecastData={data.spending_forecast} />;
            default:
                return <EmptyState />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header y Selector */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-muted/30 p-4 rounded-lg border">
                <div className="space-y-1">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Search className="h-5 w-5 text-blue-500" />
                        Explorador de Métricas
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Selecciona una categoría para profundizar en el análisis técnico.
                    </p>
                </div>
                <div className="w-full sm:w-[300px]">
                    <Select onValueChange={setSelectedMetric}>
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccionar métrica..." />
                        </SelectTrigger>
                        <SelectContent>
                            {METRIC_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    <div className="flex items-center gap-2">
                                        <option.icon className="h-4 w-4 text-muted-foreground" />
                                        <span>{option.label}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Área de Contenido Dinámico */}
            <div className="min-h-[400px] transition-all duration-300">
                {renderContent()}
            </div>
        </div>
    );
};

const MarkdownText = ({ content }: { content: string }) => {
    return (
        <ReactMarkdown
            components={{
                ul: ({ node, ...props }) => <ul className="list-disc pl-5 space-y-1" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal pl-5 space-y-1" {...props} />,
                li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                strong: ({ node, ...props }) => <span className="font-bold text-foreground" {...props} />,
                p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                a: ({ node, ...props }) => <a className="text-blue-500 hover:underline" {...props} />,
            }}
        >
            {content}
        </ReactMarkdown>
    );
};

// --- Sub-componente: Estado Vacío ---
const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg bg-muted/5 text-muted-foreground">
        <MousePointerClick className="h-12 w-12 mb-4 opacity-50" />
        <h4 className="text-lg font-medium">Ninguna métrica seleccionada</h4>
        <p className="text-sm">Selecciona una opción del menú superior para ver el detalle.</p>
    </div>
);

// --- Sub-componente: Detalle Estándar ---
interface StandardMetricDetailProps {
    metricData: OpportunityCostAnalysis | CostVolatilityAnalysis | CpuEfficiencyAnalysis | ElasticityAnalysis;
    type: 'opportunity_cost' | 'cost_volatility' | 'cpu_efficiency' | 'elasticity';
}

const StandardMetricDetail = ({ metricData, type }: StandardMetricDetailProps) => {

    // Aseguramos que resources sea siempre un array de ResourceAnalysisReport para poder iterar
    let resources: ResourceAnalysisReport[] = [];
    let kpiValue: React.ReactNode = null;
    let kpiLabel = "";

    if (type === 'opportunity_cost') {
        const d = metricData as OpportunityCostAnalysis;
        // resources_analysis es un OBJETO único, lo envolvemos en un array
        resources = d.resources_analysis ? [d.resources_analysis] : [];
        kpiLabel = "Ahorro Potencial";
        kpiValue = `$${d.total_potential_savings_usd.toLocaleString()}`;
    } else if (type === 'cost_volatility') {
        const d = metricData as CostVolatilityAnalysis;
        // anomalous_resources es un OBJETO único, lo envolvemos en un array
        resources = d.anomalous_resources ? [d.anomalous_resources] : [];
        kpiLabel = "Volatilidad Detectada";
        kpiValue = `${d.volatility_percentage}%`;
    } else if (type === 'cpu_efficiency') {
        const d = metricData as CpuEfficiencyAnalysis;
        // underutilized_instances es un OBJETO único, lo envolvemos en un array
        resources = d.underutilized_instances ? [d.underutilized_instances] : [];
        kpiLabel = "Utilización Promedio";
        kpiValue = `${d.average_cpu_utilization}%`;
    } else if (type === 'elasticity') {
        const d = metricData as ElasticityAnalysis;
        // scaling_groups_analysis es un OBJETO único, lo envolvemos en un array
        resources = d.scaling_groups_analysis ? [d.scaling_groups_analysis] : [];
        kpiLabel = "Puntaje de Elasticidad";
        kpiValue = d.elasticity_score;
    }

    const getStatusColor = (status: string) => {
        if (status === 'EXCELLENT') return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        if (status === 'WARNING') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    };

    return (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <Card>
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <CardTitle className="text-xl capitalize flex items-center gap-2">
                                {metricData.metric_name.replace(/_/g, ' ')}
                                <Badge className={getStatusColor(metricData.status)} variant="secondary">
                                    {metricData.status}
                                </Badge>
                            </CardTitle>
                            <CardDescription>Análisis detallado y hallazgos</CardDescription>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-medium text-muted-foreground uppercase">{kpiLabel}</p>
                            <p className="text-2xl font-bold">{kpiValue}</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="mt-4 space-y-6">
                    <div className="grid gap-6">
                        <div className="space-y-2">
                            <h4 className="font-semibold text-xl flex items-center gap-2 text-amber-600 dark:text-amber-500">
                                <AlertCircle className="h-4 w-4" />
                                Causa Raíz Detectada
                            </h4>
                            <div className="bg-amber-50/50 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-900 rounded-md">
                                <ScrollArea className="w-full rounded-md">
                                    <div className="p-4">
                                        <MarkdownText content={metricData.root_cause_analysis} />
                                    </div>
                                </ScrollArea>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h4 className="font-semibold text-xl flex items-center gap-2 text-blue-600 dark:text-blue-500">
                                <Lightbulb className="h-4 w-4" />
                                Recomendación Principal
                            </h4>
                            <div className="bg-blue-50/50 dark:bg-blue-950/10 border border-blue-100 dark:border-blue-900 rounded-md">
                                <ScrollArea className="w-full rounded-md">
                                    <div className="p-4">
                                        <MarkdownText content={metricData.recommendation} />
                                    </div>
                                </ScrollArea>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t">
                        <div>
                            <span className="text-xs text-muted-foreground uppercase font-bold">Prioridad</span>
                            <p className="text-sm font-medium">{metricData.priority}</p>
                        </div>
                        <div>
                            <span className="text-xs text-muted-foreground uppercase font-bold">Esfuerzo</span>
                            <p className="text-sm font-medium truncate" title={metricData.effort}>{metricData.effort.split('(')[0]}</p>
                        </div>
                        <div>
                            <span className="text-xs text-muted-foreground uppercase font-bold">Riesgo</span>
                            <p className="text-sm font-medium truncate" title={metricData.risk}>{metricData.risk.split('(')[0]}</p>
                        </div>
                        <div>
                            <span className="text-xs text-muted-foreground uppercase font-bold">Asignado a</span>
                            <p className="text-sm font-medium">{metricData.assigned_to}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {resources && resources.length > 0 ? (
                resources.map((report, idx) => (
                    <Card key={idx}>
                        <CardHeader>
                            <CardTitle className="text-base font-semibold">
                                Recursos Analizados ({report.resources_flagged_count} de {report.resources_analyzed_count} afectados)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[300px] w-full rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Recurso</TableHead>
                                            <TableHead>Tipo</TableHead>
                                            <TableHead>Evidencia</TableHead>
                                            <TableHead>Acción Sugerida</TableHead>
                                            <TableHead className="text-right">Ahorro Est.</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {/* Aquí accedemos correctamente al array 'details' dentro del objeto ResourceAnalysisReport */}
                                        {report.details && report.details.length > 0 ? (
                                            report.details.map((resource, rIdx) => (
                                                <TableRow key={rIdx}>
                                                    <TableCell className="font-medium text-xs">
                                                        {resource.resource_name}
                                                        <div className="text-[10px] text-muted-foreground">{resource.resource_id}</div>
                                                    </TableCell>
                                                    <TableCell className="text-xs">{resource.resource_type}</TableCell>
                                                    <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate" title={resource.specific_evidence}>
                                                        {resource.specific_evidence}
                                                    </TableCell>
                                                    <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate" title={resource.suggested_action}>
                                                        {resource.suggested_action}
                                                    </TableCell>
                                                    <TableCell className="text-right text-xs font-mono">
                                                        {resource.potential_savings_usd ? `$${resource.potential_savings_usd}` : '-'}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center text-xs text-muted-foreground py-4">
                                                    No hay detalles de recursos disponibles.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                ))
            ) : (
                <div className="text-center p-8 text-muted-foreground bg-muted/10 rounded-lg border border-dashed">
                    No se detectaron recursos específicos afectados para este reporte.
                </div>
            )}
        </div>
    );
};

// --- Sub-componente: Detalle Madurez ---
const MaturityDetail = ({ metricData }: { metricData: MaturityAssessmentAnalysis }) => {
    return (
        <Card className="animate-in fade-in zoom-in-95 duration-300">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-6 w-6 text-purple-500" />
                    Evaluación de Madurez FinOps
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex flex-col items-center justify-center p-6 bg-muted/20 rounded-lg border">
                    <h3 className="text-4xl font-extrabold text-purple-600 dark:text-purple-400 mb-2">
                        {metricData.finops_maturity_level}
                    </h3>
                    <p className="text-center max-w-lg text-foreground">
                        {metricData.maturity_level_description}
                    </p>
                </div>

                <div className="grid gap-6">
                    <div className="space-y-2">
                        <span className="font-semibold text-sm flex items-center gap-2 text-amber-600 dark:text-amber-500">
                            <AlertCircle className="h-4 w-4" /> Análisis de Causa Raíz
                        </span>
                        <div className="bg-amber-50/50 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-900 rounded-md">
                            <ScrollArea className="w-full rounded-md">
                                <div className="p-4">
                                    <MarkdownText content={metricData.root_cause_analysis} />
                                </div>
                            </ScrollArea>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <span className="font-semibold text-sm flex items-center gap-2 text-blue-600 dark:text-blue-500">
                            <Lightbulb className="h-4 w-4" /> Recomendación Estratégica
                        </span>
                        <div className="bg-blue-50/50 dark:bg-blue-950/10 border border-blue-100 dark:border-blue-900 rounded-md">
                            <ScrollArea className="w-full rounded-md">
                                <div className="p-4">
                                    <MarkdownText content={metricData.recommendation} />
                                </div>
                            </ScrollArea>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

// --- Sub-componente: Detalle Forecast ---
const ForecastDetail = ({ forecastData }: { forecastData: AiFinopsMetrics['spending_forecast'] }) => {
    return (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <LineChart className="h-6 w-6 text-blue-500" />
                        Proyección de Gasto
                    </CardTitle>
                    <CardDescription>
                        Análisis predictivo basado en {forecastData.data_points_analyzed} puntos de datos históricos.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-100 dark:border-blue-900 mb-6">
                        <h4 className="font-semibold text-blue-700 dark:text-blue-300 text-sm mb-1">Estrategia utilizada</h4>
                        <MarkdownText content={forecastData.strategy_used} />
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-100 dark:border-blue-900 mb-6">
                        <h4 className="font-semibold text-blue-700 dark:text-blue-300 text-sm mb-1">Recomendación del Modelo</h4>
                        <MarkdownText content={forecastData.recommendation} />
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Tarjeta Corto Plazo */}
                        <div>
                            <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wide">
                                <Zap className="h-4 w-4 text-amber-500" />
                                Corto Plazo
                            </h4>
                            <ForecastCard periods={forecastData.short_term_forecast} />
                        </div>

                        {/* Tarjeta Largo Plazo */}
                        <div>
                            <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wide">
                                <BarChart3 className="h-4 w-4 text-indigo-500" />
                                Largo Plazo
                            </h4>
                            <ForecastCard periods={forecastData.long_term_forecast} />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

// NUEVO COMPONENTE: ForecastCard (Reemplaza a la tabla)
const ForecastCard = ({ periods }: { periods: ForecastPeriod }) => {

    // Helper para el color de confianza
    const getConfidenceColor = (confidence: string) => {
        const c = confidence.toLowerCase();
        if (c.includes('high')) return 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
        if (c.includes('medium')) return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800';
        return 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
    };

    return (
        <div className="border rounded-xl bg-card shadow-sm overflow-hidden flex flex-col h-full">
            {/* Cabecera con Datos Clave */}
            <div className="p-5 bg-muted/20 border-b flex flex-col gap-4">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <CalendarClock className="h-4 w-4" />
                        <span className="text-sm font-medium">{periods.period}</span>
                    </div>
                    <Badge variant="outline" className={`capitalize ${getConfidenceColor(periods.confidence_level)}`}>
                        {periods.confidence_level}
                    </Badge>
                </div>
                <div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Gasto Proyectado</span>
                    <div className="text-3xl font-bold tracking-tight mt-1">
                        ${periods.predicted_spend_usd.toLocaleString()}
                    </div>
                </div>
            </div>

            {/* Sección de Key Drivers */}
            <div className="p-5 flex-grow flex flex-col">
                <h5 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-500" />
                    Key Drivers (Factores Clave)
                </h5>
                <div className="text-sm text-muted-foreground space-y-3">
                    {periods.key_drivers.map((driver, idx) => (
                        <div key={idx} className="flex items-start gap-2.5">
                            <ArrowRight className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                            <span className="leading-snug">{driver}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};