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

export type RdsConsumeViewInstanceResponse = RdsConsumeViewInstance[];

export interface RdsConsumeViewInstance {
  sync_time: string;
  resources: RdsResource[];
}

export interface RdsResource {
  db_sync_time: string;
  resource: string;
  resource_id: string;
  engine: string;
  engine_version: string;
  db_subnet_group: string;
  db_subnet_group_status: string;
  db_subnet_group_subnets: DbSubnet[];
  region: string;
  last_cpu_credits_balance: number;
  last_cpu_credits_usage: number;
  credit_efficiency: string;
}

export interface DbSubnet {
  SubnetIdentifier: string;
  SubnetAvailabilityZone: {
    Name: string;
  };
  SubnetOutpost: unknown; // objeto vacío en la muestra
  SubnetStatus: string;
}
