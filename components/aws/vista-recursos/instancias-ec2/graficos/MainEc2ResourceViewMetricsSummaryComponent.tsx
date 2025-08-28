'use client';

import { Card, CardContent } from '@/components/ui/card';
import { bytesToMB } from '@/lib/bytesToMbs';
import { Activity, ChevronDown, ChevronUp, Cpu, Minus, Network, Percent, TrendingUp, Zap } from 'lucide-react';

interface MetricItem {
  MetricLabel: string;
  Value: number;
  sync_time: string;
}

interface CalculatedSummary {
  Last_CPU_Credit_Balance_EC2: number;
  Last_CPU_Credit_Usage_EC2: number;
  Porcentaje_Uso_Créditos_CPU_EC2: number;
  Eficiencia_Creditos_CPU_EC2_Instancia: string;
}

interface MetricsData {
  metrics_data: MetricItem[];
  calculated_summary?: CalculatedSummary;
}

interface MainEc2ResourceViewMetricsSummaryComponentProps {
  data: MetricsData | null;
}

const CPU_THRESHOLD_LOW = 20;
const CPU_THRESHOLD_HIGH = 80;
const NETWORK_THRESHOLD_LOW = 5;

const getUsageStatus = (type: 'cpu' | 'network', value: number) => {
  if (type === 'cpu') {
    if (value < CPU_THRESHOLD_LOW) {
      return { message: 'Bajo uso de CPU', icon: ChevronDown, style: 'text-xs text-red-600 font-bold pt-2' };
    } else if (value > CPU_THRESHOLD_HIGH) {
      return { message: 'Alto uso de CPU', icon: ChevronUp, style: 'text-xs text-green-600 font-bold pt-2' };
    }
    return { message: 'Uso de CPU normal', icon: Minus, style: 'text-xs text-gray-500 font-bold pt-2' };
  }
  if (type === 'network') {
    if (value < NETWORK_THRESHOLD_LOW) {
      return { message: 'Bajo tráfico de red', icon: ChevronDown, style: 'text-xs text-red-600 font-bold pt-2' };
    }
    return { message: 'Tráfico normal', icon: Minus, style: 'text-xs text-gray-500 font-bold pt-2' };
  }
  return null;
};

export const MainEc2ResourceViewMetricsSummaryComponent = ({ data }: MainEc2ResourceViewMetricsSummaryComponentProps) => {
  if (!data || data.metrics_data.length === 0) {
    return <div className="text-center text-gray-500 py-6">No hay métricas disponibles para mostrar.</div>;
  }

  const today = new Date();
  const sortedMetrics = [...data.metrics_data].sort((a, b) => new Date(b.sync_time).getTime() - new Date(a.sync_time).getTime());
  const latestMetric = sortedMetrics[0];
  const referenceDate = new Date(latestMetric.sync_time);
  const isToday =
    referenceDate.getDate() === today.getDate() &&
    referenceDate.getMonth() === today.getMonth() &&
    referenceDate.getFullYear() === today.getFullYear();
  const dateLabel = referenceDate.toLocaleDateString();

  const getAverage = (label: string) => {
    const metrics = data.metrics_data.filter(m => m.MetricLabel === label);
    return metrics.length > 0 ? metrics.reduce((sum, m) => sum + m.Value, 0) / metrics.length : 0;
  };

  const averageCpuUsage = getAverage('Uso de CPU (Promedio)');
  const averageInNetworkUsage = bytesToMB(getAverage('Entrada de Red (Promedio)'));
  const averageOutNetworkUsage = bytesToMB(getAverage('Salida de Red (Promedio)'));

  const cpuStatus = getUsageStatus('cpu', averageCpuUsage);
  const inNetworkStatus = getUsageStatus('network', averageInNetworkUsage);
  const outNetworkStatus = getUsageStatus('network', averageOutNetworkUsage);

  const summary = data.calculated_summary || {
    Last_CPU_Credit_Balance_EC2: 0,
    Last_CPU_Credit_Usage_EC2: 0,
    Porcentaje_Uso_Créditos_CPU_EC2: 0,
    Eficiencia_Creditos_CPU_EC2_Instancia: '',
  };

  const metricsData = [
    {
      title: 'Créditos Disponibles',
      value: summary.Last_CPU_Credit_Balance_EC2,
      icon: Zap,
      borderColor: 'border-l-blue-500',
      subtitle: isToday ? 'Actual' : dateLabel,
      valueStyle: 'text-xl font-bold text-foreground tracking-tight',
      format: (val: number) => val.toString(),
    },
    {
      title: 'Créditos Utilizados',
      value: summary.Last_CPU_Credit_Usage_EC2,
      icon: Activity,
      borderColor: 'border-l-emerald-500',
      subtitle: isToday ? 'Actual' : dateLabel,
      valueStyle: 'text-xl font-bold text-foreground tracking-tight',
      format: (val: number | null | undefined) => ((val ?? 0).toFixed(2))
    },
    {
      title: 'Porcentaje Créditos Utilizados',
      value: summary.Porcentaje_Uso_Créditos_CPU_EC2,
      icon: Percent,
      borderColor: 'border-l-amber-500',
      subtitle: isToday ? 'Actual' : dateLabel,
      valueStyle: 'text-xl font-bold text-foreground tracking-tight',
      format: (val: number | null | undefined) => `${(val ?? 0).toFixed(1)}%`,
    },
    {
      title: 'Eficiencia Instancia',
      value: summary.Eficiencia_Creditos_CPU_EC2_Instancia,
      icon: TrendingUp,
      borderColor: 'border-l-violet-500',
      subtitle: isToday ? 'Actual' : dateLabel,
      valueStyle: 'text-sm font-bold text-foreground tracking-tight',
      format: (val: string | number) => val.toString(),
    },
    {
      title: 'Promedio Uso de CPU',
      value: `${averageCpuUsage.toFixed(2)} %`,
      icon: Cpu,
      borderColor: 'border-l-blue-500',
      subtitle: isToday ? 'Actual' : dateLabel,
      valueStyle: 'text-xl font-bold text-foreground tracking-tight',
      usage: cpuStatus?.message,
      usageIcon: cpuStatus?.icon,
      usageStyle: cpuStatus?.style,
    },
    {
      title: 'Promedio Entrada de Red',
      value: `${averageInNetworkUsage} MB/s`,
      icon: Network,
      borderColor: 'border-l-blue-500',
      subtitle: isToday ? 'Actual' : dateLabel,
      valueStyle: 'text-xl font-bold text-foreground tracking-tight',
      usage: inNetworkStatus?.message,
      usageIcon: inNetworkStatus?.icon,
      usageStyle: inNetworkStatus?.style,
    },
    {
      title: 'Promedio Salida de Red',
      value: `${averageOutNetworkUsage} MB/s`,
      icon: Network,
      borderColor: 'border-l-blue-500',
      subtitle: isToday ? 'Actual' : dateLabel,
      valueStyle: 'text-xl font-bold text-foreground tracking-tight',
      usage: outNetworkStatus?.message,
      usageIcon: outNetworkStatus?.icon,
      usageStyle: outNetworkStatus?.style,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
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
