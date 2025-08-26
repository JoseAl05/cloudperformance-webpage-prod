'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MapPin, Server } from 'lucide-react'


interface Ec2ResourceViewHistoricInfoComponentProps {
    instances: unknown[]
}

export const Ec2ResourceViewHistoricInfoComponent = ({ instances }: Ec2ResourceViewHistoricInfoComponentProps) => {
    console.log(instances);
    return (
        <ScrollArea className="max-h-[60vh]">
            {
                instances && (
                    instances.map((instance, index) => (
                        <Card key={index} className='my-5'>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Server className="h-5 w-5 text-blue-500" />
                                    Instancia {instance.InstanceId}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <div className="flex items-center justify-between gap-5">
                                        <span></span>
                                        <Badge variant="default" className="bg-green-100 text-green-800">
                                            {instance.State_Name}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Fecha Observación:</span>
                                        <span className="font-medium text-green-600">{new Date(instance.sync_time).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Tipo:</span>
                                        <span className="font-medium">{instance.InstanceType}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Región:</span>
                                        <span className="font-medium flex items-center gap-1">
                                            <MapPin className="h-3 w-3" />
                                            {instance.region}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">SO:</span>
                                        <span className="font-medium">{instance.PlatformDetails}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Despliegue:</span>
                                        <span className="font-medium">{instance.InstancePurchaseMethod}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )
            }
        </ScrollArea>
    )
}