export interface OpenAICostOptimizationLineItem {
    line_item: string;
    metric_type: string;
    amount_value: number;
    quantity: number;
    quantity_unit: string;
    rate: number;
}

export interface OpenAICostOptimizationCandidate {
    model_name: string;
    provider: string;
    estimated_cost: number;
    delta_pct: number;
    confidence: number;
    tier: string;
    description: string;
    rates: Record<string, number>;
}

export interface OpenAICostOptimizationModel {
    project_id: string;
    project_name: string;
    model_name: string;
    provider: string;
    model_version: string;
    period_label: string;
    retrieved_at: string;
    start_time: number;
    end_time: number;
    start_time_date: string;
    end_time_date: string;
    model_profile: { stars: number; tier: string; description: string };
    tokens: Record<string, number>;
    total_billing_cost: number;
    billing_cost_breakdown: Record<string, number>;
    line_items: OpenAICostOptimizationLineItem[];
    price_comparison: OpenAICostOptimizationCandidate[];
}

export const OPENAI_CO_PROJECTS = [
    { id: 'all_projects', name: 'Todos los proyectos' },
    { id: 'proj_XzF8fhJJaeQywT8zQgZoQDmE', name: 'Cloudperformance' },
];

export const OPENAI_CO_MODELS = [
    { id: 'all_models', name: 'Todos los modelos' },
    { id: 'gpt-4o-mini-2024-07-18', name: 'gpt-4o-mini-2024-07-18' },
];

export const OPENAI_CO_DUMMY_DATA: OpenAICostOptimizationModel[] = [
    {
        project_id: 'proj_XzF8fhJJaeQywT8zQgZoQDmE',
        project_name: 'Cloudperformance',
        model_name: 'gpt-4o-mini-2024-07-18',
        provider: 'OpenAI',
        model_version: '2024-07-18',
        period_label: '2026-09-22T00:00:00.000Z a 2026-09-23T00:00:00.000Z',
        retrieved_at: '2026-09-24T18:03:52.886749+00:00',
        start_time: 1790035200,
        end_time: 1790121600,
        start_time_date: '2026-09-22T00:00:00.000Z',
        end_time_date: '2026-09-23T00:00:00.000Z',
        model_profile: {
            stars: 2,
            tier: 'Eficiente',
            description: 'Modelo liviano y económico para tareas de texto, clasificación, extracción y automatización de alto volumen.',
        },
        tokens: {
            requests: 3,
            input: 51,
            input_cached: 0,
            output: 108,
            input_audio: 0,
            output_audio: 0,
            input_image: 0,
            output_image: 0,
        },
        total_billing_cost: 0.00002415,
        billing_cost_breakdown: {
            input: 0.00000255,
            cached_input: 0,
            output: 0.0000216,
        },
        line_items: [
            {
                line_item: 'gpt-4o-mini-2024-07-18, cached input',
                metric_type: 'Entrada caché',
                amount_value: 0,
                quantity: 0,
                quantity_unit: 'tokens',
                rate: 0.000000075,
            },
            {
                line_item: 'gpt-4o-mini-2024-07-18, input',
                metric_type: 'Entrada',
                amount_value: 0.00000255,
                quantity: 17,
                quantity_unit: 'tokens',
                rate: 0.00000015,
            },
            {
                line_item: 'gpt-4o-mini-2024-07-18, output',
                metric_type: 'Salida',
                amount_value: 0.0000216,
                quantity: 36,
                quantity_unit: 'tokens',
                rate: 0.0000006,
            },
        ],
        price_comparison: [
            {
                model_name: 'gpt-4.1-mini',
                provider: 'OpenAI',
                estimated_cost: 0.0001932,
                delta_pct: 700,
                confidence: 82,
                tier: 'Eficiente',
                description: 'Simulación con las métricas exportadas: 51 input tokens y 108 output tokens.',
                rates: { input: 0.0000004, cached_input: 0.0000001, output: 0.0000016 },
            },
            {
                model_name: 'gpt-4o',
                provider: 'OpenAI',
                estimated_cost: 0.0012075,
                delta_pct: 4900,
                confidence: 76,
                tier: 'Multimodal avanzado',
                description: 'Modelo más potente, pero más costoso para este mismo volumen de tokens.',
                rates: { input: 0.0000025, cached_input: 0.00000125, output: 0.00001 },
            },
            {
                model_name: 'gpt-4.1',
                provider: 'OpenAI',
                estimated_cost: 0.000966,
                delta_pct: 3900,
                confidence: 78,
                tier: 'Razonamiento avanzado',
                description: 'Alternativa de mayor capacidad, no optimiza costo para este caso puntual.',
                rates: { input: 0.000002, cached_input: 0.0000005, output: 0.000008 },
            },
        ],
    },
];

export const filterOpenAICostOptimizationData = (projectId: string, modelId: string) => {
    return OPENAI_CO_DUMMY_DATA.filter((item) => {
        const matchesProject = projectId === 'all_projects' || item.project_id === projectId;
        const matchesModel = modelId === 'all_models' || item.model_name === modelId;
        return matchesProject && matchesModel;
    });
};