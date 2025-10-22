'use client'

import React, { useEffect, useRef } from "react"
import useSWR from 'swr'
import * as echarts from "echarts"
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
  Zap
} from "lucide-react"
import { SavingPlansBarChartComponent } from './graficos/SavingPlansBarChartComponent'
import { SavingPlansLineChartComponent } from './graficos/SavingPlansLineChartComponent'

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
  const selectedArn =
    "arn:aws:savingsplans::413591708008:savingsplan/e7ebd204-b438-4d74-969a-2a4be4e86a8a"
  const estadoPlan = "Excesivo"


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
            <Card className="border-l-4 border-l-yellow-500 cursor-pointer hover:shadow-lg transition w-full h-full rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Estado Saving Plan</p>
                    <p className="text-2xl font-bold text-yellow-600">{estadoPlan}</p>
                    <p className="text-xs text-muted-foreground">Estado actual del plan</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-yellow-500" aria-label="Estado Saving Plan" />
                </div>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Detalle del Estado del Saving Plan</DialogTitle>
              <DialogDescription>
                Aquí se mostrará la diferencia y recomendaciones de optimización.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <p><strong>Compromiso actual:</strong> {formatUSD(spcost?.commitment_hourly ?? 0)}/hora</p>
              <p><strong>Costo mensual estimado:</strong> {formatUSD(spcost?.costo_mensual ?? 0)}</p>
              <p><strong>Costo diario promedio:</strong> {formatUSD(spcost?.costo_diario ?? 0)}</p>
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
      <div className="col-span-1 md:col-span-9">
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
      </div>
    </div>
  )
}