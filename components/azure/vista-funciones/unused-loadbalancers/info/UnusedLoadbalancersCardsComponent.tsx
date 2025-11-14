import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UnusedLb } from '@/interfaces/vista-unused-resources/unusedLbInterfaces';
import { AlertTriangle, Info, MapPin, ServerOff, Tag, Ticket, LucideIcon } from 'lucide-react';

interface UnusedLoadbalancersCardsComponentProps {
    data: UnusedLb[];
}

interface SummaryCardProps {
    label: string;
    value: string | number;
    subtext: string;
    Icon: LucideIcon;
    iconBg: string;
    iconColor: string;
    border: string;
}

const KpiCard = ({ label, value, subtext, Icon, iconBg, iconColor, border }: SummaryCardProps) => (
    <Card className={`border-l-4 ${border} group`}>
        <CardContent className='p-5 flex flex-col gap-2'>
            <div className='flex items-center justify-between'>
                <div className={`p-3 rounded-lg ${iconBg} transition-transform duration-200 group-hover:scale-105`}>
                    <Icon className={`h-6 w-6 ${iconColor}`} />
                </div>
            </div>
            <h3 className='text-sm font-medium text-muted-foreground'>
                {label}
            </h3>
            <p className='text-4xl font-extrabold tracking-tight'>
                {value}
            </p>
            <p className='text-xs text-muted-foreground'>
                {subtext}
            </p>
        </CardContent>
    </Card>
);

export const UnusedLoadbalancersCardsComponent = ({ data }: UnusedLoadbalancersCardsComponentProps) => {

    if (!data || data.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Resumen loadbalancers infrautilizados</CardTitle>
                </CardHeader>
                <CardContent className='text-sm text-muted-foreground'>
                    No hay datos para mostrar.
                </CardContent>
            </Card>
        );
    }

    console.log(data);

    // Total de LB considerados
    const totalUnused = data.length;

    // Sumar TODO lo que entrega la API
    const totals = data.reduce(
        (acc, lb) => {
            if (!lb.details) return acc;

            for (const d of lb.details) {
                acc.total_backend_instance_count += d.backend_instance_count || 0;
                acc.total_lb_rule_count += d.lb_rule_count || 0;
                acc.total_nat_rule_count += d.nat_rule_count || 0;

                // Clasificación por snapshot
                if (d.backend_instance_count === 0) {
                    acc.orphaned += 1;
                }
                if (d.lb_rule_count === 0 && d.nat_rule_count === 0) {
                    acc.inactive += 1;
                }
            }

            return acc;
        },
        {
            total_backend_instance_count: 0,
            total_lb_rule_count: 0,
            total_nat_rule_count: 0,
            orphaned: 0,
            inactive: 0,
        }
    );

    return (
        <div className='space-y-4'>
            <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'>

                <KpiCard
                    label="LBs Inutilizados (Total)"
                    value={totalUnused}
                    subtext="Recursos SKU Standard sin uso."
                    Icon={ServerOff}
                    border="border-l-red-500"
                    iconBg="bg-red-50 dark:bg-red-950/20"
                    iconColor="text-red-600 dark:text-red-400"
                />

                <KpiCard
                    label="Total loadbalancers huérfanos"
                    value={totals.orphaned}
                    subtext="Loadbalancers sin instancias asociadas."
                    Icon={AlertTriangle}
                    border="border-l-red-500"
                    iconBg="bg-red-50 dark:bg-red-950/20"
                    iconColor="text-red-600 dark:text-red-400"
                />

                <KpiCard
                    label="Total loadbalancers inactivos"
                    value={totals.inactive}
                    subtext="Loadbalancers sin reglas de tráfico."
                    Icon={Info}
                    border="border-l-amber-500"
                    iconBg="bg-amber-50 dark:bg-amber-950/20"
                    iconColor="text-amber-600 dark:text-amber-400"
                />

            </div>
        </div>
    );
};
