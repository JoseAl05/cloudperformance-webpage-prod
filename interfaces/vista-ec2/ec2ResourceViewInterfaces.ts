export type AwsInstanceStateName =
  | 'pending'
  | 'running'
  | 'shutting-down'
  | 'terminated'
  | 'stopping'
  | 'stopped'
  | string;

export type InstancePurchaseMethod = 'on-demand' | 'spot' | 'reserved' | string;

export type EbsAttachmentStatus =
  | 'attaching'
  | 'attached'
  | 'detaching'
  | 'detached'
  | string;

export interface Ec2InstanceSummary {
  _id: string;
  PlatformDetails: string;
  InstanceId: string;
  InstanceType: string;
  LaunchTime: string;
  region: string;
  sync_time: string;
  InstancePurchaseMethod: InstancePurchaseMethod;
  State_Name: AwsInstanceStateName;
  CPU_Cores_Selected_Instance: number;
  CPU_Threads_Per_Core_Selected_Instance: number;
  Total_EBS_Volumes: number;
  Total_Attachments: number;
  BlockDeviceMappings_DeviceName: string[];
  BlockDeviceMappings_Ebs_AttachTime: string[];
  BlockDeviceMappings_Ebs_Status: EbsAttachmentStatus[];
  BlockDeviceMappings_Ebs_VolumeId: string[];
  NetworkInterfaces_Association_PublicDnsName: string[];
  NetworkInterfaces_Association_PublicIp: string[];
  NetworkInterfaces_Attachment_AttachmentId: string[];
  BlockDeviceMappings_Ebs_Size: number[];
}

export type InstancesApiResponse = Ec2InstanceSummary[];
