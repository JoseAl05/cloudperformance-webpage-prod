import { createColumns } from '@/components/general_aws/data-table/columns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTableGrouping } from '@/components/general_aws/data-table/data-table-grouping';
import { UnusedNatGateways } from '@/interfaces/vista-unused-resources/unusedNatGatewaysInterfaces';
// Asegúrate de importar GlobalNatStats aquí también
import { getUnusedNatGwColumns, GlobalNatStats } from '@/components/aws/vista-funciones/unused-nat-gateways/table/UnusedNatGatewaysColumns';
import { Network } from 'lucide-react';
import { useMemo } from 'react';

interface UnusedNatGatewaysTableProps {
    data: UnusedNatGateways[];
    dateFrom: string;
    dateTo: string;
}

export const UnusedNatGatewaysTable = ({ data, dateFrom, dateTo }: UnusedNatGatewaysTableProps) => {

    // --- CÁLCULO DE MÉTRICAS GLOBALES ---
    const globalStats: GlobalNatStats = useMemo(() => {
        if (!data || data.length === 0) {
            return { avgGlobalConnections: 0, totalGlobalBytes: 0 };
        }

        let totalConnectionsSum = 0;
        let totalBytesSum = 0;

        data.forEach(gw => {
            // Usamos optional chaining por si metrics_summary viene nulo
            totalConnectionsSum += gw.diagnosis?.metrics_summary?.avg_active_connections || 0;
            totalBytesSum += gw.diagnosis?.metrics_summary?.total_bytes_out || 0;
        });

        return {
            // Promedio simple de conexiones (suma / cantidad de recursos)
            avgGlobalConnections: totalConnectionsSum / data.length,
            // Total acumulado de bytes
            totalGlobalBytes: totalBytesSum
        };
    }, [data]);

    // --- PASAMOS globalStats A LAS COLUMNAS ---
    const columns = createColumns(getUnusedNatGwColumns(dateFrom, dateTo, globalStats));

    return (
        <Card>
            <CardHeader className="border-b">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Network className="h-5 w-5 text-blue-500" />
                            Nat Gateways
                        </CardTitle>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <DataTableGrouping
                    columns={columns}
                    data={data}
                    filterColumn="nat_gw_id"
                    filterPlaceholder="Buscar por ID..."
                    enableGrouping={false}
                    pageSizeItems={10}
                />
                {(!data || !Array.isArray(data) || data.length === 0) && (
                    <div className="text-center text-gray-500 py-6">
                        No hay NAT Gateways infrautilizados para mostrar.
                    </div>
                )}
                <div className="border-t bg-muted/50 px-6 py-4">
                    <div className="flex items-center justify-between">
                        {data && (
                            <div className="text-sm text-muted-foreground">
                                Mostrando {data.length} recursos encontrados
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}