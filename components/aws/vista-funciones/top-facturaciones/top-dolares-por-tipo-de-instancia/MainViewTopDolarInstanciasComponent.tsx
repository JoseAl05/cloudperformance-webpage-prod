'use client'
import { TopBillingView } from '@/components/shared/billing/TopBillingView'
import { AWS_TOP_DIMENSIONS } from '@/components/shared/billing/billingConfigs'

interface TopDolaresInstanceTypeProps {
  startDate: Date,
  endDate: Date
}

export const MainViewTopDolaresTipoInstancia = ({ startDate, endDate }: TopDolaresInstanceTypeProps) => (
  <TopBillingView cloud="aws" startDate={startDate} endDate={endDate} dimensions={[AWS_TOP_DIMENSIONS.instanceType]} />
)
