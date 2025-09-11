'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Activity, Zap, Percent, TrendingUp } from 'lucide-react';

interface CalculatedSummaryRdsMariaDB {
  Last_CPU_Credit_Balance_RDS_MariaDB: number;
  Last_CPU_Credit_Usage_RDS_MariaDB: number;
  Porcentaje_Uso_Créditos_CPU_RDS_MariaDB: number;
  Eficiencia_Creditos_CPU_RDS_MariaDB_Instancia: string;
}

interface RdsMariaDBMetricsData {
  metrics_data: unknown[];
  calculated_summary?: CalculatedSummaryRdsMariaDB;
}

interface MainRdsMariaDBResourceViewMetricsSummaryProps {
  data: RdsMariaDBMetricsData | null;
}

export const MainRdsMariaDBResourceViewMetricsSummaryComponent = ({
  data,
}: MainRdsMariaDBResourceViewMetricsSummaryProps) => {
  if (!data || !data.calculated_summary) {
    return (
      <div className='text-center text-gray-500 py-6'>
        No hay métricas disponibles para mostrar.
      </div>
    );
  }

  const summary = data.calculated_summary;

  const today = new Date().toLocaleDateString();

  const cards = [
    {
      title: 'Créditos Disponibles',
      value: summary.Last_CPU_Credit_Balance_RDS_MariaDB,
      icon: Zap,
      borderColor: 'border-l-amber-500',
      format: (val: number) => val.toFixed(2),
    },
    {
      title: 'Créditos Utilizados (Actual)',
      value: summary.Last_CPU_Credit_Usage_RDS_MariaDB,
      icon: Activity,
      borderColor: 'border-l-emerald-500',
      format: (val: number) => val.toFixed(4),
    },
    {
      title: 'Porcentaje de Uso Créditos',
      value: summary.Porcentaje_Uso_Créditos_CPU_RDS_MariaDB,
      icon: Percent,
      borderColor: 'border-l-yellow-500',
      format: (val: number) => val ? `${(val * 100).toFixed(2)} %` : 'N/A',
    },
    {
      title: 'Eficiencia Instancia',
      value: summary.Eficiencia_Creditos_CPU_RDS_MariaDB_Instancia,
      icon: TrendingUp,
      borderColor: 'border-l-orange-500',
      format: (val: string) => val.toString(),
    },
  ];

  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-4 gap-4'>
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Card
              key={idx}
              className={`${card.borderColor} border-l-4 transition-all duration-200 hover:shadow-md hover:scale-[1.02] group`}
            >
              <CardContent className='p-4 flex flex-col h-full'>
                <div className='flex items-center justify-between'>
                  <div className='p-2 rounded-lg bg-amber-50 dark:bg-amber-950/20 group-hover:scale-110'>
                    <Icon className='h-4 w-4 text-amber-600 dark:text-amber-400' />
                  </div>
                  <p className='text-xs text-muted-foreground font-medium'>
                    {today}
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