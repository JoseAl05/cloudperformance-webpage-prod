'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Activity, Zap, Percent, TrendingUp } from 'lucide-react';


interface RdsMetricsData {
    metrics_data: unknown[];
    calculated_summary?: unknown;
}

interface MainRdsResourceViewMetricsSummaryComponentProps {
    data: RdsMetricsData | null;
    rdsType: 'rds-pg' | 'rds-mysql' | 'rds-mariadb' | 'rds-oracle' | 'rds-sqlserver'
}

export const MainRdsResourceViewMetricsSummaryComponentComponent = ({
    data,
    rdsType
}: MainRdsResourceViewMetricsSummaryComponentProps) => {
    if (!data || !data.calculated_summary) {
        return (
            <div className='text-center text-gray-500 py-6'>
                No hay métricas disponibles para mostrar.
            </div>
        );
    }

    const summary = data.calculated_summary;

    const today = new Date();
    const sortedMetrics = [...data.metrics_data].sort((a, b) => new Date(b.sync_time.$date).getTime() - new Date(a.sync_time.$date).getTime());
    const latestMetric = sortedMetrics[0];
    const referenceDate = new Date(latestMetric.sync_time.$date);
    const isToday =
        referenceDate.getDate() === today.getDate() &&
        referenceDate.getMonth() === today.getMonth() &&
        referenceDate.getFullYear() === today.getFullYear();
    const dateLabel = referenceDate.toLocaleDateString();
    let cardCreditBalanceValue = 0;
    let cardCreditUsageValue = 0;
    let cardCreditPercentValue = 0;
    let cardCreditEfficiencyValue = 0;
    switch (rdsType) {
        case 'rds-pg':
            cardCreditBalanceValue = summary.Last_CPU_Credit_Balance_RDS_Postgresql || 0;
            cardCreditUsageValue = summary.Last_CPU_Credit_Usage_RDS_Postgresql || 0;
            cardCreditPercentValue = summary.Porcentaje_Uso_Créditos_CPU_RDS_Postgresql || 0;
            cardCreditEfficiencyValue = summary.Eficiencia_Creditos_CPU_RDS_Postgresql_Instancia || 'Sin métricas de créditos';
            break;
        case 'rds-mysql':
            cardCreditBalanceValue = summary.Last_CPU_Credit_Balance_RDS_Mysql || 0;
            cardCreditUsageValue = summary.Last_CPU_Credit_Usage_RDS_Mysql || 0;
            cardCreditPercentValue = summary.Porcentaje_Uso_Créditos_CPU_RDS_Mysql || 0;
            cardCreditEfficiencyValue = summary.Eficiencia_Creditos_CPU_RDS_Mysql_Instancia || 'Sin métricas de créditos';
            break;
        case 'rds-mariadb':
            cardCreditBalanceValue = summary.Last_CPU_Credit_Balance_RDS_MariaDB || 0;
            cardCreditUsageValue = summary.Last_CPU_Credit_Usage_RDS_MariaDB || 0;
            cardCreditPercentValue = summary.Porcentaje_Uso_Créditos_CPU_RDS_MariaDB || 0;
            cardCreditEfficiencyValue = summary.Eficiencia_Creditos_CPU_RDS_MariaDB_Instancia || 'Sin métricas de créditos';
            break;
        case 'rds-oracle':
            cardCreditBalanceValue = summary.Last_CPU_Credit_Balance_RDS_Oracle || 0;
            cardCreditUsageValue = summary.Last_CPU_Credit_Usage_RDS_Oracle || 0;
            cardCreditPercentValue = summary.Porcentaje_Uso_Créditos_CPU_RDS_Oracle || 0;
            cardCreditEfficiencyValue = summary.Eficiencia_Creditos_CPU_RDS_Oracle_Instancia || 'Sin métricas de créditos';
            break;
        case 'rds-sqlserver':
            cardCreditBalanceValue = summary.Last_CPU_Credit_Balance_RDS_SqlServer || 0;
            cardCreditUsageValue = summary.Last_CPU_Credit_Usage_RDS_SqlServer || 0;
            cardCreditPercentValue = summary.Porcentaje_Uso_Créditos_CPU_RDS_SqlServer || 0;
            cardCreditEfficiencyValue = summary.Eficiencia_Creditos_CPU_RDS_SqlServer_Instancia || 'Sin métricas de créditos';
            break;

        default:
            break;
    }

    const cards = [
        {
            title: 'Créditos Disponibles',
            value: cardCreditBalanceValue,
            icon: Zap,
            borderColor: 'border-l-blue-500',
            format: (val: number) => val.toFixed(2),
        },
        {
            title: 'Créditos Utilizados (Actual)',
            value: cardCreditUsageValue,
            icon: Activity,
            borderColor: 'border-l-emerald-500',
            format: (val: number) => val.toFixed(4),
        },
        {
            title: 'Porcentaje de Uso Créditos',
            value: cardCreditPercentValue,
            icon: Percent,
            borderColor: 'border-l-amber-500',
            format: (val: number) => `${(val * 100).toFixed(2)} %`,
        },
        {
            title: 'Eficiencia Instancia',
            value: cardCreditEfficiencyValue,
            icon: TrendingUp,
            borderColor: 'border-l-violet-500',
            format: (val: string) => val.toString(),
        },
    ];

    return (
        <div className='space-y-4'>
            <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-4'>
                {cards.map((card, idx) => {
                    const Icon = card.icon;
                    return (
                        <Card
                            key={idx}
                            className={`${card.borderColor} border-l-4 transition-all duration-200 hover:shadow-md hover:scale-[1.02] group`}
                        >
                            <CardContent className='p-4 flex flex-col h-full'>
                                <div className='flex items-center justify-between'>
                                    <div className='p-2 rounded-lg bg-blue-50 dark:bg-blue-950/20 group-hover:scale-110'>
                                        <Icon className='h-4 w-4 text-blue-600 dark:text-blue-400' />
                                    </div>
                                    <p className='text-xs text-muted-foreground font-medium'>
                                        {
                                            isToday ? 'Actual' : dateLabel
                                        }
                                    </p>
                                </div>
                                <h3 className='text-sm font-medium text-muted-foreground mt-2'>
                                    {card.title}
                                </h3>
                                <div className='mt-auto'>
                                    <p className='text-xl font-bold text-foreground tracking-tight'>
                                        {typeof card.value === 'number'
                                            ? card.format(card.value)
                                            : card.format(card.value)}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};