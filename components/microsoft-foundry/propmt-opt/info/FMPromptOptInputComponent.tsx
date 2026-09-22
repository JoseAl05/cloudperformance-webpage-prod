'use client'

import { Dispatch, KeyboardEvent, SetStateAction, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Eraser, Layers, Loader2, Sparkles, Terminal } from 'lucide-react';
import { formatInteger } from '@/lib/azureFoundryFormatters';
import { FoundryModelsFilterComponent } from '@/components/general_azure/filters/FoundryModelsFilterComponent';
import { FMPromptOptTargetComponent } from '@/components/microsoft-foundry/propmt-opt/info/FMPromptOptTargetComponent';
import { FMPromptOptFiltersComponent } from '@/components/microsoft-foundry/propmt-opt/info/FMPromptOptFiltersComponent';
import { PromptOptimizationTarget } from '@/interfaces/foundry-cost-optimization/promptOptimizationInterfaces';

interface FMPromptOptInputComponentProps {
    prompt: string;
    setPrompt: Dispatch<SetStateAction<string>>;
    foundryModel: string;
    setFoundryModel: Dispatch<SetStateAction<string>>;
    target: PromptOptimizationTarget;
    setTarget: Dispatch<SetStateAction<PromptOptimizationTarget>>;
    rate: number;
    setRate: Dispatch<SetStateAction<number>>;
    maxTokens: string;
    setMaxTokens: Dispatch<SetStateAction<string>>;
    useContextLevelFilter: boolean;
    setUseContextLevelFilter: Dispatch<SetStateAction<boolean>>;
    useTokenLevelFilter: boolean;
    setUseTokenLevelFilter: Dispatch<SetStateAction<boolean>>;
    isTargetReady: boolean;
    onOptimize: () => void;
    onClear: () => void;
    isOptimizing: boolean;
}

export const FMPromptOptInputComponent = ({
    prompt,
    setPrompt,
    foundryModel,
    setFoundryModel,
    target,
    setTarget,
    rate,
    setRate,
    maxTokens,
    setMaxTokens,
    useContextLevelFilter,
    setUseContextLevelFilter,
    useTokenLevelFilter,
    setUseTokenLevelFilter,
    isTargetReady,
    onOptimize,
    onClear,
    isOptimizing
}: FMPromptOptInputComponentProps) => {
    const lineCount = useMemo(() => {
        if (!prompt) return 0;
        let lines = 1;
        for (let index = 0; index < prompt.length; index += 1) {
            if (prompt[index] === '\n') lines += 1;
        }
        return lines;
    }, [prompt]);

    const hasPrompt = prompt.trim().length > 0;
    const canOptimize = hasPrompt && Boolean(foundryModel) && isTargetReady && !isOptimizing;

    const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter' && canOptimize) {
            event.preventDefault();
            onOptimize();
        }
    };

    return (
        <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="flex flex-col gap-4 p-4">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-slate-100 p-2 dark:bg-slate-800">
                        <Terminal className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                            Prompt a optimizar
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                            Texto plano, JSON o cualquier otro formato. Se envía completo, sin recortes.
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <div className="flex w-full min-w-0 flex-col gap-2">
                        <Label>
                            <Layers className="h-4 w-4" />
                            Modelo
                        </Label>
                        <FoundryModelsFilterComponent
                            foundryModel={foundryModel}
                            setFoundryModel={setFoundryModel}
                        />
                        <span className="text-[11px] text-muted-foreground">
                            La tokenización depende del modelo: el mismo prompt puede dar conteos distintos.
                        </span>
                    </div>

                    <FMPromptOptTargetComponent
                        target={target}
                        setTarget={setTarget}
                        rate={rate}
                        setRate={setRate}
                        maxTokens={maxTokens}
                        setMaxTokens={setMaxTokens}
                        disabled={isOptimizing}
                    />
                </div>

                <FMPromptOptFiltersComponent
                    useContextLevelFilter={useContextLevelFilter}
                    setUseContextLevelFilter={setUseContextLevelFilter}
                    useTokenLevelFilter={useTokenLevelFilter}
                    setUseTokenLevelFilter={setUseTokenLevelFilter}
                    disabled={isOptimizing}
                />

                <Textarea
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                    onKeyDown={onKeyDown}
                    spellCheck={false}
                    placeholder={'Pega aquí el prompt completo.\n\nEjemplo: instrucciones de sistema o un payload JSON de contexto.'}
                    className="min-h-[220px] max-h-[420px] resize-y overflow-auto field-sizing-fixed font-mono text-[13px] leading-6 md:text-[13px]"
                />

                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-4">
                        <span className="text-[11px] text-muted-foreground">
                            {formatInteger(prompt.length)} caracteres
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                            {formatInteger(lineCount)} líneas
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            type="button"
                            onClick={onClear}
                            disabled={!hasPrompt || isOptimizing}
                            className="flex items-center gap-2 bg-gray-500 cursor-pointer hover:bg-gray-400 text-white"
                        >
                            <Eraser className="h-4 w-4" />
                            Limpiar
                        </Button>
                        <Button
                            type="button"
                            onClick={onOptimize}
                            disabled={!canOptimize}
                            className="flex items-center gap-2 bg-blue-700 cursor-pointer hover:bg-blue-500 text-white"
                        >
                            {isOptimizing
                                ? <Loader2 className="h-4 w-4 animate-spin" />
                                : <Sparkles className="h-4 w-4" />}
                            {isOptimizing ? 'Optimizando...' : 'Optimizar prompt'}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
