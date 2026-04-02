export interface ConsumeViewRdsMetrics {
  timestamp: string;
  region: string;
  avg_value: number;
  max_value: number;
  min_value: number;
}

export interface RdsConsumeViewInfoInstanceHistory {
  InstanceCreateTime: {
    $date: string;
  };
  TagList: [
    {
      Key: string;
      Value: string;
    },
  ];
  sync_time: {
    $date: string;
  };
  avg_cpu_utilization: number;
  max_cpu_utilization: number;
  avg_connections: number;
  max_connections: number;
  avg_storage_free: number;
  strg_pct_free: number;
  strg_pct_used: number;
  max_storage_free: number;
  avg_memory_free: number;
  max_memory_free: number;
  is_idle: boolean;
  is_underutilized: boolean;
  storage_inefficient: boolean;
  costo_total_usd: number;
  instance_class: string;
  region_name: string;
  availability_zone: string;
  state: string;
  name: string;
  engine: string;
  engine_version: string;
  allocated_storage: number;
  storage_type: string;
  multi_az: boolean;
  resource_arn: string;
  resource_id: string;
}

export interface RdsConsumeViewInfoInstances {
  name: string;
  resource_arn: string;
  resource_id: string;
  history: RdsConsumeViewInfoInstanceHistory[];
}

export interface RdsConsumeViewInfo {
  resumen: {
    total_instancias: number;
    instancias_idle: number;
    instancias_infrautilizadas: number;
    instancias_almacenamiento_ineficiente: number;
  };
  instancias: RdsConsumeViewInfoInstances[];
}

export interface RdsConsumeViewEfficiencyDataMetricsDetail {
  metric: string;
  avg_utilization: number;
  max_utilization: number;
  min_utilization: number;
  samples:number;
}

export interface RdsConsumeViewEfficiencyData {
  global_efficiency: number;
  metrics_detail: RdsConsumeViewEfficiencyDataMetricsDetail[];
}
