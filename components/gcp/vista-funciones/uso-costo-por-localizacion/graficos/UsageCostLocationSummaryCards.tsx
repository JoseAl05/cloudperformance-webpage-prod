'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Globe, Server, Activity, DollarSign } from 'lucide-react'

interface ResumenUsoCosto {
  total_regiones: number
  total_recursos: number
  total_muestras: number
  costo_total_global_usd: number
}

interface Props {
  resumen?: ResumenUsoCosto
  isLoading: boolean
}

const StatCard = ({
  title,
  value,
  unit,
  icon: Icon,
  description,
  colorClass = 'blue'
}: any) => {

  const colorStyles = {
    blue:   { border: "border-l-blue-500",   bgIcon: "bg-blue-100 text-blue-600" },
    green:  { border: "border-l-green-500",  bgIcon: "bg-green-100 text-green-600" },
    purple: { border: "border-l-purple-500", bgIcon: "bg-purple-100 text-purple-600" },
    amber:  { border: "border-l-amber-500",  bgIcon: "bg-amber-100 text-amber-600" },
  }

  const style = colorStyles[colorClass as keyof typeof colorStyles] || colorStyles.blue

  return (
    <Card className={`border-l-4 shadow-sm ${style.border}`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h4 className="text-3xl font-bold tracking-tight">
              {value} {unit && <span className="text-sm font-normal text-slate-400">{unit}</span>}
            </h4>
          </div>
          <div className={`p-3 rounded-xl ${style.bgIcon}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

export const UsageCostLocationSummaryCards = ({ resumen, isLoading }: Props) => {

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse">
        {[1,2,3,4].map(i => (
          <div key={i} className="h-40 bg-slate-100 dark:bg-slate-800 rounded-lg border-l-4 border-slate-200" />
        ))}
      </div>
    )
  }

  if (!resumen) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

      <StatCard
        title="Regiones Activas"
        value={resumen.total_regiones}
        description="Regiones con recursos monitoreados."
        icon={Globe}
        colorClass="blue"
      />

      <StatCard
        title="Total Recursos"
        value={resumen.total_recursos.toLocaleString('es-ES')}
        description="Instancias o recursos evaluados."
        icon={Server}
        colorClass="purple"
      />

      <StatCard
        title="Total Muestras"
        value={resumen.total_muestras.toLocaleString('es-ES')}
        description="Puntos de monitoreo analizados."
        icon={Activity}
        colorClass="amber"
      />

      <StatCard
        title="Costo Total"
        value={`$${(resumen.costo_total_global_usd || 0).toFixed(2)}`}
        unit="USD"
        description="Costo acumulado estimado."
        icon={DollarSign}
        colorClass="green"
      />

    </div>
  )
}