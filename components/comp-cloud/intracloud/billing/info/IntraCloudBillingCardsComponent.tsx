import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { IntraCloudBilling } from '@/interfaces/vista-intracloud/billing/intraCloudBillingInterfaces';
import { formatMetric } from '@/lib/metricUtils';
import { cn } from '@/lib/utils';
import { Badge, Clock, DollarSign, LucideIcon } from 'lucide-react'; // Agregué LucideIcon al import
import { useMemo } from 'react';

interface IntraCloudBillingCardsComponentProps {
    data: IntraCloudBilling[];
}

interface StatCardProps {
    title: string;
    value: string | number;
    description: string;
    subDescription?: string;
    icon: LucideIcon;
    actionLabel?: string;
    dateLabel?: string;
    onViewList?: () => void;
}

const gridColsMap: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4"
};

const StatCard = ({ title, value, description, subDescription, icon: Icon, actionLabel, dateLabel }: StatCardProps) => {
    return (
        <Card className='border-l-4 shadow-sm hover:shadow-md transition-all duration-200 border-l-blue-500 flex flex-col justify-between group relative'>
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
                        <h4 className="text-3xl font-bold tracking-tight">${value}</h4>
                    </div>
                    <div className='p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 transition-opacity duration-200'>
                        <Icon className='w-6 h-6 text-blue-600 dark:text-blue-400' />
                    </div>
                </div>

                <div className="space-y-2 mb-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {description}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        {subDescription}
                    </p>
                    {actionLabel && (
                        <Badge variant="outline" className='text-[10px] font-semibold bg-blue-100 text-blue-700 border-blue-200'>
                            {actionLabel}
                        </Badge>
                    )}
                </div>
                {dateLabel && (
                    <div className="pt-3 mt-2 border-t flex items-center gap-2 text-[10px] text-muted-foreground font-medium">
                        <Clock className="w-3 h-3" />
                        <span>{dateLabel}</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export const IntraCloudBillingCardsComponent = ({ data }: IntraCloudBillingCardsComponentProps) => {

    const acumulatedCostByTenant = useMemo(() => {
        if (!data || !Array.isArray(data)) return [];

        return data.map((tenant, index) => {
            const billingData = tenant.billing_data || [];

            if (billingData.length === 0) {
                return {
                    cardTitle: `Costo real acumulado ${tenant.tenant_alias || `Tenant ${index + 1}`}`,
                    acc_cost: 0,
                    dateLabel: "Sin datos registrados",
                    tenant_id: tenant.tenant_id,
                    description: 'Costo Retail: $0',
                    subDescription: ''
                };
            }

            let totalCost = 0;
            let totalRetailCost = 0;
            let minTime = Infinity;
            let maxTime = -Infinity;

            // Iteración única para sumar costos y encontrar rango de fechas
            billingData.forEach((item) => {
                const cost = Number(item.cost_in_usd_sum) || 0;
                const retail = Number(item.payg_cost_in_usd_sum) || 0;
                // Asumimos que start_date viene en formato ISO string compatible
                const time = new Date(item.start_date).getTime();

                totalCost += cost;
                totalRetailCost += retail;

                if (time < minTime) minTime = time;
                if (time > maxTime) maxTime = time;
            });

            const firstDate = minTime !== Infinity ? new Date(minTime) : null;
            const lastDate = maxTime !== -Infinity ? new Date(maxTime) : null;

            const dateRangeText = firstDate && lastDate
                ? `${firstDate.toISOString().split('T')[0]} - ${lastDate.toISOString().split('T')[0]}`
                : "Sin rango de fechas";

            return {
                cardTitle: `Costo real acumulado Tenant ${tenant.tenant_alias || `Tenant ${index + 1}`}`,
                acc_cost: totalCost,
                tenant_id: tenant.tenant_id,
                description: `Costo Retail: $${formatMetric(totalRetailCost)}`,
                subDescription: `Costo acumulado calculado en el rango ${dateRangeText}`,
                dateLabel: dateRangeText
            };
        });
    }, [data]);

    const colsClass = gridColsMap[data.length] ?? "grid-cols-4";

    return (
        <div className={cn("grid gap-4", colsClass)}>
            {acumulatedCostByTenant.map((tenant) => (
                <StatCard
                    key={tenant.tenant_id}
                    title={tenant.cardTitle}
                    value={formatMetric(tenant.acc_cost)}
                    description={tenant.description}
                    subDescription={tenant.subDescription}
                    icon={DollarSign}
                />
            ))}
        </div>
    );
}