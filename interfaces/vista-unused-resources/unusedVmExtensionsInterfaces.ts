export interface UnusedVmExtensions {
    vm_name: string;
    _cq_sync_time: string;
    extensions: UnusedVmExtensionsData[]
}

export interface UnusedVmExtensionsData{
    id:string;
    name: string;
    vm_name: string;
    type_handler_version:string;
    provisioning_state:string;
    auto_upgrade_minor_version: string;
    publisher: string;
    type: string;
    type_properties_type:string;
}