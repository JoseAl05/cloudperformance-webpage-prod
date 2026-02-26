import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator'; // Componente de shadcn
import { Activity, Calendar, Cloud, DollarSign, RefreshCw, TrendingUp } from 'lucide-react';
import { AiFinopsMetrics } from '@/interfaces/ai-finops-metrics/aiFinopsMetricsInterfaces';

interface GeneralStatusProps {
    data: AiFinopsMetrics;
}

const MarkdownText = ({ content }: { content: string }) => {
    return (
        <ReactMarkdown
            components={{
                ul: ({ node, ...props }) => <ul className="list-disc pl-5 space-y-1" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal pl-5 space-y-1" {...props} />,
                li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                strong: ({ node, ...props }) => <span className="font-bold text-foreground" {...props} />,
                p: ({ node, ...props }) => <p className="text-muted-foreground leading-relaxed mb-2 last:mb-0" {...props} />,
                a: ({ node, ...props }) => <a className="text-blue-500 hover:underline" {...props} />,
            }}
        >
            {content}
        </ReactMarkdown>
    );
};

export const GeneralStatus = ({ data }: GeneralStatusProps) => {
    const {
        global_score,
        global_score_explanation,
        total_potential_monthly_savings_usd,
        total_potential_monthly_savings_explanation,
        metadata
    } = data;

    // Formateadores
    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleString('es-ES', {
            day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });

    // Color dinámico para el Score
    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-emerald-500 dark:text-emerald-400 border-emerald-500';
        if (score >= 50) return 'text-amber-500 dark:text-amber-400 border-amber-500';
        return 'text-rose-500 dark:text-rose-400 border-rose-500';
    };

    return (
        <div className="flex flex-col gap-4">

            {/* KPIs Principales: Grid de 2 columnas en pantallas medianas+ */}
            <div className="grid gap-4 md:grid-cols-2">

                {/* KPI 1: Global Score */}
                <Card className="relative overflow-hidden border-t-4 border-t-primary/20 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">FinOps Global Score</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-baseline gap-2">
                            <span className={`text-5xl font-extrabold tracking-tighter ${getScoreColor(global_score).split(' ')[0]}`}>
                                {global_score}
                            </span>
                            <span className="text-sm text-muted-foreground font-medium">/ 100</span>
                        </div>
                        <MarkdownText content={global_score_explanation} />
                    </CardContent>
                    {/* Elemento decorativo de fondo */}
                    <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-5 ${getScoreColor(global_score).split(' ')[0].replace('text-', 'bg-')}`} />
                </Card>

                {/* KPI 2: Ahorros Potenciales */}
                <Card className="relative overflow-hidden border-t-4 border-t-green-500/20 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ahorro Mensual Total Estimado</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <span className="text-5xl font-extrabold tracking-tighter text-green-600 dark:text-green-400">
                                {formatCurrency(total_potential_monthly_savings_usd)}
                            </span>
                        </div>
                        <div className="mt-3 flex items-start gap-2">
                            <TrendingUp className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                            <MarkdownText content={total_potential_monthly_savings_explanation} />
                        </div>
                    </CardContent>
                    {/* Elemento decorativo de fondo */}
                    <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-green-500 opacity-5" />
                </Card>
            </div>

            {/* Barra de Metadata: Información técnica del reporte */}
            <Card className="bg-muted/30 border-dashed">
                <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4">

                    {/* Proveedor */}
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-background rounded-full border shadow-sm">
                            <Cloud className="h-4 w-4 text-blue-500" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-medium text-muted-foreground uppercase">Proveedor Nube</span>
                            <span className="font-bold capitalize text-sm">{metadata.cloud_provider}</span>
                        </div>
                    </div>

                    <Separator orientation="vertical" className="hidden sm:block h-8" />

                    {/* Fecha de Generación */}
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-background rounded-full border shadow-sm">
                            <Calendar className="h-4 w-4 text-purple-500" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-medium text-muted-foreground uppercase">Generado el</span>
                            <span className="font-mono text-sm">{formatDate(metadata.report_generation_date)}</span>
                        </div>
                    </div>

                    <Separator orientation="vertical" className="hidden sm:block h-8" />

                    {/* Última Sincronización */}
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-background rounded-full border shadow-sm">
                            <RefreshCw className="h-4 w-4 text-orange-500" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-medium text-muted-foreground uppercase">Data Sincronizada</span>
                            <span className="font-mono text-sm">{formatDate(metadata.data_last_sync_time)}</span>
                        </div>
                    </div>

                </CardContent>
            </Card>
        </div>
    );
};