import React, { useEffect, useState } from 'react';
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
import { Separator } from '@/components/ui/separator';
import {
    AlertCircle,
    BarChart3,
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
    Activity,
    Server,
    Hammer,
    ChevronLeft,
    ChevronRight,
    FilterX,
    TrendingDown,
    Minus,
    Percent,
    Layers,
    CalendarRange,
    Award,
    ShieldCheck,
    StopCircle
} from 'lucide-react';
import {
    AiFinopsMetrics,
    CostVolatilityAnalysis,
    CpuEfficiencyAnalysis,
    ElasticityAnalysis,
    ForecastPeriod,
    MaturityAssessmentAnalysis,
    OpportunityCostAnalysis,
    ResourceDetail,
    ForecastPeriodKeyDrivers
} from '@/interfaces/ai-finops-metrics/aiFinopsMetricsInterfaces';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { IdleResources } from '@/components/ai-finops-metrics/summary/IdleResources';

interface DetailedMetricsAnalysisProps {
    data: AiFinopsMetrics;
}

const METRIC_OPTIONS = [
    { value: 'opportunity_cost', label: 'Costo de Oportunidad', icon: DollarSign },
    { value: 'cost_volatility', label: 'Volatilidad de Costos', icon: TrendingUp },
    { value: 'cpu_efficiency', label: 'Eficiencia de CPU', icon: Cpu },
    { value: 'elasticity', label: 'Elasticidad', icon: Scale },
    { value: 'maturity_assessment', label: 'Evaluación de Madurez', icon: CheckCircle2 },
    { value: 'spending_forecast', label: 'Proyección de Gasto (Forecast)', icon: LineChart },
    { value: 'idle_resources', label: 'Recursos Inactivos', icon: StopCircle }
];

export const DetailedMetricsAnalysis = ({ data }: DetailedMetricsAnalysisProps) => {
    const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

    const renderContent = () => {
        if (!data || !data.metrics_analysis) return <EmptyState />;

        switch (selectedMetric) {
            case 'opportunity_cost':
                return <OpportunityCostDetail metricData={data.metrics_analysis.opportunity_cost} />;
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
            case 'idle_resources':
                return <IdleResources data={data} />
            default:
                return <EmptyState />;
        }
    };

    return (
        <div className="space-y-6">
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

            <div className="min-h-[400px] transition-all duration-300">
                {renderContent()}
            </div>
        </div>
    );
};

// --- Utils ---
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

const getStatusColor = (status: string) => {
    switch (status) {
        case 'EXCELLENT': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-200 dark:border-green-800';
        case 'WARNING': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
        case 'CRITICAL': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border-red-200 dark:border-red-800';
        default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
};

const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg bg-muted/5 text-muted-foreground">
        <MousePointerClick className="h-12 w-12 mb-4 opacity-50" />
        <h4 className="text-lg font-medium">Ninguna métrica seleccionada</h4>
        <p className="text-sm">Selecciona una opción del menú superior para ver el detalle.</p>
    </div>
);

// --- Sub-componente: Detalle Estándar ---
interface StandardMetricDetailProps {
    metricData: CostVolatilityAnalysis | CpuEfficiencyAnalysis | ElasticityAnalysis;
    type: 'cost_volatility' | 'cpu_efficiency' | 'elasticity';
}

const ITEMS_PER_PAGE = 5;

const StandardMetricDetail = ({ metricData, type }: StandardMetricDetailProps) => {
    // Estados para paginación y búsqueda
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    let resourceList: ResourceDetail[] = [];
    let kpiValue: React.ReactNode = null;
    let kpiLabel = "";
    let extraInfo: React.ReactNode = null;

    // Extracción de Datos (Misma lógica anterior)
    if (type === 'cost_volatility') {
        const d = metricData as CostVolatilityAnalysis;
        kpiLabel = "Volatilidad";
        kpiValue = `${d.volatility_percentage.toFixed(2)}%`;
        const anomalousCount = d.anomalous_resources?.services_flagged_count || (d as unknown).anomalous_services?.services_flagged_count || 0;
        extraInfo = (
            <div className="mt-2 text-xs text-muted-foreground">
                <span className="font-semibold">{anomalousCount}</span> servicios anómalos detectados
            </div>
        );
    }
    else if (type === 'cpu_efficiency') {
        const d = metricData as CpuEfficiencyAnalysis;
        kpiLabel = "Utilización Promedio";
        kpiValue = `${d.average_cpu_utilization.toFixed(2)}%`;
        if (d.underutilized_instances && d.underutilized_instances.details) {
            resourceList = d.underutilized_instances.details;
        }
    }
    else if (type === 'elasticity') {
        const d = metricData as ElasticityAnalysis;
        kpiLabel = "Puntaje Elasticidad";
        kpiValue = d.elasticity_score;
        if (d.scaling_groups_analysis && d.scaling_groups_analysis.details) {
            resourceList = d.scaling_groups_analysis.details;
        }
    }

    // --- Lógica de Filtrado y Paginación ---

    // 1. Filtrar
    const filteredResources = resourceList.filter(r => {
        const term = searchTerm.toLowerCase();
        return (
            r.resource_name.toLowerCase().includes(term) ||
            r.resource_id.toLowerCase().includes(term) ||
            r.resource_type.toLowerCase().includes(term)
        );
    });

    // 2. Calcular Páginas
    const totalPages = Math.ceil(filteredResources.length / ITEMS_PER_PAGE);

    // 3. Obtener items actuales
    const currentResources = filteredResources.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Resetear a página 1 cuando cambia la búsqueda
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // Helpers para color de estado (Misma lógica)
    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'EXCELLENT': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-200 dark:border-green-800';
            case 'WARNING': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
            case 'CRITICAL': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border-red-200 dark:border-red-800';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            {/* KPI Card Principal (Sin cambios) */}
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <CardTitle className="text-xl flex items-center gap-3">
                                {metricData.metric_name}
                                <Badge className={`${getStatusStyle(metricData.status)} border`} variant="outline">
                                    {metricData.status}
                                </Badge>
                            </CardTitle>
                            <CardDescription>
                                <span className="font-medium">Asignado a:</span> {metricData.assigned_to}
                            </CardDescription>
                        </div>
                        <div className="text-right bg-muted/20 p-3 rounded-lg border">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{kpiLabel}</p>
                            <p className="text-2xl font-bold text-foreground">{kpiValue}</p>
                            {extraInfo}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <h4 className="font-semibold text-sm flex items-center gap-2 text-amber-600 dark:text-amber-500 uppercase tracking-wide">
                                <AlertCircle className="h-4 w-4" /> Análisis de Causa Raíz
                            </h4>
                            <div className="text-sm text-muted-foreground bg-amber-50/50 dark:bg-amber-950/10 p-4 rounded-md border border-amber-100 dark:border-amber-900">
                                <MarkdownText content={metricData.root_cause_analysis} />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <h4 className="font-semibold text-sm flex items-center gap-2 text-blue-600 dark:text-blue-500 uppercase tracking-wide">
                                <Lightbulb className="h-4 w-4" /> Recomendación
                            </h4>
                            <div className="text-sm text-muted-foreground bg-blue-50/50 dark:bg-blue-950/10 p-4 rounded-md border border-blue-100 dark:border-blue-900">
                                <MarkdownText content={metricData.recommendation} />
                            </div>
                        </div>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <div>
                            <span className="text-xs text-muted-foreground uppercase font-bold">Prioridad</span>
                            <div className="flex items-center gap-2 mt-1">
                                <div className={`h-2 w-2 rounded-full ${metricData.priority === 'Critical' ? 'bg-red-500' : metricData.priority === 'Warning' ? 'bg-yellow-500' : 'bg-green-500'}`} />
                                <p className="text-sm font-medium">{metricData.priority}</p>
                            </div>
                        </div>
                        <div>
                            <span className="text-xs text-muted-foreground uppercase font-bold">Esfuerzo</span>
                            <p className="text-sm font-medium mt-1 truncate" title={metricData.effort}>{metricData.effort.split('(')[0].trim()}</p>
                        </div>
                        <div>
                            <span className="text-xs text-muted-foreground uppercase font-bold">Riesgo</span>
                            <p className="text-sm font-medium mt-1 truncate" title={metricData.risk}>{metricData.risk.split('(')[0].trim()}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* SECCIÓN DE RECURSOS CON FILTRO Y PAGINACIÓN */}
            {resourceList && resourceList.length > 0 && (
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4">
                        <h4 className="font-semibold flex items-center gap-2 text-lg">
                            <Activity className="h-5 w-5 text-gray-500" />
                            Recursos Identificados
                            <Badge variant="secondary" className="ml-1">{resourceList.length}</Badge>
                        </h4>

                        {/* Buscador */}
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Filtrar por nombre, ID o tipo..."
                                className="pl-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm("")}
                                    className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                                >
                                    <FilterX className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Lista de Tarjetas Paginada */}
                    <div className="grid gap-4 min-h-[200px]">
                        {currentResources.length > 0 ? (
                            currentResources.map((resource, idx) => (
                                <Card key={idx} className="overflow-hidden border-l-4 border-l-blue-500 dark:border-l-blue-700">
                                    <CardContent className="p-4 sm:p-5 space-y-4">
                                        <div className="flex flex-col sm:flex-row justify-between gap-3">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="font-semibold text-base">{resource.resource_name}</span>
                                                    <Badge variant="outline" className="text-xs font-normal bg-muted/50">
                                                        {resource.resource_type}
                                                    </Badge>
                                                </div>
                                                <div className="text-xs font-mono text-muted-foreground break-all flex items-center gap-1">
                                                    <Server className="h-3 w-3 inline" />
                                                    {resource.resource_id}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 bg-green-50 dark:bg-green-950/20 px-3 py-1.5 rounded border border-green-100 dark:border-green-900 self-start shrink-0">
                                                <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                <div className="text-right">
                                                    <div className="text-[10px] text-muted-foreground uppercase leading-none mb-0.5">Ahorro Est.</div>
                                                    <div className="font-bold text-sm text-green-700 dark:text-green-300 leading-none">
                                                        {resource.potential_savings_usd ? `$${resource.potential_savings_usd}` : '-'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <Separator className="bg-border/60" />
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <h5 className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                                                    <Search className="h-3.5 w-3.5" /> Evidencia Técnica
                                                </h5>
                                                <p className="text-sm text-muted-foreground leading-relaxed bg-muted/20 p-3 rounded border border-border/50">
                                                    {resource.specific_evidence}
                                                </p>
                                            </div>
                                            <div className="space-y-2">
                                                <h5 className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                                                    <Hammer className="h-3.5 w-3.5 text-blue-500" /> Acción Sugerida
                                                </h5>
                                                <p className="text-sm text-foreground leading-relaxed bg-blue-50/30 dark:bg-blue-950/10 p-3 rounded border border-blue-100/50 dark:border-blue-900/50">
                                                    {resource.suggested_action}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground border-2 border-dashed rounded-lg bg-muted/5">
                                <Search className="h-10 w-10 mb-2 opacity-20" />
                                <p>No se encontraron recursos que coincidan con tu búsqueda.</p>
                            </div>
                        )}
                    </div>

                    {/* Controles de Paginación */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between border-t pt-4">
                            <div className="text-xs text-muted-foreground">
                                Mostrando <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> - <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, filteredResources.length)}</span> de <span className="font-medium">{filteredResources.length}</span> recursos
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    <span className="sr-only sm:not-sr-only sm:ml-2">Anterior</span>
                                </Button>
                                <div className="text-xs font-medium bg-muted px-3 py-2 rounded">
                                    Pág {currentPage} de {totalPages}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                >
                                    <span className="sr-only sm:not-sr-only sm:mr-2">Siguiente</span>
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// --- Sub-componente: Detalle Costo de Oportunidad ---
const OpportunityCostDetail = ({ metricData }: { metricData: OpportunityCostAnalysis }) => {
    return (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <CardTitle className="text-xl flex items-center gap-3">
                                {metricData.metric_name}
                                <Badge className={`${getStatusColor(metricData.status)} border`} variant="outline">
                                    {metricData.status}
                                </Badge>
                            </CardTitle>
                            <CardDescription>
                                <span className="font-medium">Asignado a:</span> {metricData.assigned_to}
                            </CardDescription>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                        <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg border border-green-100 dark:border-green-900">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                                <TrendingUp className="h-3.5 w-3.5 text-green-600 dark:text-green-400" /> Ahorro Potencial Total
                            </p>
                            <p className="text-2xl font-bold text-green-700 dark:text-green-300 tabular-nums mt-1">
                                ${metricData.total_potential_savings_usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                        </div>
                        <div className="bg-red-50 dark:bg-red-950/20 p-3 rounded-lg border border-red-100 dark:border-red-900">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                                <TrendingDown className="h-3.5 w-3.5 text-red-600 dark:text-red-400" /> Costo de Inacción Total
                            </p>
                            <p className="text-2xl font-bold text-red-700 dark:text-red-300 tabular-nums mt-1">
                                ${metricData.total_inaction_costs_usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <h4 className="font-semibold text-sm flex items-center gap-2 text-amber-600 dark:text-amber-500 uppercase tracking-wide">
                                <AlertCircle className="h-4 w-4" /> Análisis de Causa Raíz
                            </h4>
                            <div className="text-sm text-muted-foreground bg-amber-50/50 dark:bg-amber-950/10 p-4 rounded-md border border-amber-100 dark:border-amber-900">
                                <MarkdownText content={metricData.root_cause_analysis} />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <h4 className="font-semibold text-sm flex items-center gap-2 text-blue-600 dark:text-blue-500 uppercase tracking-wide">
                                <Lightbulb className="h-4 w-4" /> Recomendación
                            </h4>
                            <div className="text-sm text-muted-foreground bg-blue-50/50 dark:bg-blue-950/10 p-4 rounded-md border border-blue-100 dark:border-blue-900">
                                <MarkdownText content={metricData.recommendation} />
                            </div>
                        </div>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <div>
                            <span className="text-xs text-muted-foreground uppercase font-bold">Prioridad</span>
                            <div className="flex items-center gap-2 mt-1">
                                <div className={`h-2 w-2 rounded-full ${metricData.priority === 'Critical' ? 'bg-red-500' : metricData.priority === 'Warning' ? 'bg-yellow-500' : 'bg-green-500'}`} />
                                <p className="text-sm font-medium">{metricData.priority}</p>
                            </div>
                        </div>
                        <div>
                            <span className="text-xs text-muted-foreground uppercase font-bold">Esfuerzo</span>
                            <p className="text-sm font-medium mt-1 truncate" title={metricData.effort}>{metricData.effort.split('(')[0].trim()}</p>
                        </div>
                        <div>
                            <span className="text-xs text-muted-foreground uppercase font-bold">Riesgo</span>
                            <p className="text-sm font-medium mt-1 truncate" title={metricData.risk}>{metricData.risk.split('(')[0].trim()}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {metricData.recommendations_analysis && metricData.recommendations_analysis.length > 0 && (
                <div className="space-y-4">
                    <h4 className="font-semibold flex items-center gap-2 text-lg">
                        <Lightbulb className="h-5 w-5 text-blue-500" />
                        Análisis de Recomendaciones
                        <Badge variant="secondary" className="ml-1">{metricData.recommendations_analysis.length}</Badge>
                    </h4>
                    <div className="grid gap-4">
                        {metricData.recommendations_analysis.map((rec, idx) => (
                            <Card key={idx} className="overflow-hidden border-l-4 border-l-blue-500 dark:border-l-blue-700">
                                <CardContent className="p-4 sm:p-5 grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <h5 className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                                            <Lightbulb className="h-3.5 w-3.5 text-blue-500" /> Resumen de Recomendación
                                        </h5>
                                        <div className="text-sm text-foreground leading-relaxed bg-blue-50/30 dark:bg-blue-950/10 p-3 rounded border border-blue-100/50 dark:border-blue-900/50">
                                            <MarkdownText content={rec.recommendation_summary} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <h5 className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                                            <Search className="h-3.5 w-3.5" /> Análisis de Costo de Inacción
                                        </h5>
                                        <div className="text-sm text-muted-foreground leading-relaxed bg-muted/20 p-3 rounded border border-border/50">
                                            <MarkdownText content={rec.oci_analysis} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Sub-componente: Detalle Madurez ---
const MaturityDetail = ({ metricData }: { metricData: MaturityAssessmentAnalysis }) => {
    return (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <Card className="overflow-hidden border-purple-200 dark:border-purple-900">
                <div className="bg-purple-50 dark:bg-purple-950/20 p-6 flex flex-col items-center justify-center border-b border-purple-100 dark:border-purple-900">
                    <CheckCircle2 className="h-10 w-10 text-purple-600 dark:text-purple-400 mb-3" />
                    <h3 className="text-3xl font-extrabold text-foreground mb-2 text-center">
                        {metricData.metric_name}
                    </h3>
                    <Badge className={`${getStatusColor(metricData.status)} border`} variant="outline">
                        {metricData.status}
                    </Badge>
                </div>
                <CardContent className="pt-6 grid gap-6">
                    <div className="space-y-2">
                        <h4 className="font-semibold text-sm flex items-center gap-2 uppercase tracking-wide text-muted-foreground">
                            Recomendación Estratégica
                        </h4>
                        <div className="bg-muted/30 p-4 rounded-lg text-sm">
                            <MarkdownText content={metricData.recommendation} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-4">
                <h3 className="font-semibold text-lg">Capacidades Evaluadas</h3>
                {metricData.capabilities_assessed.map((capability, idx) => (
                    <Card key={idx} className="overflow-hidden">
                        <CardHeader className="bg-muted/20 py-3">
                            <div className="flex justify-between items-center gap-3">
                                <CardTitle className="text-sm font-semibold">{capability.capability}</CardTitle>
                                <Badge variant="outline" className="text-xs font-normal shrink-0">
                                    {capability.level}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4 grid gap-4 text-sm">
                            <div>
                                <span className="block text-xs font-bold uppercase text-muted-foreground mb-1">Evidencia</span>
                                <div className="p-3 bg-blue-50 dark:bg-blue-950/10 border border-blue-100 dark:border-blue-900 rounded text-blue-900 dark:text-blue-300 leading-relaxed">
                                    {capability.evidence}
                                </div>
                            </div>
                            <div>
                                <span className="block text-xs font-bold uppercase text-muted-foreground mb-1">Brecha Identificada</span>
                                <div className="p-3 bg-amber-50 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-900 rounded text-amber-900 dark:text-amber-300 leading-relaxed">
                                    {capability.gap}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

// --- Sub-componente: Detalle Forecast ---
const MODEL_LABELS: Record<string, string> = {
    autoets: 'AutoETS',
    autoarima: 'AutoARIMA',
    autotheta: 'AutoTheta',
    ces: 'CES',
    rwd: 'Random Walk + Drift',
};

const getConfidenceClasses = (confidence: string) => {
    const c = (confidence || '').toLowerCase();
    if (c.includes('high') || c.includes('alta'))
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    if (c.includes('medium') || c.includes('media'))
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
};

const TrendIcon = ({ direction }: { direction: string }) => {
    if (direction === 'increasing') return <TrendingUp className="h-4 w-4 text-red-500" />;
    if (direction === 'decreasing') return <TrendingDown className="h-4 w-4 text-green-500" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
};

const trendLabel = (direction: string) => {
    if (direction === 'increasing') return 'Al alza';
    if (direction === 'decreasing') return 'A la baja';
    return 'Estable';
};

const ForecastDetail = ({ forecastData }: { forecastData: AiFinopsMetrics['spending_forecast'] }) => {
    console.log(forecastData);
    const det = forecastData.deterministic;
    const ai = forecastData.ai_interpretation;
    const recommendedLabel = MODEL_LABELS[det.recommended_method] ?? det.recommended_method;

    return (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <LineChart className="h-6 w-6 text-blue-500" />
                        Proyección de Gasto (Forecast)
                    </CardTitle>
                    <CardDescription>
                        Basado en {det.data_points_analyzed} puntos de datos históricos
                        {' · '}campo <span className="font-mono">{det.field_used}</span>
                        {' · '}motor <span className="font-mono">{det.engine}</span>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6">
                        <div className="p-4 rounded-lg border bg-muted/20 flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950/40">
                                    <Award className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Método seleccionado</span>
                                    <div className="text-lg font-bold tracking-tight">{recommendedLabel}</div>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
                                <Badge className={`${getConfidenceClasses(det.confidence_level)} border-0`}>
                                    Confianza: {det.confidence_level}
                                </Badge>
                                <Badge variant="outline" className="gap-1">
                                    <CalendarRange className="h-3 w-3" />
                                    {det.season_length > 1 ? `Estacionalidad ${det.season_length}d` : 'Sin estacionalidad'}
                                </Badge>
                                <Badge variant="outline" className="gap-1">
                                    <ShieldCheck className="h-3 w-3" />
                                    {det.diagnostics.validation.performed
                                        ? `Validado · ${det.diagnostics.validation.n_windows} ventana(s) × ${det.diagnostics.validation.horizon_days}d`
                                        : 'Sin validación cruzada'}
                                </Badge>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                            <StatTile
                                icon={<TrendIcon direction={det.diagnostics.trend_direction} />}
                                label="Tendencia"
                                value={trendLabel(det.diagnostics.trend_direction)}
                                hint={`${det.diagnostics.trend_slope_usd_per_day >= 0 ? '+' : ''}$${det.diagnostics.trend_slope_usd_per_day.toFixed(4)}/día`}
                            />
                            <StatTile
                                icon={<DollarSign className="h-4 w-4 text-emerald-500" />}
                                label="Gasto diario medio"
                                value={`$${det.diagnostics.daily_mean_usd.toLocaleString()}`}
                            />
                            <StatTile
                                icon={<Percent className="h-4 w-4 text-indigo-500" />}
                                label="Volatilidad (CV)"
                                value={`${det.diagnostics.coefficient_of_variation_pct.toFixed(2)}%`}
                            />
                            <StatTile
                                icon={<CalendarRange className="h-4 w-4 text-blue-500" />}
                                label="Patrón semanal"
                                value={det.diagnostics.weekly_seasonality_detected ? 'Detectado' : 'No detectado'}
                            />
                        </div>

                        <div className="p-4 rounded-lg border bg-muted/20">
                            <h4 className="font-semibold text-sm mb-2 text-foreground">Estrategia Utilizada</h4>
                            <div className="text-sm text-muted-foreground">
                                <MarkdownText content={ai.strategy_used} />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <ForecastCard
                                periods={ai.short_term_forecast}
                                interval={det.interval_80_usd['30d']}
                                title="Corto Plazo"
                                icon={Zap}
                                iconColor="text-amber-500"
                            />
                            <ForecastCard
                                periods={ai.long_term_forecast}
                                interval={det.interval_80_usd['90d']}
                                title="Largo Plazo"
                                icon={BarChart3}
                                iconColor="text-indigo-500"
                            />
                        </div>

                        <ModelComparisonTable
                            projections={det.projections}
                            mape={det.backtest_mape_pct}
                            recommended={det.recommended_method}
                            modelsConsidered={det.diagnostics.models_considered}
                        />

                        {(det.preprocessing.outlier_dates_adjusted.length > 0 ||
                            det.preprocessing.trailing_days_dropped > 0) && (
                            <div className="p-3 rounded-lg border bg-muted/10 text-xs text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1">
                                <span className="flex items-center gap-1 font-medium text-foreground">
                                    <FilterX className="h-3.5 w-3.5" /> Preprocesamiento
                                </span>
                                <span>Días finales descartados: {det.preprocessing.trailing_days_dropped}</span>
                                {det.preprocessing.outlier_dates_adjusted.length > 0 && (
                                    <span>
                                        Anomalías ajustadas: {det.preprocessing.outlier_dates_adjusted.join(', ')}
                                    </span>
                                )}
                            </div>
                        )}

                        {/* {ai.formulas_used?.length > 0 && (
                            <div className="p-4 rounded-lg border bg-muted/20">
                                <h4 className="font-semibold text-sm mb-3 text-foreground flex items-center gap-2">
                                    <Layers className="h-4 w-4 text-muted-foreground" /> Métodos Aplicados
                                </h4>
                                <div className="space-y-3">
                                    {ai.formulas_used.map((f, idx) => (
                                        <div key={idx} className="pl-4 border-l-2 border-muted">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-sm font-semibold text-foreground">
                                                    {MODEL_LABELS[f.selected_method] ?? f.selected_method}
                                                </span>
                                                <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                                                    {f.formula}
                                                </code>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                                {f.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )} */}

                        <div className="p-4 rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-800">
                            <h4 className="font-semibold text-sm mb-2 text-blue-800 dark:text-blue-300 flex items-center gap-2">
                                <Lightbulb className="h-4 w-4" /> Recomendación del Modelo
                            </h4>
                            <div className="text-sm text-blue-700 dark:text-blue-400">
                                <MarkdownText content={ai.recommendation} />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

// Sub-componente: Tile de diagnóstico
const StatTile = ({
    icon,
    label,
    value,
    hint,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    hint?: string;
}) => (
    <div className="p-3 rounded-lg border bg-card flex flex-col gap-1">
        <div className="flex items-center gap-2">
            {icon}
            <span className="text-[11px] text-muted-foreground uppercase tracking-wider">{label}</span>
        </div>
        <span className="text-base font-bold tracking-tight">{value}</span>
        {hint && <span className="text-[11px] font-mono text-muted-foreground">{hint}</span>}
    </div>
);

// Sub-componente: Tabla comparativa de modelos (proyección + backtest)
interface ModelComparisonTableProps {
    projections: AiFinopsMetrics['spending_forecast']['deterministic']['projections'];
    mape: AiFinopsMetrics['spending_forecast']['deterministic']['backtest_mape_pct'];
    recommended: string;
    modelsConsidered: string[];
}

const ModelComparisonTable = ({ projections, mape, recommended, modelsConsidered }: ModelComparisonTableProps) => {
    const rows = modelsConsidered.map((key) => ({
        key,
        label: MODEL_LABELS[key] ?? key,
        thirty: (projections as Record<string, number>)[`forecast_30d_${key}`],
        ninety: (projections as Record<string, number>)[`forecast_90d_${key}`],
        mape: (mape as Record<string, number>)[key],
    }));

    return (
        <div className="rounded-lg border overflow-hidden">
            <div className="p-3 border-b bg-muted/10">
                <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
                    <Activity className="h-4 w-4 text-muted-foreground" /> Comparación de Modelos
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                    Proyección acumulada y error de validación (MAPE) por modelo. Menor MAPE es mejor.
                </p>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left text-xs text-muted-foreground uppercase tracking-wider border-b bg-muted/5">
                            <th className="px-4 py-2 font-medium">Modelo</th>
                            <th className="px-4 py-2 font-medium text-right">30 días</th>
                            <th className="px-4 py-2 font-medium text-right">90 días</th>
                            <th className="px-4 py-2 font-medium text-right">Error (MAPE)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((r) => {
                            const isRec = r.key === recommended;
                            return (
                                <tr
                                    key={r.key}
                                    className={`border-b last:border-0 ${isRec ? 'bg-blue-50 dark:bg-blue-950/20' : ''}`}
                                >
                                    <td className="px-4 py-2">
                                        <span className="flex items-center gap-2 font-medium text-foreground">
                                            {r.label}
                                            {isRec && (
                                                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-0 gap-1">
                                                    <Award className="h-3 w-3" /> Elegido
                                                </Badge>
                                            )}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 text-right font-mono">
                                        {typeof r.thirty === 'number' ? `$${r.thirty.toFixed(0)}` : '—'}
                                    </td>
                                    <td className="px-4 py-2 text-right font-mono">
                                        {typeof r.ninety === 'number' ? `$${r.ninety.toFixed(0)}` : '—'}
                                    </td>
                                    <td className="px-4 py-2 text-right font-mono">
                                        {typeof r.mape === 'number' ? `${r.mape.toFixed(2)}%` : '—'}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Sub-componente Forecast Card
interface ForecastCardProps {
    periods: ForecastPeriod;
    interval?: { low: number; point: number; high: number };
    title: string;
    icon: React.ElementType;
    iconColor: string;
}

const ForecastCard = ({ periods, interval, title, icon: Icon, iconColor }: ForecastCardProps) => {
    const getConfidenceBadge = (confidence: string) => (
        <Badge className={`${getConfidenceClasses(confidence)} border-0 ml-auto`}>{confidence}</Badge>
    );

    return (
        <div className="flex flex-col h-full border rounded-xl overflow-hidden shadow-sm bg-card">
            <div className="p-4 border-b bg-muted/10 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${iconColor}`} />
                    <span className="font-semibold text-sm uppercase tracking-wider">{title}</span>
                    {getConfidenceBadge(periods.confidence_level)}
                </div>
                <div>
                    <span className="text-xs text-muted-foreground uppercase">Gasto Estimado ({periods.period})</span>
                    <div className="text-3xl font-bold mt-1 tracking-tight">
                        ${periods.predicted_spend_usd.toFixed(0)}
                    </div>
                    {interval && (
                        <div className="mt-2 text-xs text-muted-foreground">
                            <span className="uppercase tracking-wider">Intervalo de Confianza</span>
                            <div className="font-mono mt-0.5 text-foreground/80">
                                ${interval.low.toFixed(0)} — ${interval.high.toFixed(0)}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="p-4 bg-white dark:bg-transparent flex-grow">
                <h5 className="text-xs font-bold text-muted-foreground uppercase mb-3 flex items-center gap-2">
                    <Target className="h-3 w-3" /> Key Drivers Detectados
                </h5>
                <div className="space-y-4">
                    {periods.key_drivers.map((driver: ForecastPeriodKeyDrivers, idx) => (
                        <div key={idx} className="group relative pl-4 border-l-2 border-muted hover:border-blue-400 transition-colors">
                            <div className="flex justify-between items-start">
                                <span className="text-sm font-semibold text-foreground">{driver.service_name}</span>
                                {driver.value_detected > 0 && (
                                    <span className="text-xs font-mono text-muted-foreground">
                                        ${driver.value_detected.toFixed(0)}
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                {driver.key_reason}
                            </p>
                            {driver.anomaly_detected !== "Sin anomalía" && (
                                <div className="mt-1 inline-flex items-center text-[10px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100 dark:bg-amber-950/30 dark:border-amber-900 dark:text-amber-400">
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                    {driver.anomaly_detected}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};