import { Card, CardContent } from "@/components/ui/card"
import { ReactNode } from "react"

interface MetricCardProps {
  title: string
  value: string | number
  description: string
  icon: ReactNode
  borderColor?: string
  valueColor?: string
  compact?: boolean
}

export const MetricCardComponent = ({
  title,
  value,
  description,
  icon,
  borderColor = "border-l-gray-300",
  valueColor = "text-gray-900",
  compact = false,
}: MetricCardProps) => {
  return (
    <Card className={`border-l-4 ${borderColor} flex-1`}>
      <CardContent className={`p-${compact ? "3" : "6"}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          <div className="flex items-center justify-center">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
