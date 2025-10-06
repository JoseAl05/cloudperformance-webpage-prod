export interface SpotVsRegularVm {
    sync_time: string;
    total_spot: number;
    total_instancias: number;
    instancias:SpotVsRegularVmInstances[];
}

export interface SpotVsRegularVmInstances {
    vm_name: string;
    priority: string;
    location: string;
}