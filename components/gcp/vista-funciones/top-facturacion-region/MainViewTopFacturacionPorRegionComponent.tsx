'use client'
import { TopBillingView } from '@/components/shared/billing/TopBillingView'
import { GCP_TOP_DIMENSIONS } from '@/components/shared/billing/billingConfigs'

interface TopDolaresRegionComponentProps {
    startDate: Date
    endDate: Date
    projects: string;
    tagKey: string | null;
    tagValue: string | null;
}

export const MainViewTopFacturacionPorLocalizacionGCP = ({ startDate, endDate, projects, tagKey, tagValue }: TopDolaresRegionComponentProps) => (
    <TopBillingView
        cloud="gcp"
        startDate={startDate}
        endDate={endDate}
        dimensions={[GCP_TOP_DIMENSIONS.region]}
        params={{ project_id: projects, tag_key: tagKey, tag_value: tagValue }}
    />
)
