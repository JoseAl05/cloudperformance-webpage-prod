export interface UnusedVm {
  cpu_total: number;
  memory_total: number;
  series: UnusedVmSeries[];
  vm_name: string;
  vm_id: string;
  location: string;
  subscription: string;
  sync_time: string;
  cpu_under: boolean;
  mem_under: boolean;
  disk_details: UnusedVmDiskDetails[];
  interface_details: UnusedVmInterfaceDetails[];
}

export interface UnusedVmSeries {
  name: string;
  metric_value: number;
  timestamp: string;
}

export interface UnusedVmDiskDetails {
  sync_time: string;
  disks: UnusedVmDisksData[];
}

export interface UnusedVmDisksData {
  id: string;
  name: string;
  vm_name: string;
  disk_size_gb: number;
}

export interface UnusedVmInterfaceDetails {
  sync_time: string;
  interfaces: UnusedVmInterfaceData[];
}

export interface UnusedVmInterfaceData {
  id: string;
  name: string;
  nic_type: string;
  primary: boolean;
  provisioning_state: string;
  ip_configurations: UnusedVmInterfaceDataIpConfig[];
}

export interface UnusedVmInterfaceDataIpConfig {
  id: string;
  name: string;
  etag: string;
  type: string;
  private_ip_address: string;
  private_ip_allocation_method: string;
  private_ip_address_version: string;
  subnet: {
    id: string;
  };
  primary: boolean;
  public_ip_address?: {
    id?: string;
  };
  provisioning_state: string;
}
