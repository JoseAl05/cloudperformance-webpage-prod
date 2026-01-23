export interface InstanceGroupsMetrics {
  avg_value: number;
  metric_name: string;
  metric_data: InstanceGroupsMetricData[];
}

export interface InstanceGroupsMetricData {
  timestamp: string;
  metric_value: number;
}

export interface InstanceGroupsInstances {
    resource_name: string;
    resource_id: string;
    instance_data: InstanceGroupsInstancesData[];
}

export interface InstanceGroupsInstancesData {
    status: string;
    location:string;
    disks: InstanceGroupsInstancesDataDisks[];
    cpuPlatform: string;
    networkInterfaces: InstanceGroupsInstancesDataNetworkInterfaces[];
    machineType:string;
    sync_time: string;
    creationTimestamp: string;
}

export interface InstanceGroupsInstancesDataDisks {
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

export interface InstanceGroupsInstancesDataNetworkInterfaces {
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

export interface InstanceGroupInfo {
    history_data: HistoryData[];
    instance_group_name: string;
    nistance_group_id: string;
}

export interface HistoryData {
    versions: Version[];
    standbyPolicy: StandbyPolicy;
    description: string;
    fingerprint: string;
    baseInstanceName: string;
    instanceTemplate: string;
    distributionPolicy: DistributionPolicy;
    status: Status;
    region: string;
    selfLink: string;
    listManagedInstancesResults: string;
    id: string;
    instanceGroup: string;
    targetSize: number;
    satisfiesPzs: boolean;
    updatePolicy: UpdatePolicy;
    satisfiesPzi: boolean;
    creationTimestamp: string;
    targetSuspendedSize: number;
    instanceLifecyclePolicy: InstanceLifecyclePolicy;
    name: string;
    targetStoppedSize: number;
    currentActions: CurrentActions;
    location: string;
    project_id: string;
    source_name: string;
    sync_time: string;
}

export interface Version {
    instanceTemplate: string;
    targetSize: VersionTargetSize;
}

export interface VersionTargetSize {
    calculated: number;
}

export interface StandbyPolicy {
    initialDelaySec: number;
    mode: string;
}

export interface DistributionPolicy {
    targetShape: string;
    zones: Zone[];
}

export interface Zone {
    zone: string;
}

export interface Status {
    autoscaler: string;
    isStable: boolean;
    versionTarget: VersionTarget;
    stateful: Stateful;
    allInstancesConfig: AllInstancesConfig;
}

export interface VersionTarget {
    isReached: boolean;
}

export interface Stateful {
    hasStatefulConfig: boolean;
    perInstanceConfigs: PerInstanceConfigs;
}

export interface PerInstanceConfigs {
    allEffective: boolean;
}

export interface AllInstancesConfig {
    effective: boolean;
}

export interface UpdatePolicy {
    replacementMethod: string;
    minimalAction: string;
    maxUnavailable: PolicyLimit;
    type: string;
    instanceRedistributionType: string;
    maxSurge: PolicyLimit;
}

export interface PolicyLimit {
    fixed: number;
    calculated: number;
}

export interface InstanceLifecyclePolicy {
    forceUpdateOnRepair: string;
    defaultActionOnFailure: string;
}

export interface CurrentActions {
    refreshing: number;
    deleting: number;
    creatingWithoutRetries: number;
    starting: number;
    none: number;
    recreating: number;
    verifying: number;
    resuming: number;
    suspending: number;
    creating: number;
    stopping: number;
    abandoning: number;
    restarting: number;
}

export interface InstanceGroupsBilling {
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