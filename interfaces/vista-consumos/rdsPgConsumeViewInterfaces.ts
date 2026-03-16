export interface ConsumeViewRdsPgCpuMetrics {
  timestamp: string;
  sync_time: string;
  region: string;
  total_cpu: number;
  used_cpu: number;
  unused_cpu: number;
  average_cpu_metric_value: number;
}

export interface ConsumeViewRdsPgCreditsMetrics {
  timestamp: string;
  sync_time: string;
  region: string;
  CpuCreditUsageValue: number;
  CpuCreditBalanceValue: number;
}

export interface ConsumeViewRdsPgDbConnectionsMetrics {
  timestamp: string;
  sync_time: string;
  region: string;
  value: number;
}

export interface ConsumeViewRdsPgFreeStorageMetrics {
  timestamp: string;
  sync_time: string;
  region: string;
  value: number;
}

export interface DbSubnet {
  SubnetIdentifier: string;
  SubnetAvailabilityZone: {
    Name: string;
  };
  SubnetOutpost: unknown; // objeto vacío en la muestra
  SubnetStatus: string;
}

export interface RdsConsumeViewInstance {
  resource: string;
  resource_status: string;
  resource_create_time: string;
  engine: string;
  engine_version: string;
  db_subnet_group: string;
  db_subnet_group_status: string;
  db_subnets: DbSubnet[];
  region: string;
  last_cpu_credits_balance: number;
  last_cpu_credits_usage: number;
  credit_efficiency: string;
  metric_sync_time: string;
  db_sync_time: string;
  //campos nuevos mmontt 202603
  avg_cpu: number | null;
  max_cpu: number | null;
  avg_connections: number | null;
  max_connections: number | null;
  clasificacion: 'Idle' | 'Infrautilizada' | 'Óptimo' | 'Sin Datos';  
}
