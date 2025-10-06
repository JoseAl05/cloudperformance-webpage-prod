export interface StorageVsGeneralCapacity {
    last_capacity_per_service:StorageVsGeneralCapacityPerService[];
    last_strg_account_capacity:StorageVsGeneralCapacityPerService[];
}

export interface StorageVsGeneralCapacityPerService {
    series:StorageVsGeneralCapacitySeries[];
    metric: string;
    storage_account_name: string;
}

export interface StorageVsGeneralCapacitySeries {
    timestamp:string;
    value:number;
}