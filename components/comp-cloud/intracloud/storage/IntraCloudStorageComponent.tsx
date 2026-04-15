'use client'

import { ReqPayload } from '@/components/comp-cloud/intracloud/IntraCloudConfigComponent';
import { IntraCloudDiskServiceComponent } from '@/components/comp-cloud/intracloud/storage/IntraCloudDiskServiceComponent';
import { IntraCloudStorageServiceComponent } from '@/components/comp-cloud/intracloud/storage/IntraCloudStorageServiceComponent';
import { IntraCloudStorageCategorySelectionComponent } from '@/components/comp-cloud/intracloud/storage/IntraCloudStorageCategorySelectionComponent';
import { DynamicFilterProps } from '@/components/general_comp_cloud/filters/FilterComponent';
import { useState } from 'react';
import useSWR from 'swr';

type IntraCloudStorageComponentProps = DynamicFilterProps;

interface BackendPayload extends ReqPayload {
    filters: Record<string, {
        resource_group?: string;
        resources?: string;
    }>;
}

const fetcherPost = async ([url, payload]: [string, BackendPayload]) => {
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const errorInfo = await res.json().catch(() => ({}));
        throw new Error(errorInfo.message || 'Error al obtener datos');
    }
    return res.json();
};

export const IntraCloudStorageComponent = ({
    payload,
    startDate,
    endDate,
    resourceGroups,
    resources,
    service,
    region
}: IntraCloudStorageComponentProps) => {
    if(!service){
        return (
            <div>
                Seleccione Servicio
            </div>
        )
    }
    return (
        <div className="p-4 space-y-6">
            {
                (service === 'strg_account' || service === 'storage_buckets' || service === 'storage') && (
                    <>
                        <IntraCloudStorageServiceComponent
                            payload={payload}
                            startDate={startDate}
                            endDate={endDate}
                            resourceGroups={resourceGroups}
                            resources={resources}
                            service={service}
                            region={region}
                        />
                    </>
                )
            }
            {
                service === 'disks' && (
                    <>
                        <IntraCloudDiskServiceComponent
                            payload={payload}
                            startDate={startDate}
                            endDate={endDate}
                            resourceGroups={resourceGroups}
                            resources={resources}
                            service={service}
                            region={region}
                        />
                    </>
                )
            }
        </div>
    )
}