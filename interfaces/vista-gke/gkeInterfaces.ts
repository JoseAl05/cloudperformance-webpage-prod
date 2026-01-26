export interface ClusterGkeMetrics {
  avg_value: number;
  metric_name: string;
  metric_data: ClusterGkeMetricData[];
}

export interface ClusterGkeMetricData {
  timestamp: string;
  metric_value: number;
}

export interface ClusterGkeInstances {
    resource_name: string;
    resource_id: string;
    instance_data: ClusterGkeInstancesData[];
}

export interface ClusterGkeInstancesData {
    status: string;
    location:string;
    disks: ClusterGkeInstancesDataDisks[];
    cpuPlatform: string;
    networkInterfaces: ClusterGkeInstancesDataNetworkInterfaces[];
    machineType:string;
    sync_time: string;
    creationTimestamp: string;
}

export interface ClusterGkeInstancesDataDisks {
    interface:string;
    deviceName: string;
    licenses: string[];
    boot:boolean;
    mode: string;
    diskSizeGb: string;
    type: string;
    source: string;
    guestOsFeatures: [{type: string;}];
    architecture:string;
    index:number;
    autoDelete: boolean;
    shieldedInstanceInitialState:{
        [key: string]: [
            {
                content: string;
                fileType: string;
            }
        ]
    };
}

export interface ClusterGkeInstancesDataNetworkInterfaces {
    stackType: string;
    accessConfigs:[
        {
            networkTier: string;
            type: string;
            name: string;
            natIP: string;
        }
    ];
    subnetwork: string;
    fingerprint: string;
    networkIP: string;
    network: string;
    name: string;
}

export interface ClusterGkeBilling {
  cost_gross_clp: number;
  cost_gross_usd: number;
  cost_net_clp: number;
  cost_net_usd: number;
  discount_clp: number;
  discount_usd: number;
  sync_time: string;
  usage_start_time: string;
  sku: string;
  resource: string;
}

export interface ClusterGkeResponse {
  cluster_gke_name: string;
  instance_group_id: string;
  history_data: ClusterGkeInfo[];
}

export interface ClusterGkeInfo {
  nodeConfig: ClusterGkeNodeConfig;
  nodePoolDefaults: ClusterGkeNodePoolDefaults;
  workloadIdentityConfig: Record<string, unknown>;
  secretManagerConfig: ClusterGkeSecretManagerConfig;
  shieldedNodes: { enabled: boolean };
  authenticatorGroupsConfig: Record<string, unknown>;
  selfLink: string;
  etag: string;
  satisfiesPzs: boolean;
  resourceLabels: Record<string, string>;
  zone: string;
  currentNodeCount: number;
  masterAuth: ClusterGkeMasterAuth;
  monitoringService: string;
  instanceGroupUrls: string[];
  network: string;
  status: string;
  initialClusterVersion: string;
  defaultMaxPodsConstraint: ClusterGkeMaxPodsConstraint;
  anonymousAuthenticationConfig: ClusterGkeAnonymousAuthenticationConfig;
  autopilot: Record<string, unknown>;
  podAutoscaling: ClusterGkePodAutoscaling;
  addonsConfig: ClusterGkeAddonsConfig;
  maintenancePolicy: ClusterGkeMaintenancePolicy;
  ipAllocationPolicy: ClusterGkeIpAllocationPolicy;
  loggingConfig: ClusterGkeLoggingConfig;
  securityPostureConfig: ClusterGkeSecurityPostureConfig;
  databaseEncryption: ClusterGkeDatabaseEncryption;
  masterAuthorizedNetworksConfig: ClusterGkeMasterAuthorizedNetworksConfig;
  name: string;
  nodePoolAutoConfig: ClusterGkeNodePoolAutoConfig;
  legacyAbac: Record<string, unknown>;
  notificationConfig: ClusterGkeNotificationConfig;
  monitoringConfig: ClusterGkeMonitoringConfig;
  currentNodeVersion: string;
  location: string;
  verticalPodAutoscaling: Record<string, unknown>;
  rbacBindingConfig: ClusterGkeRbacBindingConfig;
  autoscaling: ClusterGkeAutoscaling;
  loggingService: string;
  releaseChannel: { channel: string };
  createTime: string;
  id: string;
  binaryAuthorization: { evaluationMode: string };
  satisfiesPzi: boolean;
  subnetwork: string;
  clusterIpv4Cidr: string;
  userManagedKeysConfig: Record<string, unknown>;
  controlPlaneEndpointsConfig: ClusterGkeControlPlaneEndpointsConfig;
  nodePools: ClusterGkeNodePool[];
  privateClusterConfig: ClusterGkePrivateClusterConfig;
  locations: string[];
  enterpriseConfig: { clusterTier: string };
  endpoint: string;
  costManagementConfig: Record<string, unknown>;
  networkConfig: ClusterGkeNetworkConfig;
  currentMasterVersion: string;
  servicesIpv4Cidr: string;
  labelFingerprint: string;
  project_id: string;
  source_name: string;
  sync_time: string;
}

export interface ClusterGkeNodeConfig {
  diskType: string;
  shieldedInstanceConfig: { enableIntegrityMonitoring: boolean };
  ephemeralStorageLocalSsdConfig: Record<string, unknown>;
  spot: boolean;
  metadata: Record<string, string>;
  effectiveCgroupMode: string;
  advancedMachineFeatures: Record<string, unknown>;
  bootDisk: ClusterGkeBootDisk;
  resourceLabels: Record<string, string>;
  windowsNodeConfig: Record<string, unknown>;
  kubeletConfig: ClusterGkeKubeletConfig;
  diskSizeGb: number;
  imageType: string;
  oauthScopes: string[];
  serviceAccount: string;
  machineType: string;
}

export interface ClusterGkeBootDisk {
  sizeGb: string;
  diskType: string;
}

export interface ClusterGkeKubeletConfig {
  insecureKubeletReadonlyPortEnabled: boolean;
  maxParallelImagePulls: number;
}

export interface ClusterGkeNodePoolDefaults {
  nodeConfigDefaults: {
    loggingConfig: {
      variantConfig: {
        variant: string;
      };
    };
    gcfsConfig: Record<string, unknown>;
    nodeKubeletConfig: {
      insecureKubeletReadonlyPortEnabled: boolean;
    };
  };
}

export interface ClusterGkeSecretManagerConfig {
  rotationConfig: { enabled: boolean };
  enabled: boolean;
}

export interface ClusterGkeMasterAuth {
  clusterCaCertificate: string;
  clientCertificateConfig: Record<string, unknown>;
}

export interface ClusterGkeMaxPodsConstraint {
  maxPodsPerNode: string;
}

export interface ClusterGkeAnonymousAuthenticationConfig {
  mode: string;
}

export interface ClusterGkePodAutoscaling {
  hpaProfile: string;
}

export interface ClusterGkeAddonsConfig {
  gcsFuseCsiDriverConfig: Record<string, unknown>;
  networkPolicyConfig: { disabled: boolean };
  httpLoadBalancing: Record<string, unknown>;
  gkeBackupAgentConfig: Record<string, unknown>;
  dnsCacheConfig: { enabled: boolean };
  rayOperatorConfig: Record<string, unknown>;
  gcePersistentDiskCsiDriverConfig: { enabled: boolean };
  kubernetesDashboard: { disabled: boolean };
  gcpFilestoreCsiDriverConfig: Record<string, unknown>;
  configConnectorConfig: Record<string, unknown>;
  cloudRunConfig: {
    disabled: boolean;
    loadBalancerType: string;
  };
}

export interface ClusterGkeMaintenancePolicy {
  resourceVersion: string;
}

export interface ClusterGkeIpAllocationPolicy {
  servicesIpv4Cidr: string;
  podCidrOverprovisionConfig: Record<string, unknown>;
  servicesIpv4CidrBlock: string;
  clusterSecondaryRangeName: string;
  defaultPodIpv4RangeUtilization: number;
  clusterIpv4CidrBlock: string;
  networkTierConfig: { networkTier: string };
  useIpAliases: boolean;
  clusterIpv4Cidr: string;
  stackType: string;
}

export interface ClusterGkeLoggingConfig {
  componentConfig: {
    enableComponents: string[];
  };
}

export interface ClusterGkeSecurityPostureConfig {
  vulnerabilityMode: string;
  mode: string;
}

export interface ClusterGkeDatabaseEncryption {
  state: string;
  currentState: string;
}

export interface ClusterGkeMasterAuthorizedNetworksConfig {
  privateEndpointEnforcementEnabled: boolean;
  gcpPublicCidrsAccessEnabled: boolean;
}

export interface ClusterGkeNodePoolAutoConfig {
  nodeKubeletConfig: {
    insecureKubeletReadonlyPortEnabled: boolean;
  };
}

export interface ClusterGkeNotificationConfig {
  pubsub: Record<string, unknown>;
}

export interface ClusterGkeMonitoringConfig {
  advancedDatapathObservabilityConfig: { enableRelay: boolean };
  managedPrometheusConfig: {
    autoMonitoringConfig: { scope: string };
    enabled: boolean;
  };
  componentConfig: {
    enableComponents: string[];
  };
}

export interface ClusterGkeRbacBindingConfig {
  enableInsecureBindingSystemAuthenticated: boolean;
  enableInsecureBindingSystemUnauthenticated: boolean;
}

export interface ClusterGkeAutoscaling {
  autoscalingProfile: string;
  autoprovisioningNodePoolDefaults: ClusterGkeAutoProvisioningDefaults;
}

export interface ClusterGkeAutoProvisioningDefaults {
  serviceAccount: string;
  imageType: string;
  oauthScopes: string[];
  management: {
    autoRepair: boolean;
    autoUpgrade: boolean;
  };
}

export interface ClusterGkeControlPlaneEndpointsConfig {
  ipEndpointsConfig: {
    authorizedNetworksConfig: ClusterGkeMasterAuthorizedNetworksConfig;
    publicEndpoint: string;
    privateEndpoint: string;
    enabled: boolean;
    enablePublicEndpoint: boolean;
  };
  dnsEndpointConfig: {
    enableK8sCertsViaDns: boolean;
    allowExternalTraffic: boolean;
    enableK8sTokensViaDns: boolean;
    endpoint: string;
  };
}

export interface ClusterGkeNodePool {
  upgradeSettings: {
    strategy: string;
    maxSurge: number;
  };
  status: string;
  etag: string;
  version: string;
  autoscaling: Record<string, unknown>;
  selfLink: string;
  locations: string[];
  maxPodsConstraint: ClusterGkeMaxPodsConstraint;
  podIpv4CidrSize: number;
  networkConfig: ClusterGkeNodePoolNetworkConfig;
  queuedProvisioning: Record<string, unknown>;
  initialNodeCount: number;
  management: {
    autoRepair: boolean;
    autoUpgrade: boolean;
  };
  placementPolicy: Record<string, unknown>;
  name: string;
  config: ClusterGkeNodeConfig;
  instanceGroupUrls: string[];
}

export interface ClusterGkeNodePoolNetworkConfig {
  podRange: string;
  podIpv4RangeUtilization: number;
  subnetwork: string;
  podIpv4CidrBlock: string;
  enablePrivateNodes: boolean;
  networkTierConfig: { networkTier: string };
}

export interface ClusterGkePrivateClusterConfig {
  enablePrivateNodes: boolean;
  privateEndpoint: string;
  publicEndpoint: string;
}

export interface ClusterGkeNetworkConfig {
  network: string;
  defaultSnatStatus: Record<string, unknown>;
  dnsConfig: { clusterDns: string };
  serviceExternalIpsConfig: Record<string, unknown>;
  datapathProvider: string;
  subnetwork: string;
  disableL4LbFirewallReconciliation: boolean;
  defaultEnablePrivateNodes: boolean;
  enableFqdnNetworkPolicy: boolean;
}