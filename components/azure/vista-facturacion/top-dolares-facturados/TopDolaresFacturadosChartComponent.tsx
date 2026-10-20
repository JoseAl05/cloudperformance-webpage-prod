'use client'
import { TopBillingView } from '@/components/shared/billing/TopBillingView'
import { AZURE_TOP_DIMENSIONS } from '@/components/shared/billing/billingConfigs'

interface TopDolaresFacturadosChartProps {
  startDate: Date
  endDate?: Date
}

export const TopDolaresFacturadosChartComponent = ({ startDate, endDate }: TopDolaresFacturadosChartProps) => (
  <TopBillingView cloud="azure" startDate={startDate} endDate={endDate ?? startDate} dimensions={AZURE_TOP_DIMENSIONS} />
)
