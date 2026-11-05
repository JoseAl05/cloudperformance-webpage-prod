'use client'
import { TopBillingView } from '@/components/shared/billing/TopBillingView'
import { AWS_TOP_DIMENSIONS } from '@/components/shared/billing/billingConfigs'

interface TopDolaresOSComponentProps {
  startDate: Date,
  endDate: Date
}

export const MainViewTopDolaresSO = ({ startDate, endDate }: TopDolaresOSComponentProps) => (
  <TopBillingView cloud="aws" startDate={startDate} endDate={endDate} dimensions={[AWS_TOP_DIMENSIONS.operatingSystem]} />
)
