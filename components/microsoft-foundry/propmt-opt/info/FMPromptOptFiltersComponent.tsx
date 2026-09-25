'use client'

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Filter, Layers3 } from 'lucide-react';

interface FMPromptOptFiltersComponentProps {
    useContextLevelFilter: boolean;
    onUseContextLevelFilterChange: (value: boolean) => void;
    useTokenLevelFilter: boolean;
    onUseTokenLevelFilterChange: (value: boolean) => void;
    disabled: boolean;
}

export const FMPromptOptFiltersComponent = ({
    useContextLevelFilter,
    onUseContextLevelFilterChange,
    useTokenLevelFilter,
    onUseTokenLevelFilterChange,
    disabled
}: FMPromptOptFiltersComponentProps) => {
    const filters = [
        {
            id: 'prompt-opt-context-level-filter',
            icon: Layers3,
            label: 'Filtro a nivel de contexto',
            hint: 'Descarta los fragmentos menos relevantes antes de comprimir el prompt.',
            checked: useContextLevelFilter,
            onCheckedChange: onUseContextLevelFilterChange
        },
        {
            id: 'prompt-opt-token-level-filter',
            icon: Filter,
            label: 'Filtro a nivel de token',
            hint: 'Elimina los tokens con menor aporte dentro de cada fragmento.',
            checked: useTokenLevelFilter,
            onCheckedChange: onUseTokenLevelFilterChange
        }
    ];

    return (
        <div className="flex w-full min-w-0 flex-col gap-2">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {filters.map((filter) => {
                    const Icon = filter.icon;
                    return (
                        <div
                            key={filter.id}
                            className="flex items-start justify-between gap-3 rounded-lg border border-slate-200 p-3 dark:border-slate-800"
                        >
                            <div className="flex min-w-0 flex-col gap-1">
                                <Label htmlFor={filter.id}>
                                    <Icon className="h-4 w-4" />
                                    {filter.label}
                                </Label>
                                <span className="text-[11px] text-muted-foreground">
                                    {filter.hint}
                                </span>
                            </div>
                            <Switch
                                id={filter.id}
                                checked={filter.checked}
                                onCheckedChange={filter.onCheckedChange}
                                disabled={disabled}
                            />
                        </div>
                    );
                })}
            </div>
            <span className="text-[11px] text-muted-foreground">
                Los filtros son excluyentes: al activar uno, el otro se desactiva automáticamente.
            </span>
        </div>
    );
};
