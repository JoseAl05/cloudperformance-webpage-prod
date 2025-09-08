'use client';

import { Card, CardContent } from '@/components/ui/card';
import { bytesToMB } from '@/lib/bytesToMbs';
import { Activity, ChevronDown, ChevronUp, Cpu, Minus, Network, Percent, TrendingUp, Zap, Ticket, MonitorCheck } from 'lucide-react';
import { Ec2IntancesMetricsStatistics, Root } from '@/interfaces/vista-infrautilizadas/ec2ResourceInfraUsedViewInterface';

// interface MetricItem {
//   MetricLabel: string;
//   Value: number;
//   sync_time: string;
// }

// interface CalculatedSummary {
//   Last_CPU_Credit_Balance_EC2: number;
//   Last_CPU_Credit_Usage_EC2: number;
//   Porcentaje_Uso_Créditos_CPU_EC2: number;
//   Eficiencia_Creditos_CPU_EC2_Instancia: string;
// }

// interface MetricsData {
//   // metrics_data: MetricItem[];
//   CPUCreditBalanceAverage: number;
//   CPUCreditUsageAverage: number;
//   CPUUtilizationAverage: number;
//   CPUCreditUsagePercentage: number;
//   // calculated_summary?: CalculatedSummary;
// }

// interface MainEc2ResourceInfraUsedViewMetricsSummaryComponentProps {
//   data: MetricsData | null;
// }


interface MainEc2ResourceInfraUsedViewMetricsSummaryComponentProps {
  data: Root | null;
}


export const MainEc2ResourceInfraUsedViewMetricsSummaryComponent = ({ data }: MainEc2ResourceInfraUsedViewMetricsSummaryComponentProps) => {

  const metricsData = [
    {
      title: 'Total VM',
      // value: data?.CPUCreditBalanceAverage,
      value: data?.resourceCount,
      icon: MonitorCheck,
      borderColor: 'border-l-blue-500',
      // subtitle: isToday ? 'Actual' : dateLabel,
      valueStyle: 'text-xl font-bold text-foreground tracking-tight',
      format: (val: number) => val.toString(),
    },
    {
      title: 'Total vCPUs',
      // value: data?.CPUCreditBalanceAverage,
      value: data?.vCpus,
      icon: Cpu,
      borderColor: 'border-l-blue-500',
      // subtitle: isToday ? 'Actual' : dateLabel,
      valueStyle: 'text-xl font-bold text-foreground tracking-tight',
      format: (val: number) => val.toString(),
    },
    {
      title: 'Creditos de CPU Disponibles',
      // value: data?.CPUCreditBalanceAverage,
      value: data?.sumCreditBalance,
      icon: Ticket,
      borderColor: 'border-l-blue-500',
      // subtitle: isToday ? 'Actual' : dateLabel,
      valueStyle: 'text-xl font-bold text-foreground tracking-tight',
      format: (val: number) => val.toString(),
    },



    {
      title: 'Promedio Creditos Disponibles',
      // value: data?.CPUCreditBalanceAverage,
      value: data?.ec2IntancesMetricsStatistics.CPUCreditBalanceAverage,
      icon: Zap,
      borderColor: 'border-l-blue-500',
      // subtitle: isToday ? 'Actual' : dateLabel,
      valueStyle: 'text-xl font-bold text-foreground tracking-tight',
      format: (val: number) => val.toString(),
    },
    {
      title: 'Promedio Creditos Utilizados',
      // value: data?.CPUCreditUsageAverage,
      value: data?.ec2IntancesMetricsStatistics.CPUCreditUsageAverage,
      icon: Activity,
      borderColor: 'border-l-emerald-500',
      // subtitle: isToday ? 'Actual' : dateLabel,
      valueStyle: 'text-xl font-bold text-foreground tracking-tight',
      format: (val: number | null | undefined) => ((val ?? 0).toFixed(2))
    },
    {
      title: 'Promedio Creditos Utilizados %',
      // value: data?.CPUCreditUsagePercentage,
      value: data?.ec2IntancesMetricsStatistics.CPUCreditUsagePercentage,
      icon: Activity,
      borderColor: 'border-l-amber-500',
      // subtitle: isToday ? 'Actual' : dateLabel,
      valueStyle: 'text-xl font-bold text-foreground tracking-tight',
      format: (val: number | null | undefined) => ((val ?? 0).toFixed(2))
    },
    {
      title: 'Promedio CPU Utilizados %',
      // value: data?.CPUUtilizationAverage,
      value: data?.ec2IntancesMetricsStatistics.CPUUtilizationAverage,
      icon: Cpu,
      borderColor: 'border-l-blue-500',
      // subtitle: isToday ? 'Actual' : dateLabel,
      valueStyle: 'text-xl font-bold text-foreground tracking-tight',
      format: (val: number | null | undefined) => ((val ?? 0).toFixed(2))
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        {metricsData.map((metric, index) => {
          const IconComponent = metric.icon;
          const UsageIconComponent = metric.usageIcon || null;
          return (
            <Card key={index} className={`${metric.borderColor} border-l-4 transition-all duration-200 hover:shadow-md hover:scale-[1.02] group`}>
              <CardContent className="p-4 flex flex-col h-full">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/20 transition-colors duration-200 group-hover:scale-110">
                    <IconComponent className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">{metric.subtitle}</p>
                </div>
                <h3 className="text-sm font-medium text-muted-foreground mt-2">{metric.title}</h3>
                <div className="mt-auto">
                  <p className={metric.valueStyle}>{typeof metric.format === 'function' ? metric.format(metric.value) : metric.value}</p>
                  {metric.usage && (
                    <span className={metric.usageStyle}>
                      {UsageIconComponent && <UsageIconComponent className="h-4 w-4 inline-block mr-1" />}
                      {metric.usage}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
