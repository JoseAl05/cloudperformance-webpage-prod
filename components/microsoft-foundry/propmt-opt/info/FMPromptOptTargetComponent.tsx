'use client'

import { Dispatch, SetStateAction } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Hash, Percent, Target } from 'lucide-react';
import { PromptOptimizationTarget } from '@/interfaces/foundry-cost-optimization/promptOptimizationInterfaces';

export const PROMPT_OPT_RATE_MIN = 5;
export const PROMPT_OPT_RATE_MAX = 95;
export const PROMPT_OPT_RATE_STEP = 5;
export const PROMPT_OPT_DEFAULT_RATE = 50;

interface FMPromptOptTargetComponentProps {
    target: PromptOptimizationTarget;
    setTarget: Dispatch<SetStateAction<PromptOptimizationTarget>>;
    rate: number;
    setRate: Dispatch<SetStateAction<number>>;
    maxTokens: string;
    setMaxTokens: Dispatch<SetStateAction<string>>;
    disabled: boolean;
}

export const FMPromptOptTargetComponent = ({
    target,
    setTarget,
    rate,
    setRate,
    maxTokens,
    setMaxTokens,
    disabled
}: FMPromptOptTargetComponentProps) => {
    const onMaxTokensChange = (value: string) => {
        if (!/^\d*$/.test(value)) return;
        setMaxTokens(value);
    };

    return (
        <>
            <div className="flex w-full min-w-0 flex-col gap-2">
                <Label htmlFor="prompt-opt-target">
                    <Target className="h-4 w-4" />
                    Objetivo de compresión
                </Label>
                <Select
                    value={target}
                    onValueChange={(value) => setTarget(value as PromptOptimizationTarget)}
                    disabled={disabled}
                >
                    <SelectTrigger id="prompt-opt-target" className="w-full">
                        <SelectValue placeholder="Selecciona un objetivo" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="rate">Porcentaje</SelectItem>
                        <SelectItem value="target_token">Máximo de tokens</SelectItem>
                    </SelectContent>
                </Select>
                <span className="text-[11px] text-muted-foreground">
                    Define cómo se mide la meta de compresión del prompt.
                </span>
            </div>

            {target === 'rate' ? (
                <div className="flex w-full min-w-0 flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                        <Label>
                            <Percent className="h-4 w-4" />
                            Porcentaje objetivo
                        </Label>
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[12px] font-semibold tabular-nums text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                            {rate}%
                        </span>
                    </div>
                    <div className="flex h-9 items-center">
                        <Slider
                            aria-label="Porcentaje objetivo"
                            value={[rate]}
                            min={PROMPT_OPT_RATE_MIN}
                            max={PROMPT_OPT_RATE_MAX}
                            step={PROMPT_OPT_RATE_STEP}
                            onValueChange={(values) => setRate(values[0])}
                            disabled={disabled}
                        />
                    </div>
                    <span className="text-[11px] text-muted-foreground">
                        El prompt optimizado conservará alrededor del {rate}% de los tokens originales.
                    </span>
                </div>
            ) : (
                <div className="flex w-full min-w-0 flex-col gap-2">
                    <Label htmlFor="prompt-opt-max-tokens">
                        <Hash className="h-4 w-4" />
                        Máximo de tokens
                    </Label>
                    <Input
                        id="prompt-opt-max-tokens"
                        inputMode="numeric"
                        autoComplete="off"
                        placeholder="Ejemplo: 500"
                        value={maxTokens}
                        onChange={(event) => onMaxTokensChange(event.target.value)}
                        disabled={disabled}
                    />
                    <span className="text-[11px] text-muted-foreground">
                        El prompt optimizado no superará esta cantidad de tokens.
                    </span>
                </div>
            )}
        </>
    );
};
