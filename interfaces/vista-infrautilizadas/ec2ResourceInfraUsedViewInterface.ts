// export interface Ec2Instance {
//   InstanceId: string;
//   sync_time: string; // ISO datetime
//   State: {
//     Code: number;
//     Name: string;
//   };
//   CoreCount: number;
//   ThreadsPerCore: number;
//   ResourceRegion: string;
//   InstanceType: string;
//   vCPUs: number;
//   PublicIpCount: number;
//   volumeCount: number;
//   totalSize: number;
//   volumes: Ec2Volume[];
//   metrics: Ec2Metric[];
// }

// export interface Ec2Volume {
//   VolumeId: string;
//   Size: number;
//   VolumeType: string;
//   Encrypted: boolean;
//   State: string;
//   region: string;
//   sync_time: string; // ISO datetime
// }

// export interface Ec2Metric {
//   MetricLabel: string;
//   ResourceRegion?: string; // opcional, porque no siempre aparece
//   Value: number;
//   used?: number | null;
//   unused?: number | null;
//   Count?: number;
// }

export interface Ec2InstancesResponse {
  ec2Intances: Ec2Instance[];
}


// ########################################################
export interface Root {
  region: string[];
  dateTime_filter: DateTimeFilter;
  ec2IntancesMetricsStatistics: Ec2IntancesMetricsStatistics;
  resourceList: string[];
  resourceCount: number;
  vCpus: number;
  sumCreditBalance: number;
  ec2Intances: Ec2Instance[];
  creditMetrics: CreditMetric[];
}

export interface DateTimeFilter {
  from: string; // ISO date string
  to: string;   // ISO date string
}

export interface Ec2IntancesMetricsStatistics {
  CPUUtilizationAverage: number;
  CPUCreditBalanceAverage: number;
  CPUCreditUsageAverage: number;
  CPUCreditUsagePercentage: number;
}

export interface Ec2Instance {
  InstanceId: string;
  sync_time: string;
  State: State;
  CoreCount: number;
  ThreadsPerCore: number;
  ResourceRegion: string;
  InstanceType: string;
  vCPUs: number;
  PublicIpCount: number;
  volumeCount: number;
  totalSize: number;
  volumes: Ec2Volume[];
  metrics: Ec2Metric[];
}

// export interface Ec2Instance {
//   InstanceId: string;
//   sync_time: string; // ISO datetime
//   State: {
//     Code: number;
//     Name: string;
//   };
//   CoreCount: number;
//   ThreadsPerCore: number;
//   ResourceRegion: string;
//   InstanceType: string;
//   vCPUs: number;
//   PublicIpCount: number;
//   volumeCount: number;
//   totalSize: number;
//   volumes: Ec2Volume[];
//   metrics: Ec2Metric[];
// }


export interface State {
  Code: number;
  Name: string;
}

// export interface Volume {
//   VolumeId: string;
//   Size: number;
//   VolumeType: string;
//   Encrypted: boolean;
//   State: string;
//   region: string;
//   sync_time: string;
// }

export interface Ec2Volume {
  VolumeId: string;
  Size: number;
  VolumeType: string;
  Encrypted: boolean;
  State: string;
  region: string;
  sync_time: string; // ISO datetime
}

// export interface Metric {
//   MetricLabel: string;
//   ResourceRegion?: string;
//   Value: number;
//   used: number | null;
//   unused: number | null;
//   Count?: number;
// }

export interface Ec2Metric {
  MetricLabel: string;
  ResourceRegion?: string; // opcional, porque no siempre aparece
  Value: number;
  used?: number | null;
  unused?: number | null;
  Count?: number;
}

export interface CreditMetric {
  MetricId: string;
  Timestamp: string;
  AvgValue: number;
}
