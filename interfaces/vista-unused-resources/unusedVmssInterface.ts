export interface UnusedVmss {
  cpu_total: number;
  memory_total: number;
  series: UnusedVmssSeries[];
  vm_name: string;
  vm_id: string;
  location: string;
  subscription: string;
  sync_time: string;
  cpu_under: boolean;
  mem_under: boolean;
  disk_details: UnusedVmssDiskDetails[];
  interface_details: UnusedVmssInterfaceDetails[];
  costo_estimado_usd?: number;  // --- NUEVO ---
}

export interface UnusedVmssSeries {
  name: string;
  metric_value: number;
  metric_value_maximum?: number;  // --- NUEVO ---
  metric_value_minimum?: number;  // --- NUEVO ---
  timestamp: string;
}

export interface UnusedVmssDiskDetails {
  sync_time: string;
  disks: UnusedVmssDisksData[];
}

export interface UnusedVmssDisksData {
  id: string;
  os_type: string;
  storage_account_type: string;
  disk_size_gb: number;
}

export interface UnusedVmssInterfaceDetails {
  sync_time: string;
  interfaces: UnusedVmssInterfaceData[];
}

export interface UnusedVmssInterfaceData {
  id: string;
  name: string;
  nic_type: string;
  primary: boolean;
  provisioning_state: string;
  ip_configurations: UnusedVmssInterfaceDataIpConfig[];
}

export interface UnusedVmssInterfaceDataIpConfig {
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