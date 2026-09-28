'use client'

import { OpenAICostOptimizationCardsComponent } from '@/components/open-ia/costo-optimizacion/foundation-models/info/COOpenAICardsComponent';
import { filterOpenAICostOptimizationData } from '@/components/open-ia/costo-optimizacion/openaiCostOptimizationMockData';

interface OpenAICostOptimizationComponentProps {
    startDate: Date;
    endDate?: Date;
}

export const OpenAICostOptimizationComponent = (_props: OpenAICostOptimizationComponentProps) => {
    const data = filterOpenAICostOptimizationData('all_projects', 'all_models');

    return (
        <div className="space-y-4 p-3">
            <OpenAICostOptimizationCardsComponent data={data} />
        </div>
    );
};