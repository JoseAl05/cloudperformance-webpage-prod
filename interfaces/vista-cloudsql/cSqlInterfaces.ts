export interface CloudSqlMetrics {
  avg_value: number;
  metric_name: string;
  metric_data: CloudSqlMetricData[];
}

export interface CloudSqlMetricData {
  timestamp: string;
  metric_value: number;
}

export interface CloudSqlBilling {
  cost_gross_clp: number;
  cost_gross_usd: number;
  cost_net_clp: number;
  cost_net_usd: number;
  discount_clp: number;
  discount_usd: number;
  sync_time: string;
  usage_start_time: string;
  sku: string;
}

export interface CloudSqlInfo {
  history_data: HistoryDatum[];
  instance_name: string;
  instance_id: string;
}

export interface HistoryDatum {
  gceZone: string;
  databaseInstalledVersion: string;
  ipAddresses: IpAddress[];
  state: string;
  region: string;
  createTime: string;
  selfLink: string;
  kind: string;
  maintenanceVersion: string;
  serviceAccountEmailAddress: string;
  serverCaCert: ServerCaCert;
  databaseVersion: string;
  project: string;
  satisfiesPzi: boolean;
  instanceType: string;
  includeReplicasForMajorVersionUpgrade: boolean;
  connectionName: string;
  settings: Settings;
  sqlNetworkArchitecture: string;
  name: string;
  backendType: string;
  project_id: string;
  source_name: string;
  replicaNames: unknown[];
  masterInstanceName: string | null;
  currentDiskSize: number | null;
  maxDiskSize: number | null;
  suspensionReason: unknown[];
  satisfiesPzs: boolean;
  upgradableDatabaseVersions: unknown[];
  diskEncryptionConfiguration: Record<string, unknown>;
  diskEncryptionStatus: Record<string, unknown>;
  scheduledMaintenance: Record<string, unknown>;
  outOfDiskReport: Record<string, unknown>;
  primaryDnsName: string | null;
  writeEndpoint: string | null;
  dnsName: string | null;
  pscServiceAttachmentLink: string | null;
  replicationCluster: Record<string, unknown>;
  geminiConfig: Record<string, unknown>;
  sync_time: string;
}

export interface IpAddress {
  ipAddress: string;
  type: string;
}

export interface ServerCaCert {
  kind: string;
  commonName: string;
  sha1Fingerprint: string;
  createTime: string;
  instance: string;
  certSerialNumber: string;
  expirationTime: string;
}

export interface Settings {
  edition: string;
  availabilityType: string;
  dataDiskSizeGb: string;
  connectorEnforcement: string;
  deletionProtectionEnabled: boolean;
  finalBackupConfig: FinalBackupConfig;
  replicationLagMaxSeconds: number;
  locationPreference: LocationPreference;
  backupConfiguration: BackupConfiguration;
  timeZone: string;
  activationPolicy: string;
  maintenanceWindow: MaintenanceWindow;
  ipConfiguration: IpConfiguration;
  collation: string;
  storageAutoResizeLimit: string;
  kind: string;
  advancedMachineFeatures: Record<string, unknown>;
  settingsVersion: string;
  replicationType: string;
  userLabels: UserLabels;
  retainBackupsOnDelete: boolean;
  storageAutoResize: boolean;
  sqlServerAuditConfig: SqlServerAuditConfig;
  tier: string;
  pricingPlan: string;
  dataDiskType: string;
  insightsConfig: InsightsConfig;
}

export interface FinalBackupConfig {
  enabled: boolean;
}

export interface LocationPreference {
  zone: string;
  kind: string;
}

export interface BackupConfiguration {
  transactionLogRetentionDays: number;
  backupRetentionSettings: BackupRetentionSettings;
  transactionalLogStorageState: string;
  backupTier: string;
  startTime: string;
  pointInTimeRecoveryEnabled: boolean;
  enabled: boolean;
  kind: string;
}

export interface BackupRetentionSettings {
  retentionUnit: string;
  retainedBackups: number;
}

export interface MaintenanceWindow {
  day: number;
  hour: number;
  kind: string;
  updateTrack: string;
}

export interface IpConfiguration {
  serverCaMode: string;
  ipv4Enabled: boolean;
  sslMode: string;
  serverCertificateRotationMode: string;
  requireSsl: boolean;
}

export interface UserLabels {
  ambiente: string;
  servicio: string;
}

export interface SqlServerAuditConfig {
  retentionInterval: string;
  uploadInterval: string;
  kind: string;
}

export interface InsightsConfig {
  queryStringLength: number;
  enhancedQueryInsightsEnabled: boolean;
  queryPlansPerMinute: number;
}
