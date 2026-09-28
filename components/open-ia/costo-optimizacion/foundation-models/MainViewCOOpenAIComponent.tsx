'use client'

import { FiltersComponent } from '@/components/general_azure/filters/FiltersComponent';
import { OpenAICostOptimizationComponent } from '@/components/open-ia/costo-optimizacion/foundation-models/COOpenAIComponent';
import { ChartLine } from 'lucide-react';

export const MainViewOpenAICostOptimizationFoundationModelsComponent = () => {
    return (
        <div className="w-full min-w-0 space-y-4">
            <div className="mb-8">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                            <ChartLine className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Costo y Optimización OpenIA</h1>
                    </div>
                </div>
            </div>
            <FiltersComponent Component={OpenAICostOptimizationComponent} dateFilter />
        </div>
    );
};