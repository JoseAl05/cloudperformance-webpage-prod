'use client'
import { TopBillingView } from '@/components/shared/billing/TopBillingView'
import { AWS_TOP_DIMENSIONS } from '@/components/shared/billing/billingConfigs'

interface TopDolaresRegionComponentProps {
  startDate: Date,
  endDate: Date
}

export const MainViewTopDolaresRegion = ({ startDate, endDate }: TopDolaresRegionComponentProps) => (
  <TopBillingView cloud="aws" startDate={startDate} endDate={endDate} dimensions={[AWS_TOP_DIMENSIONS.region]} />
)
