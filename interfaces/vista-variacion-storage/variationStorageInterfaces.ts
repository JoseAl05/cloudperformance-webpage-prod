export interface StorageVariation{
    storage_account:StorageVariationData;
    blob_service: StorageVariationData;
    table_service: StorageVariationData;
    queue_service: StorageVariationData;
    file_service: StorageVariationData;
}

export interface StorageVariationData{
    resource:string;
    metric: string;
    location: string;
    actual_range:StorageVariationRanges;
    prev_range:StorageVariationRanges;
    variation: number;
    variation_percent:number;
}

export interface StorageVariationRanges{
    metrics:StorageVariationsRangesMetrics[];
    average:number;
    month:string;
    year:number;
}

export interface StorageVariationsRangesMetrics{
    resource: string;
    region: string;
    metric: string;
    metric_value: number;
    metric_timestamp: string;
}