import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { IntraCloudBilling } from '@/interfaces/vista-intracloud/billing/intraCloudBillingInterfaces'
import { formatMetric } from '@/lib/metricUtils';
import { cn } from '@/lib/utils';
import { Badge, Clock, DollarSign, Eye } from 'lucide-react';
import { useMemo } from 'react';

interface IntraCloudBillingCardsComponentProps {
    data: IntraCloudBilling[];
}

interface StatCardProps {
    title: string;
    value: string | number;
    description: string;
    icon: LucideIcon;
    variant?: CardVariant;
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

const StatCard = ({ title, value, description, icon: Icon, actionLabel, dateLabel }: StatCardProps) => {

    return (
        <Card className='border-l-4 shadow-sm hover:shadow-md transition-all duration-200 border-l-blue-500 flex flex-col justify-between group relative'>
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
                        <h4 className="text-3xl font-bold tracking-tight">{value}</h4>
                    </div>
                    <div className='p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 transition-opacity duration-200'>
                        <Icon className='w-6 h-6 text-blue-600 dark:text-blue-400' />
                    </div>
                </div>

                <div className="space-y-2 mb-4">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        {description}
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
            if (!tenant.billing_data || tenant.billing_data.length === 0) {
                return {
                    cardTitle: `Costo acumulado Tenant ${index + 1}`,
                    acc_cost: 0,
                    first_date: null,
                    last_date: null,
                    tenant_id: tenant.tenant_id
                };
            }

            const sortedData = [...tenant.billing_data].sort((a, b) =>
                new Date(a._id).getTime() - new Date(b._id).getTime()
            );

            const firstDate = new Date(sortedData[0]._id);
            const lastDate = new Date(sortedData[sortedData.length - 1]._id);

            const totalCost = sortedData.reduce((sum, item) => {
                return sum + (item.cost_in_usd_sum || 0);
            }, 0);

            return {
                cardTitle: `Costo acumulado Tenant ${index + 1}`,
                acc_cost: totalCost,
                first_date: firstDate,
                last_date: lastDate,
                tenant_id: tenant.tenant_id
            };
        });
    }, [data]);

    const colsClass = gridColsMap[data.length] ?? "grid-cols-4";
    return (
        <div className={cn(
            "grid gap-4",
            colsClass,
        )}>
            {
                acumulatedCostByTenant.map((tenant) => {
                    const dateRangeText = tenant.first_date && tenant.last_date
                        ? `${tenant.first_date.toLocaleDateString()} - ${tenant.last_date.toLocaleDateString()}`
                        : "Sin datos registrados";

                    return (
                        <StatCard
                            key={tenant.tenant_id}
                            title={tenant.cardTitle}
                            value={formatMetric(tenant.acc_cost)}
                            description={`Costo acumulado calculado en el rango ${dateRangeText}`}
                            icon={DollarSign}
                        />
                    );
                })
            }
        </div>
    )
}