export interface ConsumeViewEc2Metrics {
  timestamp: string;
  metric: string;
  avg_value: number;
  max_value: number;
  min_value: number;
}

export interface ConsumeViewEc2EbsDevice {
  DeviceName: string;
  Ebs: {
    AttachTime: string;
    DeleteOnTermination: boolean;
    Status: string;
    VolumeId: string;
  };
}

export interface ConsumeViewEc2NetworkInterface {
  Association: { PublicIp: string; PublicDnsName: string };
  Status: string;
  NetworkInterfaceId: string;
  PrivateIpAddress: string;
}

export interface ConsumeViewEc2InfoInstacesEbs {
  DeviceName: string;
  Ebs: {
    AttachTime: string;
    DeleteOnTermination: boolean;
    Status: string;
    VolumeId: string;
  };
}

export interface ConsumeViewEc2InfoInstancesNetworkInterfaces {
  Association: {
    IpOwnerId: string;
    PublicDnsName: string;
    PublicIp: string;
  };
  Attachment: {
    AttachTime: string;
    AttachmentId: string;
    DeleteOnTermination: boolean;
    DeviceIndex: number;
    Status: string;
    NetworkCardIndex: number;
  };
  Description: string;
  Groups: [
    {
      GroupId: string;
      GroupName: string;
    },
  ];
  Ipv6Addresses: string[];
  MacAddress: string;
  NetworkInterfaceId: string;
  OwnerId: string;
  PrivateDnsName: string;
  PrivateIpAddress: string;
  PrivateIpAddresses: [
    {
      Association: {
        IpOwnerId: string;
        PublicDnsName: string;
        PublicIp: string;
      };
      Primary: booelan;
      PrivateDnsName: string;
      PrivateIpAddress: string;
    },
  ];
  SourceDestCheck: boolean;
  Status: string;
  SubnetId: string;
  VpcId: string;
  InterfaceType: string;
  Operator: {
    Managed: boolean;
  };
}

export interface ConsumeViewEc2InfoInstacesTags {
  [key: string]: string;
}

export interface ConsumeViewEc2InfoInstances {
  name: string;
  InstanceId: string;
  InstanceType: string;
  region: string;
  availability_zone: string;
  status: string;
  InstancePurchaseMethod: string;
  avg_cpu_utilization: number;
  max_cpu_utilization: number;
  min_cpu_utilization: number;
  avg_network_in: number;
  max_network_in: number;
  avg_network_out: number;
  max_network_out: number;
  avg_cpu_credit_usage: number;
  avg_cpu_credit_balance: number;
  is_idle: boolean;
  is_underutilized: boolean;
  costo_usd: number;
  public_ip: string;
  private_ip: string;
  vpc_id: string;
  ebs_devices?: ConsumeViewEc2InfoInstacesEbs[];
  devices_attached: number;
  devices_not_attached: number;
  network_interfaces?: ConsumeViewEc2InfoInstancesNetworkInterfaces[];
  interfaces_inuse_count: number;
  interfaces_not_inuse_count: number;
  LaunchTime: string;
  sync_time: string;
  Tags?: ConsumeViewEc2InfoInstacesTags[];
}

export interface ConsumeViewEc2Info {
  resumen: {
    total_instancias: number;
    instancias_idle: number;
    instancias_infrautilizadas: number;
    costo_total_usd: number;
    sync_time: string;
  };
  instancias: ConsumeViewEc2InfoInstances[];
}

export interface ConsumeViewEc2GlobalEfficiencyMetricsDetails{
    samples: number;
    metric: string;
    avg_utilization: number;
    max_utilization: number;
    min_utilization: number;
    efficiency_score: number;
}

export interface ConsumeViewEc2GlobalEfficiency {
    global_efficiency_score: number;
    metrics_detail: ConsumeViewEc2GlobalEfficiencyMetricsDetails[];
    interpretation: string;
}
