import { createColumns } from '@/components/data-table/columns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTableGrouping } from '@/components/data-table/data-table-grouping';
import { IntraCloudBillingByDimension } from '@/interfaces/vista-intracloud/billing/intraCloudBillingInterfaces';
import { getIntraCloudBillingColumns } from '@/components/comp-cloud/intracloud/billing/table/IntraCloudBillingColumns';
import { BarChart3 } from 'lucide-react';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { IntraCloudBillingDimSelectionComponent } from '@/components/comp-cloud/intracloud/billing/table/IntraCloudBillingDimSelectionComponent';
import { ReqPayload } from '@/components/comp-cloud/intracloud/IntraCloudConfigComponent';
import { LoaderComponent } from '@/components/general_aws/LoaderComponent';

interface IntraCloudBillingTableProps {
    data: IntraCloudBillingByDimension[];
    dimension: string;
    setDimension: Dispatch<SetStateAction<string>>;
    payload: ReqPayload;
    isLoading: boolean;
}

export const IntraCloudBillingTable = ({ data, dimension, setDimension, payload, isLoading }: IntraCloudBillingTableProps) => {

    const aggregatedData = useMemo(() => {
        if (!dimension || !data.length) return [];

        const dimensionMap = new Map<string, Record<string, number>>();

        data.forEach(tenant => {
            tenant.billing_data.forEach(item => {
                const dimensionValue = (item[dimension.toLowerCase() as keyof typeof item] as string) || '-';
                if (!dimensionMap.has(dimensionValue)) {
                    dimensionMap.set(dimensionValue, {});
                }

                const current = dimensionMap.get(dimensionValue)!;
                current[tenant.tenant_id] = (current[tenant.tenant_id] || 0) + (item.cost_in_usd_sum || 0);
            });
        });

        return Array.from(dimensionMap.entries()).map(([dimensionValue, costs]) => ({
            dimension_value: dimensionValue,
            ...costs
        }))
    }, [data, dimension]);

    const columns = createColumns(getIntraCloudBillingColumns(data));

    return (
        <Card className="w-full overflow-hidden">
            <CardHeader className="border-b bg-muted/10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <BarChart3 className="h-5 w-5 text-emerald-500" />
                            Análisis por Dimensión
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                            Comparación de costos entre tenants agrupados por dimensión seleccionada.
                        </p>
                    </div>
                    <IntraCloudBillingDimSelectionComponent
                        dimension={dimension}
                        setDimension={setDimension}
                        payload={payload}
                    />
                </div>
            </CardHeader>
            <CardContent className="p-0">
                {
                    isLoading ? (
                        <LoaderComponent />
                    ) : dimension && aggregatedData.length > 0 ? (
                        <div className="p-4">
                            <DataTableGrouping
                                columns={columns}
                                data={aggregatedData}
                                filterColumn="dimension_value"
                                filterPlaceholder="Buscar por dimensión..."
                                enableGrouping={false}
                                pageSizeGroups={10}
                                pageSizeItems={10}
                            />
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 py-16">
                            {!dimension ? 'Selecciona una dimensión para analizar los costos.' : 'No hay datos disponibles para la dimensión seleccionada.'}
                        </div>
                )}
                {aggregatedData.length > 0 && (
                    <div className="border-t bg-muted/50 px-6 py-3">
                        <div className="flex items-center justify-between">
                            <div className="text-xs text-muted-foreground">
                                Mostrando {aggregatedData.length} registros encontrados
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};