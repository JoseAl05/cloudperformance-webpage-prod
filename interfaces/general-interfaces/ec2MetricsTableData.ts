export interface Ec2MetricTableData {
  metric_name: string;
  avg: number;
  global_avg: number;
  region: string;
  bar_width: number;
  visualization_type: 'ranking' | 'contribution';
  group_context_value: number;
}

export interface Ec2MetricTableDataVolumes {
  volume_id: string;
  history: Ec2MetricTableDataVolumesHistory[];
}

export interface Ec2MetricTableDataVolumesHistory {
  sync_time: string;
  size: number;
  volume_type: string;
  state: string;
  iops: number;
  encrypted: boolean;
}

export interface Ec2MetricTableDataNetworkInterface {
  network_interface_id: string;
  history: Ec2MetricTableDataNetworkInterfaceHistory[];
}

export interface Ec2MetricTableDataNetworkInterfaceHistory {
  sync_time: string;
  Status: string;
  PrivateIp: string;
  PublicIp?: string;
  MacAddress: string;
}

export interface Ec2MetricTableDataHistory {
  sync_time: string;
  state: { Name: string; Code: number };
  instance_type: string;
  private_ip: string;
  public_ip?: string;
  vpc_id: string;
  metrics: {
    cpu_avg: number;
    net_in_avg: number;
    net_out_avg: number;
  };
}

export interface Ec2TableRow {
  instance_id: string;
  volumes: Ec2MetricTableDataVolumes[];
  network_interfaces: Ec2MetricTableDataNetworkInterface[];
  metrics: Ec2MetricTableData[];
  history: Ec2MetricTableDataHistory[];
}
