export type UnusedEbsApiResponse = UnusedEbs[];
export interface UnusedEbs {
  sync_time: string;
  ebs_info: UnusedEbsVolumeInfo[];
}
export interface UnusedEbsVolumeInfo {
  ebs_name: string;
  ebs_type: string;
  ebs_region: string;
  ebs_iops: number;
  ebs_throughput: number;
  ebs_size: number;
  ebs_state: string;
  ebs_attachments: UnusedEbsAttachment[];
  ebs_metrics: UnusedEbsMetric[];
}
export interface UnusedEbsAttachment {
  DeleteOnTermination: boolean;
  VolumeId: string;
  InstanceId: string;
  Device: string;
  State: string;
  AttachTime: string;
}
export interface UnusedEbsMetric {
  metric_label: string;
  value: number;
  timestamp: string;
}
