import { InterCloudReqPayload } from '@/components/comp-cloud/intercloud/InterCloudConfigComponent';
import { InterCloudVmCardsComponent } from '@/components/comp-cloud/intercloud/virtual_machines/info/InterCloudVmCardsComponent';
import { DynamicFilterProps } from '@/components/general_comp_cloud/filters/FilterComponent';
import { AlertCircle, Loader2 } from 'lucide-react';
import useSWR from 'swr';

type InterCloudVmComponentProps = DynamicFilterProps;

interface BackendPayload extends InterCloudReqPayload {
    filters: Record<string, {
        resource_group?: string;
        resources?: string;
        region?: string;
        location_region?: string;
        project_id?: string;
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

const isNonEmptyArray = <T,>(v: unknown): v is T[] => Array.isArray(v) && v.length > 0
const isNullish = (v: unknown) => v === null || v === undefined

export const InterCloudVmComponent = ({
    region,
    payload
}: InterCloudVmComponentProps) => {

    const filtersPayload: Record<string, unknown> = {};

    if (payload.tenant_id) {
        if (payload.cloud_provider === 'Azure') {
            filtersPayload[payload.tenant_id] = {
                resource_group: resourceGroups[payload.tenant_id] || 'all'
            };
        } else if (payload.cloud_provider === 'AWS') {
            filtersPayload[payload.tenant_id] = {
                region: region[payload.tenant_id] || 'all_regions'
            };
        } else if (payload.cloud_provider === 'GCP') {
            filtersPayload[payload.tenant_id] = {
                location_region: region[payload.tenant_id] || 'all_regions',
                project_id: payload.project_id || 'all'
            };
        }
    }

    const fullPayload: BackendPayload = {
        ...payload,
        filters: filtersPayload
    };

    let urlVmComparison = '';

    switch (payload.cloud_provider) {
        case 'AWS':
            urlVmComparison = `/api/comparison-cloud/bridge/intercloud/aws/ec2/get_virtual_machine_cloud_comparison`;
            break;
        default:
            break;
    }

    const vmComparison = useSWR(
        [urlVmComparison, fullPayload],
        fetcherPost,
        {
            revalidateOnFocus: false,
            shouldRetryOnError: false
        }
    );

    return (
        <div className="p-4 space-y-6">
            {vmComparison.isLoading && (
                <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-200 bg-gray-50/50">
                    <Loader2 className="h-10 w-10 text-emerald-500 animate-spin mb-4" />
                    <p className="text-gray-500 font-medium">Analizando datos de {payload.cloud_provider}...</p>
                </div>
            )}
            {vmComparison.error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 border border-red-200">
                    <AlertCircle size={20} />
                    <div className="flex flex-col">
                        <p>Ocurrió un error al cargar el reporte.</p>
                        <span className="text-xs font-mono mt-1 opacity-90">{vmComparison.error.message}</span>
                    </div>
                </div>
            )}
            {
                vmComparison.data && (
                    <InterCloudVmCardsComponent
                        data={vmComparison.data.instances_data}
                        sourceCloud={payload.cloud_provider}
                    />
                )
            }
        </div>
    )
}