'use client'

import { Card, CardContent } from '@/components/ui/card'
import { SpotVsRegularVm } from '@/interfaces/vista-spot-vs-regular-vm/spotVsRegularVmInterfaces'
import { Cloud, Percent, Server } from 'lucide-react'
import { useMemo } from 'react'

interface SpotVsRegularVmCardsComponentProps {
    data: SpotVsRegularVm[]
}

export const SpotVsRegularVmCardsComponent = ({ data }: SpotVsRegularVmCardsComponentProps) => {

    const { totalVMs, totalSpot, spotPercentage, isToday, dateLabel } = useMemo(() => {
        if (!data || data.length === 0) {
            return { totalVMs: null, totalSpot: null, spotPercentage: null, isToday: null, dateLabel: null }
        }



        const last = data[data.length - 1]
        const totalVMs = last.total_instancias || 0
        const totalSpot = last.total_spot || 0
        const spotPercentage = totalVMs > 0 ? ((totalSpot / totalVMs) * 100).toFixed(2) : null

        const today = new Date();
        const referenceDate = new Date(last.sync_time);
        const isToday =
            referenceDate.getDate() === today.getDate() &&
            referenceDate.getMonth() === today.getMonth() &&
            referenceDate.getFullYear() === today.getFullYear();
        const dateLabel = referenceDate.toLocaleDateString();

        return { totalVMs, totalSpot, spotPercentage, isToday, dateLabel }
    }, [data])

    return (
        <div className="space-y-6 p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-l-4 border-l-indigo-500 shadow-lg rounded-2xl">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Cantidad Total VMs
                                </p>
                                <p className="text-2xl font-bold text-indigo-600">
                                    {totalVMs !== null ? totalVMs : '(En blanco)'}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {isToday ? 'Última Observación' : dateLabel}
                                </p>
                            </div>
                            <Server className="h-8 w-8 text-indigo-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-orange-500 shadow-lg rounded-2xl">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Cantidad Total Spot VMs
                                </p>
                                <p className="text-2xl font-bold text-orange-600">
                                    {totalSpot !== null ? totalSpot : '(En blanco)'}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {isToday ? 'Última Observación' : dateLabel}
                                </p>
                            </div>
                            <Cloud className="h-8 w-8 text-orange-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-green-500 shadow-lg rounded-2xl">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Porcentaje de Spot VMs
                                </p>
                                <p className="text-2xl font-bold text-green-600">
                                    {spotPercentage !== null ? `${spotPercentage}%` : '(En blanco)'}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Relación Spot vs Total
                                </p>
                            </div>
                            <Percent className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}