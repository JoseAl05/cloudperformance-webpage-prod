export interface ComputeEngineMetrics {
    avg_value: number;
    metric_name: string;
    metric_data: ComputeEngineMetricData[];
}

export interface ComputeEngineMetricData{
    timestamp:string;
    metric_value:number;
}

export interface ComputeEngineInfoServiceAccount {
  scopes: string[];
  email: string;
}

export interface ComputeEngineInfoIntegrityPolicy {
  updateAutoLearnPolicy: boolean;
}

export interface ComputeEngineInfoScheduling {
  preemptible: boolean;
  onHostMaintenance: string;
  provisioningModel: string;
  instanceTerminationAction: string;
  automaticRestart: boolean;
}

export interface ComputeEngineInfoMetadataItem {
  key: string;
  value: string;
}

export interface ComputeEngineInfoMetadata {
  items: ComputeEngineInfoMetadataItem[];
}

export interface ComputeEngineInfoShieldedConfig {
  enableSecureBoot: boolean;
  enableIntegrityMonitoring: boolean;
  enableVtpm: boolean;
}

export interface ComputeEngineInfoDbxItem {
  content: string;
  fileType: string;
}

export interface ComputeEngineInfoShieldedInitialState {
  dbxs?: ComputeEngineInfoDbxItem[];
  dbx?: ComputeEngineInfoDbxItem[];
}

export interface ComputeEngineInfoGuestOsFeature {
  type: string;
}

export interface ComputeEngineInfoDisk {
  type: string;
  source: string;
  architecture: string;
  autoDelete: boolean;
  index: number;
  boot: boolean;
  deviceName: string;
  shieldedInstanceInitialState?: ComputeEngineInfoShieldedInitialState;
  diskSizeGb?: string;
  guestOsFeatures?: ComputeEngineInfoGuestOsFeature[];
  licenses?: string[];
  interface: string;
  mode: string;
}

export interface ComputeEngineInfoAccessConfig {
  networkTier: string;
  name: string;
  type: string;
}

export interface ComputeEngineInfoNetworkInterface {
  stackType: string;
  networkIP: string;
  subnetwork: string;
  name: string;
  fingerprint: string;
  accessConfigs: ComputeEngineInfoAccessConfig[];
  network: string;
}

export interface ComputeEngineInfoEffectiveMetadata {
  vmDnsSettingMetadataValue: string;
}

export interface ComputeEngineInfoResourceStatus {
  effectiveInstanceMetadata: ComputeEngineInfoEffectiveMetadata;
  scheduling: Record<string, unknown>;
}

export interface ComputeEngineInfoTags {
  fingerprint: string;
}

export interface ComputeEngineInfoHistoryData {
  satisfiesPzi: boolean;
  id: string;
  status: string;
  lastStopTimestamp: string;
  lastStartTimestamp: string;
  selfLink: string;
  startRestricted: boolean;
  serviceAccounts: ComputeEngineInfoServiceAccount[];
  creationTimestamp: string;
  shieldedInstanceIntegrityPolicy: ComputeEngineInfoIntegrityPolicy;
  scheduling: ComputeEngineInfoScheduling;
  machineType: string;
  metadata: ComputeEngineInfoMetadata;
  shieldedInstanceConfig: ComputeEngineInfoShieldedConfig;
  canIpForward: boolean;
  disks: ComputeEngineInfoDisk[];
  zone: string;
  deletionProtection: boolean;
  networkInterfaces: ComputeEngineInfoNetworkInterface[];
  labelFingerprint: string;
  cpuPlatform: string;
  name: string;
  fingerprint: string;
  resourceStatus: ComputeEngineInfoResourceStatus;
  tags: ComputeEngineInfoTags;
  location: string;
  project_id: string;
  source_name: string;
  sync_time: string;
}

export interface ComputeEngineInfo {
  history_data: ComputeEngineInfoHistoryData[];
  instance_name: string;
  instance_id: string;
}

export type ComputeEngineInfoResponse = ComputeEngineInfo[];