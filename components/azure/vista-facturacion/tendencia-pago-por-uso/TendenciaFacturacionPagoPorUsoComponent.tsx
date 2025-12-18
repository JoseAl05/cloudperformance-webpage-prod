'use client'

import useSWR from 'swr';
import { TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoaderComponent } from '@/components/general_aws/LoaderComponent';
import { TendenciaFacturacionPagoPorUsoLineChartComponent } from './grafico/TendenciaFacturacionPagoPorUsoLineChartComponent';

interface TendenciaFacturacionAzureProps {
    startDate: Date;
    endDate: Date;
    region: string;
    subscription: string;
    selectedTagKey: string | null;
    selectedTagValue: string | null;
    selectedMeterCategory: string | null;
    selectedInstance: string | null;
}

interface FacturacionAzureData {
    tags: Record<string, string>;
    subscription_name: string;
    date: string;
    product: string;
    meter_category: string;
    instance_name: string;
    cost_in_usd: number;
    resource_location: string;
}

const fetcher = (url: string) =>
  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => res.json())

export const TendenciaFacturacionPagoPorUsoComponent = ({
    startDate,
    endDate,
    region,
    subscription,
    selectedTagKey,
    selectedTagValue,
    selectedMeterCategory,
    selectedInstance,
}: TendenciaFacturacionAzureProps) => {

    const startDateFormatted = startDate.toISOString().split('.')[0];
    const endDateFormatted = endDate.toISOString().split('.')[0];

    // Construir URL base
    const params = new URLSearchParams({
        date_from: startDateFormatted,
        date_to: endDateFormatted,
        resource_location: region,
        subscription_name: subscription
    });

    // Agregar parámetros opcionales solo si tienen valores válidos
    if (selectedTagKey && selectedTagKey !== '' && selectedTagKey !== 'null') {
        params.append('nombre_tag', selectedTagKey);
    }

    if (selectedTagValue && selectedTagValue !== '' && selectedTagValue !== 'null') {
        params.append('valor_tag', selectedTagValue);
    }

    if (selectedMeterCategory && selectedMeterCategory !== '' && selectedMeterCategory !== 'null') {
        params.append('meter_category', selectedMeterCategory);
    }

    if (selectedInstance && selectedInstance !== 'all_instances') {
        params.append('instance_name', selectedInstance);
    }

    const apiUrl = `/api/azure/bridge/azure/facturacion/pago-por-uso?${params.toString()}`;

    const { data, error, isLoading } = useSWR<FacturacionAzureData[]>(apiUrl, fetcher);

    const calculateMetrics = (rawData: FacturacionAzureData[]) => {
        if (!rawData?.length) return { total: 0, services: 0, subscriptions: 0, locations: 0 };
        const total = rawData.reduce((sum, item) => sum + item.cost_in_usd, 0);
        const services = new Set(rawData.map((i) => i.meter_category)).size;
        const subscriptions = new Set(rawData.map((i) => i.subscription_name)).size;
        const locations = new Set(rawData.map((i) => i.resource_location)).size;
        return { total, services, subscriptions, locations };
    };

    if (isLoading) return <LoaderComponent />;

    if (error)
        return (
            <div className="text-red-500 p-4 bg-red-50 rounded-lg border border-red-200">
                <h3 className="font-semibold">Error al cargar datos</h3>
                <p className="text-sm mt-1">No se pudieron obtener los datos de facturación</p>
            </div>
        );

    if (!data || !Array.isArray(data) || !data.length)
        return (
            <div className="text-gray-500 p-8 text-center rounded-lg">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">No hay datos disponibles</h3>
                <p>No se encontraron datos de facturación para el período seleccionado</p>
            </div>
        );

    const metrics = calculateMetrics(data);
    console.log(metrics);

    return (
        <div className="w-full min-w-0 px-4 py-2">
            <div className="grid grid-cols-1 py-5 md:grid-cols-3 gap-6">
                <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Costo Acumulado</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    $ {metrics.total < 0.01 ? metrics.total.toPrecision(2) : metrics.total.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                                </p>
                                <p className="text-xs text-muted-foreground">Período seleccionado</p>
                            </div>
                            <DollarSign className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Categorías de Servicio</p>
                                <p className="text-2xl font-bold text-purple-600">{metrics.services}</p>
                                <p className="text-xs text-muted-foreground">Con costos registrados</p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-purple-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-cyan-500">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Ubicaciones</p>
                                <p className="text-2xl font-bold text-cyan-600">{metrics.locations}</p>
                                <p className="text-xs text-muted-foreground">Diferentes ubicaciones con datos</p>
                            </div>
                            <Calendar className="h-8 w-8 text-cyan-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-lg">
                <CardHeader className="pb-2 space-y-2">
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-blue-500" />
                        Distribucion de Costos por Categoria de Servicio
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Grafico de area apilada que muestra la evolucion temporal de los costos
                    </p>
                </CardHeader>

                <CardContent className="space-y-4">
                    <TendenciaFacturacionPagoPorUsoLineChartComponent data={data} />
                </CardContent>
            </Card>
            <Card className="mt-5">
                <CardHeader>
                    <CardTitle className="text-sm">Información del Período</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <span className="text-muted-foreground">Desde:</span>
                            <p className="font-medium">{startDate.toLocaleDateString('es-ES')}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Hasta:</span>
                            <p className="font-medium">{endDate.toLocaleDateString('es-ES')}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Ubicaciones:</span>
                            <p className="font-medium">{metrics.locations}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Categorías:</span>
                            <p className="font-medium">{metrics.services}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
