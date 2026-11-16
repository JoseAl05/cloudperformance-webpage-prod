import { Card, CardContent } from '@/components/ui/card';

interface BreakdownCardProps {
    title: string;
    entries: Array<[string, number]>;
    format?: (value: number) => string;
}

export const BreakdownCard = ({ title, entries, format = (value) => value.toLocaleString('es-CL') }: BreakdownCardProps) => {
    const sorted = [...entries].sort((a, b) => b[1] - a[1]);
    const max = Math.max(1, ...sorted.map(([, value]) => value));
    return (
        <Card className="border-l-4 border-l-slate-400 shadow-sm">
            <CardContent className="p-6 space-y-3">
                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                {sorted.map(([label, value]) => (
                    <div key={label} className="space-y-1">
                        <div className="flex justify-between text-xs gap-2">
                            <span className="truncate" title={label}>{label}</span>
                            <span className="font-bold whitespace-nowrap">{format(value)}</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-blue-500" style={{ width: `${(value / max) * 100}%` }} />
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};
