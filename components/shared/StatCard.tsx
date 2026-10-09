'use client'

import { AlertTriangle, LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export type StatCardColor = 'blue' | 'amber' | 'green' | 'red' | 'purple' | 'slate';

const COLOR_STYLES: Record<StatCardColor, { border: string; icon: string }> = {
    blue: { border: 'border-l-blue-500', icon: 'bg-blue-100 text-blue-600' },
    amber: { border: 'border-l-amber-500', icon: 'bg-amber-100 text-amber-600' },
    green: { border: 'border-l-green-500', icon: 'bg-green-100 text-green-600' },
    red: { border: 'border-l-red-500', icon: 'bg-red-100 text-red-600' },
    purple: { border: 'border-l-purple-500', icon: 'bg-purple-100 text-purple-600' },
    slate: { border: 'border-l-slate-500', icon: 'bg-slate-100 text-slate-600' },
};

interface StatCardProps {
    title: string;
    value: string | number;
    unit?: string;
    icon: LucideIcon;
    description?: string;
    subtitle?: string;
    color?: StatCardColor;
    /** Muestra un aviso en vez de la descripción. */
    warning?: { title: string; text: string };
    large?: boolean;
}

/** Tarjeta de KPI compartida por las vistas de las tres nubes. */
export const StatCard = ({ title, value, unit, icon: Icon, description, subtitle, color = 'blue', warning, large = false }: StatCardProps) => {
    const style = COLOR_STYLES[color];
    return (
        <Card className={`border-l-4 shadow-sm ${style.border}`}>
            <CardContent className={large ? 'p-8' : 'p-6'}>
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <h4 className={`${large ? 'text-5xl' : 'text-3xl'} font-bold tracking-tight break-words`}>
                            {value} {unit && <span className="text-sm font-normal text-slate-400">{unit}</span>}
                        </h4>
                        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
                    </div>
                    <div className={`p-3 rounded-xl ${style.icon}`}>
                        <Icon className={large ? 'w-8 h-8' : 'w-6 h-6'} />
                    </div>
                </div>
                {warning ? (
                    <div className="flex items-start gap-2 text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/20 p-2 rounded">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold">{warning.title}</p>
                            <p className="text-[10px] mt-0.5">{warning.text}</p>
                        </div>
                    </div>
                ) : (
                    description && <p className="text-xs text-muted-foreground">{description}</p>
                )}
            </CardContent>
        </Card>
    );
};
