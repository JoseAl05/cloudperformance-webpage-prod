'use client'
import { TopBillingView } from '@/components/shared/billing/TopBillingView'
import { AWS_TOP_DIMENSIONS } from '@/components/shared/billing/billingConfigs'

interface TopDolaresInstanceTypeFamilyProps {
  startDate: Date,
  endDate: Date
}

export const MainViewTopDolaresFamilia = ({ startDate, endDate }: TopDolaresInstanceTypeFamilyProps) => (
  <TopBillingView cloud="aws" startDate={startDate} endDate={endDate} dimensions={[AWS_TOP_DIMENSIONS.instanceTypeFamily]} />
)
