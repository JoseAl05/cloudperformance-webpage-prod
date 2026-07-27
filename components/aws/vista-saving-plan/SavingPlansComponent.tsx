'use client'
import { useState, useEffect, useMemo } from 'react'
import useSWR from 'swr'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Ec2TableComponent } from "@/components/aws/vista-saving-plan/tables/Ec2TableComponent"
import {
  TrendingDown,
  TrendingUp,
  Activity,
  DollarSign,
  Clock,
  Calendar,
  Server,
  CheckCircle2,
  Filter
} from "lucide-react"
import { SavingPlansBarChartComponent } from '@/components/aws/vista-saving-plan/graficos/SavingPlansBarChartComponent'
import { SavingPlansLineChartComponent } from '@/components/aws/vista-saving-plan/graficos/SavingPlansLineChartComponent'
import { LoaderComponent } from '@/components/general_aws/LoaderComponent'

interface SavingsPlanItem {
  savingsPlanArn: string
  savingsPlanId?: string
  savingsPlanType?: string
  planType?: string
  type?: string
  state?: string
  status?: string
  estado?: string
  [key: string]: unknown
}

interface CostUsageItem {
  dimensions?: { SERVICE?: string; [key: string]: string | undefined }
  SERVICE?: string
  amortizedcost?: number | string
  unblendedcost?: number | string
  [key: string]: unknown
}

interface SpCostData {
  commitment_hourly?: number
  costo_diario?: number
  costo_mensual?: number
}

interface DashboardStats {
  planes_retirados?: number
  planes_registrados?: number
  planes_activos?: number
}

interface Ec2InstancesPrices {
  total_unique_instances?: number
  total_price_usd?: number
}

interface SavingPlansComponentProps {
  startDate: Date | string
  endDate: Date | string
}

const fetcher = (url: string) =>
  fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
    .then(r => r.json())

const formatUSD = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)

export const SavingPlansViewComponent = ({ startDate, endDate }: SavingPlansComponentProps) => {
  const startObj = useMemo(() => new Date(startDate), [startDate])
  const endObj = useMemo(() => (endDate ? new Date(endDate) : null), [endDate])

  const startDateFormatted = !isNaN(startObj.getTime()) ? startObj.toISOString().replace("Z", "").slice(0, -4) : ""
  const endDateFormatted = endObj && !isNaN(endObj.getTime()) ? endObj.toISOString().replace("Z", "").slice(0, -4) : ""

  const [selectedPlanType, setSelectedPlanType] = useState<string>("all")
  const [selectedArn, setSelectedArn] = useState<string>("")
  const [isSwitchingArn, setIsSwitchingArn] = useState<boolean>(false)

  const { data: plansData, isLoading: loadingPlans } = useSWR<SavingsPlanItem[]>(
    startDateFormatted && endDateFormatted
      ? `/api/aws/bridge/saving-plans/vista-saving-plans?date_from=${startDateFormatted}&date_to=${endDateFormatted}`
      : null,
    fetcher
  )

  const { data: stats, isLoading: loadingStats } = useSWR<DashboardStats>(
    startDateFormatted && endDateFormatted
      ? `/api/aws/bridge/saving-plans/vista-saving-plans/dashboard-stats?date_from=${startDateFormatted}&date_to=${endDateFormatted}`
      : null,
    fetcher
  )

  const totalActivePlansInAccount = useMemo(() => {
    if (!plansData || !Array.isArray(plansData)) return 0
    return plansData.filter((plan) => 
      !plan.state || plan.state?.toLowerCase() === 'active' || plan.status?.toLowerCase() === 'active' || plan.estado === 'ACTIVO'
    ).length
  }, [plansData])

  const availableTypes = useMemo(() => {
    if (!plansData || !Array.isArray(plansData)) return []
    const typesSet = new Set<string>()
    plansData.forEach((plan) => {
      const type = plan.savingsPlanType || plan.planType || plan.type
      if (type && typeof type === "string") typesSet.add(type)
    })
    return Array.from(typesSet)
  }, [plansData])

  const activePlans = useMemo(() => {
    if (!plansData || !Array.isArray(plansData)) return []
    const filtered = plansData.filter((plan) => {
      const isActive = !plan.state || plan.state?.toLowerCase() === 'active' || plan.status?.toLowerCase() === 'active' || plan.estado === 'ACTIVO'
      const planType = plan.savingsPlanType || plan.planType || plan.type || ""
      const matchesType = selectedPlanType === "all" || (typeof planType === "string" && planType.toLowerCase().includes(selectedPlanType.toLowerCase()))
      return isActive && matchesType
    })

    const uniquePlansMap = new Map<string, SavingsPlanItem>()
    filtered.forEach((plan) => {
      if (plan.savingsPlanArn && !uniquePlansMap.has(plan.savingsPlanArn)) {
        uniquePlansMap.set(plan.savingsPlanArn, plan)
      }
    })

    return Array.from(uniquePlansMap.values())
  }, [plansData, selectedPlanType])

  useEffect(() => {
    if (activePlans.length > 0) {
      const currentArnExists = activePlans.some((p) => p.savingsPlanArn === selectedArn)
      if (!selectedArn || !currentArnExists) {
        setIsSwitchingArn(true)
        setSelectedArn(activePlans[0].savingsPlanArn)
      }
    } else {
      setSelectedArn("") 
      setIsSwitchingArn(false)
    }
  }, [activePlans, selectedArn])

  const isComputePlan = useMemo(() => {
    const currentPlan = activePlans.find((p) => p.savingsPlanArn === selectedArn)
    const typeToCheck = String(currentPlan?.savingsPlanType || currentPlan?.planType || currentPlan?.type || selectedPlanType).toLowerCase()
    
    if (typeToCheck.includes("database") || typeToCheck.includes("rds") || typeToCheck.includes("db") || typeToCheck.includes("sagemaker")) {
      return false
    }
    return true
  }, [selectedPlanType, selectedArn, activePlans])

  const { data: costUsage, error: errorUsage, isLoading: loadingUsage, isValidating: validatingUsage } = useSWR<CostUsageItem[]>(
    selectedArn && startDateFormatted && endDateFormatted
      ? `/api/aws/bridge/saving-plans/saving-plan-cost-usage?date_from=${startDateFormatted}&date_to=${endDateFormatted}&savings_plan_arn=${selectedArn}`
      : null,
    fetcher,
    { keepPreviousData: false }
  )

  const { data: spcost, isLoading: loadingSpCost, isValidating: validatingSpCost } = useSWR<SpCostData>(
    selectedArn && startDateFormatted && endDateFormatted
      ? `/api/aws/bridge/saving-plans/savings-plan-cost?date_from=${startDateFormatted}&date_to=${endDateFormatted}&savings_plan_arn=${selectedArn}`
      : null,
    fetcher,
    { keepPreviousData: false }
  )

  const { data: ec2Intances, isLoading: loadingEc2, isValidating: validatingEc2 } = useSWR<Ec2InstancesPrices>(
    isComputePlan && startDateFormatted && endDateFormatted
      ? `/api/aws/bridge/saving-plans/ec2-instances-prices/?date_from=${startDateFormatted}&date_to=${endDateFormatted}`
      : null,
    fetcher,
    { keepPreviousData: false }
  )

  useEffect(() => {
    if (selectedArn && !loadingUsage && !validatingUsage && !loadingSpCost && !validatingSpCost) {
      const timer = setTimeout(() => {
        setIsSwitchingArn(false)
      }, 350)
      return () => clearTimeout(timer)
    }
  }, [selectedArn, loadingUsage, validatingUsage, loadingSpCost, validatingSpCost])

  const isWaitingForInitialArn = activePlans.length > 0 && !selectedArn
  
  const isGlobalLoading = 
    loadingPlans || 
    loadingStats || 
    isWaitingForInitialArn || 
    isSwitchingArn || 
    (selectedArn !== "" && (loadingUsage || validatingUsage || loadingSpCost || validatingSpCost)) || 
    (isComputePlan && (loadingEc2 || validatingEc2))

  if (isGlobalLoading) {
    return <LoaderComponent />
  }

  if (!plansData || plansData.length === 0 || totalActivePlansInAccount === 0) {
    return (
      <div className="py-8 px-4">
        <Card className="border-dashed border-2 border-slate-300 dark:border-slate-800 shadow-none rounded-2xl bg-slate-50/50 dark:bg-slate-900/50">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">
              No hay Savings Plans disponibles
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mb-6">
              No se encontraron Savings Plans activos o vinculados a tu cuenta de AWS en el rango de tiempo seleccionado.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-200/60 dark:bg-slate-800 text-xs font-mono text-slate-600 dark:text-slate-300">
              <span>Período consultado:</span>
              <span className="font-bold">{startDateFormatted} al {endDateFormatted}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (errorUsage) return <p className="p-4 text-sm text-red-500">Ocurrió un error cargando los datos del plan.</p>

  const getCoverageStatus = () => {
    if (!spcost || !costUsage || !Array.isArray(costUsage) || costUsage.length === 0) {
      return { 
        label: "Sin Datos", color: "text-gray-400", bg: "border-l-gray-400", 
        icon: <Activity className="h-8 w-8 text-gray-400" />, 
        utilizado: 0, compromiso: 0, desperdicio: 0 
      }
    }

    let totalUsoReal = 0    
    let totalCompromiso = 0 

    costUsage.forEach((curr) => {
      const serviceName = curr.dimensions?.SERVICE || curr.SERVICE || ""
      if (serviceName.includes("Savings Plans")) {
        totalUsoReal += Number(curr.amortizedcost) || 0 
        totalCompromiso += Number(curr.unblendedcost) || 0
      }
    })

    if (totalCompromiso === 0) {
      const endTime = endObj ? endObj.getTime() : startObj.getTime()
      const diffTime = Math.abs(endTime - startObj.getTime())
      const diasDelPeriodo = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1
      totalCompromiso = (Number(spcost.costo_diario) || 0) * diasDelPeriodo
      totalUsoReal = costUsage.reduce((acc, curr) => acc + (Number(curr.amortizedcost) || 0), 0)
    }

    const diferencia = totalCompromiso - totalUsoReal

    if (diferencia > totalCompromiso * 0.15) { 
      return { 
        label: "Excesivo / Subutilizado", 
        color: "text-orange-600", 
        bg: "border-l-orange-500",
        icon: <TrendingDown className="h-8 w-8 text-orange-500" />,
        desc: "Estás pagando por capacidad que no estás usando. La barra verde de compromiso es mayor a la azul de uso.",
        utilizado: totalUsoReal,
        compromiso: totalCompromiso,
        desperdicio: diferencia
      }
    } else if (diferencia < -(totalCompromiso * 0.15)) {
      return { 
        label: "Baja Cobertura", 
        color: "text-blue-600", 
        bg: "border-l-blue-500",
        icon: <TrendingUp className="h-8 w-8 text-blue-500" />,
        desc: "Tu consumo supera el plan. El excedente se está facturando a precio On-Demand normal.",
        utilizado: totalUsoReal,
        compromiso: totalCompromiso,
        desperdicio: Math.abs(diferencia)
      }
    }
    
    return { 
      label: "Óptimo", 
      color: "text-green-600", 
      bg: "border-l-green-500",
      icon: <CheckCircle2 className="h-8 w-8 text-green-500" />,
      desc: "Excelente balance. Estás aprovechando casi todo tu compromiso sin pasarte demasiado.",
      utilizado: totalUsoReal,
      compromiso: totalCompromiso,
      desperdicio: 0
    }
  }

  const coverage = getCoverageStatus()

  return (
    <div className="space-y-6 p-4">
      <div>
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Resumen Global de la Cuenta (Todos los planes)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-orange-500 shadow-sm rounded-2xl">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Planes Retirados</p>
                  <p className="text-2xl font-bold text-orange-600">{stats?.planes_retirados ?? 0}</p>
                  <p className="text-xs text-muted-foreground">Planes desactivados</p>
                </div>
                <TrendingDown className="h-8 w-8 text-orange-500" aria-label="Planes retirados" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500 shadow-sm rounded-2xl">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Planes Registrados</p>
                  <p className="text-2xl font-bold text-blue-600">{stats?.planes_registrados ?? 0}</p>
                  <p className="text-xs text-muted-foreground">Total en la organización</p>
                </div>
                <Activity className="h-8 w-8 text-blue-500" aria-label="Planes registrados" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500 shadow-sm rounded-2xl">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Planes Activos</p>
                  <p className="text-2xl font-bold text-green-600">{stats?.planes_activos ?? 0}</p>
                  <p className="text-xs text-muted-foreground">Actualmente operando</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" aria-label="Planes activos" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border gap-4">
        <div className="flex items-center gap-2 min-w-[200px]">
          <Filter className="h-5 w-5 text-indigo-500 shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Inspeccionar Savings Plan Específico</h3>
            <p className="text-xs text-muted-foreground">Las métricas inferiores cambiarán según el ARN seleccionado</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-1 justify-end">
          <div className="w-full sm:w-[220px]">
            <Select 
              value={selectedPlanType} 
              onValueChange={(val) => {
                setIsSwitchingArn(true)
                setSelectedPlanType(val)
                setSelectedArn("") 
              }}
            >
              <SelectTrigger className="w-full bg-white dark:bg-slate-800 rounded-xl">
                <SelectValue placeholder="Tipo de Plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                {availableTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
                {availableTypes.length === 0 && (
                  <>
                    <SelectItem value="Compute">Compute</SelectItem>
                    <SelectItem value="EC2Instance">EC2 Instance</SelectItem>
                    <SelectItem value="SageMaker">SageMaker</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:w-[380px]">
            <Select 
              value={selectedArn} 
              onValueChange={(val) => {
                setIsSwitchingArn(true)
                setSelectedArn(val)
              }}
              disabled={activePlans.length === 0}
            >
              <SelectTrigger className="w-full bg-white dark:bg-slate-800 rounded-xl font-mono text-xs">
                <SelectValue placeholder={activePlans.length === 0 ? "Sin planes para este tipo" : "Selecciona un Savings Plan"} />
              </SelectTrigger>
              <SelectContent>
                {activePlans.length === 0 && (
                  <SelectItem value="none" disabled>No se encontraron planes activos</SelectItem>
                )}
                {activePlans.map((plan) => {
                  const shortName = plan.savingsPlanId || plan.savingsPlanArn.split('/').pop() || plan.savingsPlanArn
                  const typeLabel = plan.savingsPlanType || plan.planType ? ` (${plan.savingsPlanType || plan.planType})` : ''

                  return (
                    <SelectItem 
                      key={plan.savingsPlanArn} 
                      value={plan.savingsPlanArn}
                      className="truncate max-w-[360px] font-mono text-xs"
                    >
                      {shortName}{typeLabel}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="col-span-1 md:col-span-12">
          <Dialog>
            <DialogTrigger asChild>
              <Card className={`border-l-4 ${coverage.bg} cursor-pointer hover:shadow-md transition rounded-2xl`}>
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Estado del Plan Seleccionado:</p>
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-slate-600 dark:text-slate-300">
                          {selectedArn ? (selectedArn.split('/').pop() || selectedArn) : 'Ninguno'}
                        </span>
                      </div>
                      <p className={`text-3xl font-extrabold mt-1 ${coverage.color}`}>{coverage.label}</p>
                      
                      {coverage.label === "Excesivo / Subutilizado" ? (
                        <p className="text-sm font-medium text-red-500 mt-1">
                          Dinero Desperdiciado en el período: <span className="font-bold">{formatUSD(coverage.desperdicio)}</span>
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground mt-1">
                          Uso real aprovechado: <span className="font-semibold text-slate-700 dark:text-slate-200">{formatUSD(coverage.utilizado)}</span>
                        </p>
                      )}
                    </div>
                    <div className="self-end sm:self-center flex items-center gap-3">
                      <span className="text-xs text-muted-foreground underline">Ver análisis detallado</span>
                      {coverage.icon}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Análisis de Eficiencia del Plan</DialogTitle>
                <DialogDescription className="pt-2">{coverage.desc}</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 mt-4 border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Compromiso Total (Verde):</span>
                  <span className="text-sm font-bold text-slate-700">{formatUSD(coverage.compromiso)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Uso Real Aprovechado (Azul):</span>
                  <span className="text-sm font-bold text-blue-600">{formatUSD(coverage.utilizado)}</span>
                </div>

                {coverage.label === "Excesivo / Subutilizado" && (
                  <div className="flex justify-between items-center p-2 bg-red-50 rounded-md border border-red-100 mt-2">
                    <span className="text-sm font-semibold text-red-600">Dinero Desperdiciado:</span>
                    <span className="text-sm font-bold text-red-600">{formatUSD(coverage.desperdicio)}</span>
                  </div>
                )}

                {coverage.label === "Baja Cobertura" && (
                  <div className="flex justify-between items-center p-2 bg-orange-50 rounded-md border border-orange-100 mt-2">
                    <span className="text-sm font-semibold text-orange-600">Gasto fuera del plan:</span>
                    <span className="text-sm font-bold text-orange-600">{formatUSD(coverage.desperdicio)}</span>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="col-span-1 md:col-span-8 flex flex-col">
          <div className="flex-1 h-full w-full">
            <SavingPlansBarChartComponent costUsage={costUsage ? costUsage : []} />
          </div>
        </div>

        <div className="col-span-1 md:col-span-4 flex flex-col justify-between gap-4 h-full">
          <Card className="border-l-4 border-l-purple-500 rounded-2xl shadow-sm flex-1 flex flex-col justify-center">
            <CardContent className="p-5 flex items-center justify-between w-full">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Compromiso</p>
                <p className="text-2xl font-bold text-purple-600">{formatUSD(spcost?.commitment_hourly ?? 0)}/hora</p>
                <p className="text-xs text-muted-foreground">Compromiso por hora</p>
              </div>
              <Clock className="h-8 w-8 text-purple-500 shrink-0" aria-label="Compromiso por hora" />
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-indigo-500 rounded-2xl shadow-sm flex-1 flex flex-col justify-center">
            <CardContent className="p-5 flex items-center justify-between w-full">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Costo Diario</p>
                <p className="text-2xl font-bold text-indigo-600">{formatUSD(spcost?.costo_diario ?? 0)}</p>
                <p className="text-xs text-muted-foreground">Promedio por día</p>
              </div>
              <Calendar className="h-8 w-8 text-indigo-500 shrink-0" aria-label="Costo diario" />
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-teal-500 rounded-2xl shadow-sm flex-1 flex flex-col justify-center">
            <CardContent className="p-5 flex items-center justify-between w-full">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Costo Mensual</p>
                <p className="text-2xl font-bold text-teal-600">{formatUSD(spcost?.costo_mensual ?? 0)}</p>
                <p className="text-xs text-muted-foreground">Estimado mensual</p>
              </div>
              <DollarSign className="h-8 w-8 text-teal-500 shrink-0" aria-label="Costo mensual" />
            </CardContent>
          </Card>
        </div>

        <div className="col-span-1 md:col-span-12">
          <SavingPlansLineChartComponent
            costUsage={costUsage ? costUsage : []}
            startDate={startObj}
            endDate={endObj || startObj}
          />
        </div>

        {isComputePlan && (
          <>
            <div className="col-span-1 md:col-span-9">
              <Card className="shadow-lg rounded-2xl h-full">
                <CardHeader>
                  <CardTitle>Detalle instancias EC2 cubiertas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[460px] overflow-y-auto">
                    <Ec2TableComponent startDateFormatted={startDateFormatted} endDateFormatted={endDateFormatted} />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="col-span-1 md:col-span-3 flex flex-col gap-6">
              <Card className="border-l-4 border-l-cyan-500 flex-1 rounded-2xl shadow-sm">
                <CardContent className="p-5 flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Instancias EC2</p>
                      <p className="text-3xl font-bold text-cyan-600">{ec2Intances?.total_unique_instances ?? 0}</p>
                      <p className="text-xs text-muted-foreground mt-1">Instancias registradas en el plan</p>
                    </div>
                    <Server className="h-8 w-8 text-cyan-500" aria-label="Cantidad instancias EC2" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-cyan-500 flex-1 rounded-2xl shadow-sm">
                <CardContent className="p-5 flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Costo EC2</p>
                      <p className="text-3xl font-bold text-cyan-600">{formatUSD(ec2Intances?.total_price_usd ?? 0)}/h</p>
                      <p className="text-xs text-muted-foreground mt-1">Gasto por hora cubierto</p>
                    </div>
                    <Server className="h-8 w-8 text-cyan-500" aria-label="Precio instancias EC2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  )
}