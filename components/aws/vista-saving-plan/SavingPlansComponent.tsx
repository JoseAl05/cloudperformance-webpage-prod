'use client'
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
import { Ec2TableComponent } from "@/components/aws/vista-saving-plan/tables/Ec2TableComponent"
import { LambdaTableComponent } from "@/components/aws/vista-saving-plan/tables/LambdaTableComponent"
import {
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Activity,
  DollarSign,
  Clock,
  Calendar,
  Server,
  Zap,
  CheckCircle2
} from "lucide-react"
import { SavingPlansBarChartComponent } from '@/components/aws/vista-saving-plan/graficos/SavingPlansBarChartComponent'
import { SavingPlansLineChartComponent } from '@/components/aws/vista-saving-plan/graficos/SavingPlansLineChartComponent'

const fetcher = (url: string) =>
  fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
    .then(r => r.json());

const formatUSD = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)


const normalizeDay = (date: Date | string) => {
  const d = new Date(date)
  return d.toISOString().split("T")[0]
}




interface SavingPlansComponentProps {
  startDate: Date
  endDate: Date
}

export const SavingPlansViewComponent = ({ startDate, endDate }: SavingPlansComponentProps) => {
  const startDateFormatted = startDate.toISOString().replace("Z", "").slice(0, -4)
  const endDateFormatted = endDate ? endDate.toISOString().replace("Z", "").slice(0, -4) : ""



  const { data: plansData } = useSWR(
    `/api/aws/bridge/saving-plans/vista-saving-plans?date_from=${startDateFormatted}&date_to=${endDateFormatted}`,
    fetcher
  )
  const activePlan = plansData?.[0];
  const selectedArn = activePlan?.savingsPlanArn;

  const { data: stats } = useSWR(
    `/api/aws/bridge/saving-plans/vista-saving-plans/dashboard-stats?date_from=${startDateFormatted}&date_to=${endDateFormatted}`,
    fetcher
  )

  
  const { data: costUsage, error, isLoading } = useSWR(
    `/api/aws/bridge/saving-plans/saving-plan-cost-usage?date_from=${startDateFormatted}&date_to=${endDateFormatted}&savings_plan_arn=${selectedArn}`,
    fetcher
  )

  const { data: spcost } = useSWR(
    `/api/aws/bridge/saving-plans/savings-plan-cost?date_from=${startDateFormatted}&date_to=${endDateFormatted}&savings_plan_arn=${selectedArn}`,
    fetcher
  )

  const { data: ec2Intances } = useSWR(
    `/api/aws/bridge/saving-plans/ec2-instances-prices/?date_from=${startDateFormatted}&date_to=${endDateFormatted}`,
    fetcher
  )

  const { data: lambdaFunctions } = useSWR(
    `/api/aws/bridge/saving-plans/lambda-functions-prices/?date_from=${startDateFormatted}&date_to=${endDateFormatted}`,
    fetcher
  )

  const getCoverageStatus = () => {
    if (!spcost || !costUsage || costUsage.length === 0) {
      return { 
        label: "Sin Datos", color: "text-gray-400", bg: "border-l-gray-400", 
        icon: <Activity className="h-8 w-8 text-gray-400" />, 
        utilizado: 0, compromiso: 0, desperdicio: 0 
      };
    }

    let totalUsoReal = 0;    
    let totalCompromiso = 0; 

    costUsage.forEach((curr: CostUsage) => {
      const serviceName = curr.dimensions?.SERVICE || curr.SERVICE || "";
      if (serviceName.includes("Savings Plans")) {
        totalUsoReal += Number(curr.amortizedcost) || 0; 
        totalCompromiso += Number(curr.unblendedcost) || 0;
      }
    });

    if (totalCompromiso === 0) {
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diasDelPeriodo = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
      totalCompromiso = spcost.costo_diario * diasDelPeriodo;
      totalUsoReal = costUsage.reduce((acc, curr) => acc + (Number(curr.amortizedcost) || 0), 0);
    }

    const diferencia = totalCompromiso - totalUsoReal;

    if (diferencia > totalCompromiso * 0.15) { 
      // Sobra más del 15% del dinero del plan -> Excesivo
      return { 
        label: "Excesivo / Subutilizado", 
        color: "text-orange-600", 
        bg: "border-l-orange-500",
        icon: <TrendingDown className="h-8 w-8 text-orange-500" />,
        desc: "Estás pagando por capacidad que no estás usando. La barra verde de compromiso es mayor a la azul de uso.",
        utilizado: totalUsoReal,
        compromiso: totalCompromiso,
        desperdicio: diferencia
      };
    } else if (diferencia < -(totalCompromiso * 0.15)) {
      // Falta más del 15% -> Baja Cobertura
      return { 
        label: "Baja Cobertura", 
        color: "text-blue-600", 
        bg: "border-l-blue-500",
        icon: <TrendingUp className="h-8 w-8 text-blue-500" />,
        desc: "Tu consumo supera el plan. El excedente se está facturando a precio On-Demand normal.",
        utilizado: totalUsoReal,
        compromiso: totalCompromiso,
        desperdicio: Math.abs(diferencia)
      };
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
    };
  };

  const coverage = getCoverageStatus();

  if (isLoading) return <p>Cargando...</p>
  if (error) return <p>Error cargando los datos.</p>


  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-4">
      <div className="col-span-1 md:col-span-2">
        <Card className="border-l-4 border-l-orange-500 shadow-lg rounded-2xl">
          <CardContent className="p-6">
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
      </div>
      <div className="col-span-1 md:col-span-2">
        <Card className="border-l-4 border-l-blue-500 shadow-lg rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Planes Registrados</p>
                <p className="text-2xl font-bold text-blue-600">{stats?.planes_registrados ?? 0}</p>
                <p className="text-xs text-muted-foreground">Total registrados</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" aria-label="Planes registrados" />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="col-span-1 md:col-span-2">
        <Card className="border-l-4 border-l-green-500 shadow-lg rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Planes Activos</p>
                <p className="text-2xl font-bold text-green-600">{stats?.planes_activos ?? 0}</p>
                <p className="text-xs text-muted-foreground">Actualmente en uso</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" aria-label="Planes activos" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="col-span-1 md:col-span-6">
        <Dialog>
          <DialogTrigger asChild>
            <Card className={`border-l-4 ${coverage.bg} cursor-pointer hover:shadow-md transition rounded-2xl h-full`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground uppercase text-[10px]">Cobertura del Plan</p>
                    <p className={`text-2xl font-bold ${coverage.color}`}>{coverage.label}</p>
                    
                    {/* Condicional: Si es excesivo mostramos Desperdicio, si no, mostramos el uso */}
                    {coverage.label === "Excesivo / Subutilizado" ? (
                       <p className="text-xs font-semibold text-red-500 mt-1">
                         Desperdicio: {formatUSD(coverage.desperdicio)}
                       </p>
                    ) : (
                       <p className="text-xs text-muted-foreground mt-1">
                         Utilizado: {formatUSD(coverage.utilizado)}
                       </p>
                    )}
                  </div>
                  {coverage.icon}
                </div>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Análisis de Eficiencia</DialogTitle>
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

      <SavingPlansBarChartComponent
        costUsage={costUsage ? costUsage : []}
      />
      <div className="col-span-1 md:col-span-4 space-y-6">
        <Card className="border-l-4 border-l-purple-500 rounded-2xl">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Compromiso</p>
              <p className="text-2xl font-bold text-purple-600">{formatUSD(spcost?.commitment_hourly ?? 0)}/hora</p>
              <p className="text-xs text-muted-foreground">Compromiso por hora</p>
            </div>
            <Clock className="h-8 w-8 text-purple-500" aria-label="Compromiso por hora" />
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-indigo-500 rounded-2xl">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Costo Diario</p>
              <p className="text-2xl font-bold text-indigo-600">{formatUSD(spcost?.costo_diario ?? 0)}</p>
              <p className="text-xs text-muted-foreground">Promedio por día</p>
            </div>
            <Calendar className="h-8 w-8 text-indigo-500" aria-label="Costo diario" />
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-teal-500 rounded-2xl">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Costo Mensual</p>
              <p className="text-2xl font-bold text-teal-600">{formatUSD(spcost?.costo_mensual ?? 0)}</p>
              <p className="text-xs text-muted-foreground">Estimado mensual</p>
            </div>
            <DollarSign className="h-8 w-8 text-teal-500" aria-label="Costo mensual" />
          </CardContent>
        </Card>
      </div>
      <SavingPlansLineChartComponent
        costUsage={costUsage ? costUsage : []}
        startDate={startDate}
        endDate={endDate}
      />
      <div className="col-span-1 md:col-span-9">
        <Card className="shadow-lg rounded-2xl h-full">
          <CardHeader>
            <CardTitle>Detalle instancias EC2</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[460px] overflow-y-auto">
              <Ec2TableComponent startDateFormatted={startDateFormatted} endDateFormatted={endDateFormatted} />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="col-span-1 md:col-span-3 flex flex-col gap-6">
        <Card className="border-l-4 border-l-cyan-500 flex-1 rounded-2xl">
          <CardContent className="p-3 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cantidad Instancias EC2</p>
                <p className="text-2xl font-bold text-cyan-600">{ec2Intances?.total_unique_instances ?? 0}</p>
                <p className="text-xs text-muted-foreground">Instancias registradas</p>
              </div>
              <Server className="h-8 w-8 text-cyan-500" aria-label="Cantidad instancias EC2" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-cyan-500 flex-1 rounded-2xl">
          <CardContent className="p-3 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total precio Instancias EC2</p>
                <p className="text-2xl font-bold text-cyan-600">{formatUSD(ec2Intances?.total_price_usd ?? 0)}/hora</p>
                <p className="text-xs text-muted-foreground">Instancias registradas</p>
              </div>
              <Server className="h-8 w-8 text-cyan-500" aria-label="Precio instancias EC2" />
            </div>
          </CardContent>
        </Card>
      </div>
      {/* <div className="col-span-1 md:col-span-9">
        <Card className="shadow-lg rounded-2xl h-full">
          <CardHeader>
            <CardTitle>Detalle Lambda</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[460px] overflow-y-auto">
              <LambdaTableComponent startDateFormatted={startDateFormatted} endDateFormatted={endDateFormatted} />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="col-span-1 md:col-span-3">
        <Card className="border-l-4 border-l-emerald-500 rounded-2xl h-[580px] flex flex-col justify-center">
          <CardContent className="p-6 flex items-center justify-between h-full">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Cantidad Funciones Lambda</p>
              <p className="text-2xl font-bold text-emerald-600">
                {lambdaFunctions?.total_unique_functions ?? 0}
              </p>
              <p className="text-xs text-muted-foreground">Funciones registradas</p>
            </div>
            <Zap className="h-8 w-8 text-emerald-500" aria-label="Funciones Lambda" />
          </CardContent>
        </Card>
      </div> */}
    </div>
  )
}