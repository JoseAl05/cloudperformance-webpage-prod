'use client'

import { useCallback, useEffect, useRef, useState } from 'react';
import { MessageCard } from '@/components/azure/cards/MessageCards';
import { LoaderComponent } from '@/components/general_azure/LoaderComponent';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { FMPromptOptInputComponent } from '@/components/microsoft-foundry/propmt-opt/info/FMPromptOptInputComponent';
import { FMPromptOptComparisonComponent } from '@/components/microsoft-foundry/propmt-opt/info/FMPromptOptComparisonComponent';
import { PromptOptimizationResponse } from '@/interfaces/foundry-cost-optimization/promptOptimizationInterfaces';

const OPTIMIZE_PROMPT_URL = '/api/azure/bridge/azure/foundry/prompt_optimization/optimize_prompt';

const DEFAULT_ERROR_MESSAGE = 'Ocurrió un problema al optimizar el prompt. Intentá nuevamente en unos segundos.';

export const FMPromptOptComponent = () => {
    const [prompt, setPrompt] = useState('');
    const [foundryModel, setFoundryModel] = useState('');
    const [result, setResult] = useState<PromptOptimizationResponse | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const abortRef = useRef<AbortController | null>(null);

    useEffect(() => () => abortRef.current?.abort(), []);

    const optimizePrompt = useCallback(async () => {
        if (!foundryModel || !prompt.trim()) return;

        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        setIsOptimizing(true);
        setErrorMessage(null);

        try {
            const response = await fetch(OPTIMIZE_PROMPT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ model: foundryModel, prompt }),
                signal: controller.signal
            });

            const payload = await response.json().catch(() => null);

            if (!response.ok) {
                const detail = (payload as { detail?: unknown } | null)?.detail;
                throw new Error(typeof detail === 'string' ? detail : DEFAULT_ERROR_MESSAGE);
            }

            setResult(payload as PromptOptimizationResponse);
        } catch (error) {
            if ((error as Error).name === 'AbortError') return;
            setResult(null);
            setErrorMessage((error as Error).message || DEFAULT_ERROR_MESSAGE);
        } finally {
            if (abortRef.current === controller) {
                abortRef.current = null;
                setIsOptimizing(false);
            }
        }
    }, [prompt, foundryModel]);

    const clearPrompt = useCallback(() => {
        abortRef.current?.abort();
        abortRef.current = null;
        setPrompt('');
        setResult(null);
        setErrorMessage(null);
        setIsOptimizing(false);
    }, []);

    // El modelo se puede cambiar sin volver a optimizar, así que los conteos en pantalla
    // pueden ser de otro modelo: se avisa en vez de dispararle otro run al usuario.
    const isResultStale = Boolean(result && foundryModel && result.model !== foundryModel);

    return (
        <div className="flex w-full min-w-0 flex-col gap-5">
            <FMPromptOptInputComponent
                prompt={prompt}
                setPrompt={setPrompt}
                foundryModel={foundryModel}
                setFoundryModel={setFoundryModel}
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
                            title="El resultado es de otro modelo"
                            description={`Los conteos de abajo se calcularon con "${result.model}". Vuelve a optimizar para verlos con el modelo seleccionado.`}
                            tone="warn"
                        />
                    )}
                    <FMPromptOptComparisonComponent data={result} />
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
