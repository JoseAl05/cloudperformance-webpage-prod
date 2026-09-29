'use client'

import { useCallback, useMemo, useState } from 'react';
import useSWRMutation from 'swr/mutation';
import { MessageCard } from '@/components/azure/cards/MessageCards';
import { LoaderComponent } from '@/components/general_azure/LoaderComponent';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { formatInteger } from '@/lib/azureFoundryFormatters';
import { BMPromptOptInputComponent } from '@/components/amazon-bedrock/prompt-opt/info/BMPromptOptInputComponent';
import { BMPromptOptComparisonComponent } from '@/components/amazon-bedrock/prompt-opt/info/BMPromptOptComparisonComponent';
import { PROMPT_OPT_DEFAULT_RATE } from '@/components/amazon-bedrock/prompt-opt/info/BMPromptOptTargetComponent';
import {
    PromptOptimizationRequest,
    PromptOptimizationResponse,
    PromptOptimizationTarget
} from '@/interfaces/foundry-cost-optimization/promptOptimizationInterfaces';

const OPTIMIZE_PROMPT_URL = '/api/aws/bridge/bedrock/prompt_optimization/optimize_prompt';

const DEFAULT_ERROR_MESSAGE = 'Ocurrió un problema al optimizar el prompt. Intenta nuevamente en unos segundos.';

const optimizePromptFetcher = async (
    url: string,
    { arg }: { arg: PromptOptimizationRequest }
): Promise<PromptOptimizationResponse> => {
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(arg)
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
        const detail = (payload as { detail?: unknown } | null)?.detail;
        throw new Error(typeof detail === 'string' ? detail : DEFAULT_ERROR_MESSAGE);
    }

    return payload as PromptOptimizationResponse;
};

interface AppliedSettings {
    model: string;
    target: PromptOptimizationTarget;
    rate: number;
    maxTokens: number | null;
    useContextLevelFilter: boolean;
    useTokenLevelFilter: boolean;
}

export const BMPromptOptComponent = () => {
    const [prompt, setPrompt] = useState('');
    const [foundryModel, setFoundryModel] = useState('');
    const [target, setTarget] = useState<PromptOptimizationTarget>('rate');
    const [rate, setRate] = useState(PROMPT_OPT_DEFAULT_RATE);
    const [maxTokens, setMaxTokens] = useState('');
    const [useContextLevelFilter, setUseContextLevelFilter] = useState(true);
    const [appliedSettings, setAppliedSettings] = useState<AppliedSettings | null>(null);

    const {
        data: result,
        error,
        isMutating: isOptimizing,
        trigger,
        reset
    } = useSWRMutation<PromptOptimizationResponse, Error, string, PromptOptimizationRequest>(
        OPTIMIZE_PROMPT_URL,
        optimizePromptFetcher
    );

    const errorMessage = error ? error.message || DEFAULT_ERROR_MESSAGE : null;

    const parsedMaxTokens = Number.parseInt(maxTokens, 10);
    const hasValidMaxTokens = Number.isInteger(parsedMaxTokens) && parsedMaxTokens > 0;
    const isTargetReady = target === 'rate' || hasValidMaxTokens;
    const useTokenLevelFilter = !useContextLevelFilter;

    const onUseTokenLevelFilterChange = useCallback((value: boolean) => {
        setUseContextLevelFilter(!value);
    }, []);

    const optimizePrompt = useCallback(async () => {
        if (!foundryModel || !prompt.trim() || !isTargetReady) return;

        const body: PromptOptimizationRequest = {
            model: foundryModel,
            prompt,
            use_context_level_filter: useContextLevelFilter,
            use_token_level_filter: useTokenLevelFilter,
            ...(target === 'rate'
                ? { rate: rate / 100 }
                : { target_token: parsedMaxTokens })
        };

        const optimized = await trigger(body, { throwOnError: false });

        setAppliedSettings(optimized
            ? {
                model: foundryModel,
                target,
                rate,
                maxTokens: target === 'target_token' ? parsedMaxTokens : null,
                useContextLevelFilter,
                useTokenLevelFilter
            }
            : null);
    }, [
        prompt,
        foundryModel,
        target,
        rate,
        parsedMaxTokens,
        isTargetReady,
        useContextLevelFilter,
        useTokenLevelFilter,
        trigger
    ]);

    const clearPrompt = useCallback(() => {
        setPrompt('');
        setAppliedSettings(null);
        reset();
    }, [reset]);

    const isResultStale = useMemo(() => {
        if (!result || !appliedSettings) return false;
        if (appliedSettings.model !== foundryModel) return true;
        if (appliedSettings.useContextLevelFilter !== useContextLevelFilter) return true;
        if (appliedSettings.target !== target) return true;
        if (target === 'rate') return appliedSettings.rate !== rate;
        return appliedSettings.maxTokens !== (hasValidMaxTokens ? parsedMaxTokens : null);
    }, [
        result,
        appliedSettings,
        foundryModel,
        target,
        rate,
        hasValidMaxTokens,
        parsedMaxTokens,
        useContextLevelFilter
    ]);

    const appliedSummary = useMemo(() => {
        if (!appliedSettings) return '';
        const targetSummary = appliedSettings.target === 'rate'
            ? `${appliedSettings.rate}% objetivo`
            : `${formatInteger(appliedSettings.maxTokens ?? 0)} tokens como máximo`;
        const filtersSummary = appliedSettings.useContextLevelFilter
            ? 'filtro a nivel de contexto'
            : 'filtro a nivel de token';
        return `${appliedSettings.model} · ${targetSummary} · ${filtersSummary}`;
    }, [appliedSettings]);

    return (
        <div className="flex w-full min-w-0 flex-col gap-5">
            <BMPromptOptInputComponent
                prompt={prompt}
                setPrompt={setPrompt}
                foundryModel={foundryModel}
                setFoundryModel={setFoundryModel}
                target={target}
                setTarget={setTarget}
                rate={rate}
                setRate={setRate}
                maxTokens={maxTokens}
                setMaxTokens={setMaxTokens}
                useContextLevelFilter={useContextLevelFilter}
                onUseContextLevelFilterChange={setUseContextLevelFilter}
                useTokenLevelFilter={useTokenLevelFilter}
                onUseTokenLevelFilterChange={onUseTokenLevelFilterChange}
                isTargetReady={isTargetReady}
                onOptimize={optimizePrompt}
                onClear={clearPrompt}
                isOptimizing={isOptimizing}
            />

            {isOptimizing && <LoaderComponent size="large" />}

            {!isOptimizing && errorMessage && (
                <MessageCard
                    icon={AlertCircle}
                    title="Error al optimizar el prompt"
                    description={errorMessage}
                    tone="error"
                />
            )}

            {!isOptimizing && !errorMessage && result && (
                <>
                    {isResultStale && (
                        <MessageCard
                            icon={RefreshCw}
                            title="El resultado corresponde a otra configuración"
                            description={`Los datos de abajo se calcularon con ${appliedSummary}. Vuelve a optimizar para aplicar la configuración actual.`}
                            tone="warn"
                        />
                    )}
                    <BMPromptOptComparisonComponent data={result} />
                </>
            )}

            {!isOptimizing && !errorMessage && !result && (
                <div className="w-full min-w-0 px-4 py-8">
                    <div className="text-center text-gray-500 text-lg font-medium">
                        Escribe un prompt y optimizalo para ver la comparación de tokens.
                    </div>
                </div>
            )}
        </div>
    );
};
