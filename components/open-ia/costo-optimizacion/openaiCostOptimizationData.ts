export interface OpenAICostOptimizationLineItem {
    line_item: string;
    metric_type: string;
    amount_value: number;
    quantity: number;
    quantity_unit: string;
    rate: number;
    amount_currency?: string;
}

export interface OpenAIModelProfile {
    stars: number;
    tier: string;
    description: string;
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
    cost_breakdown?: Record<string, number>;
    model_profile?: OpenAIModelProfile;
    mode?: string | null;
    max_input_tokens?: number | null;
    max_output_tokens?: number | null;
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
    model_profile: OpenAIModelProfile;
    tokens: Record<string, number>;
    cost_breakdown: Record<string, number>;
    total_cost: number;
    total_billing_cost: number;
    billing_cost_breakdown: Record<string, number>;
    billing_quantity_breakdown: Record<string, number>;
    catalog_rates: Record<string, unknown>;
    billing_rates: Record<string, unknown>;
    line_items: OpenAICostOptimizationLineItem[];
    price_comparison: OpenAICostOptimizationCandidate[];
}

interface OpenAICostOptimizationApiLineItem {
    line_item?: string | null;
    metric_type?: string | null;
    amount_currency?: string | null;
    amount_value?: unknown;
    quantity?: unknown;
    quantity_unit?: string | null;
    rate?: unknown;
}

interface OpenAICostOptimizationApiCandidate {
    model_name?: string | null;
    provider?: string | null;
    estimated_cost?: unknown;
    delta_pct?: unknown;
    confidence?: unknown;
    tier?: string | null;
    description?: string | null;
    rates?: Record<string, unknown> | null;
    cost_breakdown?: Record<string, unknown> | null;
    model_profile?: Partial<OpenAIModelProfile> | null;
    mode?: string | null;
    max_input_tokens?: unknown;
    max_output_tokens?: unknown;
}

export interface OpenAICostOptimizationApiModel {
    project_id?: string | null;
    project_name?: string | null;
    model_name?: string | null;
    provider?: string | null;
    model_version?: string | null;
    period_label?: string | null;
    retrieved_at?: string | null;
    start_time?: unknown;
    end_time?: unknown;
    start_time_date?: string | null;
    end_time_date?: string | null;
    model_profile?: Partial<OpenAIModelProfile> | null;
    tokens?: Record<string, unknown> | null;
    cost_breakdown?: Record<string, unknown> | null;
    total_cost?: unknown;
    billing_cost_breakdown?: Record<string, unknown> | null;
    billing_quantity_breakdown?: Record<string, unknown> | null;
    total_billing_cost?: unknown;
    catalog_rates?: Record<string, unknown> | null;
    billing_rates?: Record<string, unknown> | null;
    line_items?: OpenAICostOptimizationApiLineItem[] | null;
    price_comparison?: OpenAICostOptimizationApiCandidate[] | null;
}

const DEFAULT_PROFILE: OpenAIModelProfile = {
    stars: 3,
    tier: 'Estandar',
    description: 'Cargas de trabajo generales y procesamiento de texto balanceado.',
};

const METRIC_LABELS: Record<string, string> = {
    input: 'Entrada',
    input_cached: 'Entrada cache',
    cached_input: 'Entrada cache',
    output: 'Salida',
    input_audio: 'Entrada audio',
    output_audio: 'Salida audio',
    input_image: 'Entrada imagen',
    output_image: 'Salida imagen',
    other: 'Otro',
};

const toNumber = (value: unknown, fallback = 0) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
};

const toNumberRecord = (record?: Record<string, unknown> | null) => {
    if (!record) return {};

    return Object.fromEntries(
        Object.entries(record)
            .map(([key, value]) => [key, toNumber(value)] as const)
            .filter(([, value]) => Number.isFinite(value))
    );
};

const withCachedInputAlias = (record: Record<string, number>) => {
    const normalized = { ...record };
    if (normalized.input_cached !== undefined && normalized.cached_input === undefined) {
        normalized.cached_input = normalized.input_cached;
    }
    if (normalized.cached_input !== undefined && normalized.input_cached === undefined) {
        normalized.input_cached = normalized.cached_input;
    }
    return normalized;
};

const normalizeProfile = (
    profile?: Partial<OpenAIModelProfile> | null,
    fallback?: Partial<OpenAIModelProfile> | null
): OpenAIModelProfile => ({
    stars: Math.min(5, Math.max(0, Math.round(toNumber(profile?.stars ?? fallback?.stars, DEFAULT_PROFILE.stars)))),
    tier: String(profile?.tier ?? fallback?.tier ?? DEFAULT_PROFILE.tier),
    description: String(profile?.description ?? fallback?.description ?? DEFAULT_PROFILE.description),
});

const normalizeMetricLabel = (metric?: string | null) => {
    const key = String(metric || 'other').trim();
    return METRIC_LABELS[key] || key;
};

const normalizeLineItem = (line: OpenAICostOptimizationApiLineItem, index: number): OpenAICostOptimizationLineItem => {
    const amount = toNumber(line.amount_value);
    const quantity = toNumber(line.quantity);

    return {
        line_item: String(line.line_item || `line-item-${index}`),
        metric_type: normalizeMetricLabel(line.metric_type),
        amount_currency: line.amount_currency ? String(line.amount_currency) : undefined,
        amount_value: amount,
        quantity,
        quantity_unit: String(line.quantity_unit || 'tokens'),
        rate: toNumber(line.rate, quantity > 0 ? amount / quantity : 0),
    };
};

const normalizeCandidate = (
    candidate: OpenAICostOptimizationApiCandidate,
    currentCost: number
): OpenAICostOptimizationCandidate => {
    const estimatedCost = toNumber(candidate.estimated_cost);
    const deltaPct = candidate.delta_pct === null || candidate.delta_pct === undefined
        ? (currentCost > 0 ? ((estimatedCost - currentCost) / currentCost) * 100 : 0)
        : toNumber(candidate.delta_pct);
    const profile = normalizeProfile(candidate.model_profile, {
        tier: candidate.tier || undefined,
        description: candidate.description || undefined,
    });

    return {
        model_name: String(candidate.model_name || 'unknown'),
        provider: String(candidate.provider || 'OpenAI'),
        estimated_cost: estimatedCost,
        delta_pct: deltaPct,
        confidence: toNumber(candidate.confidence),
        tier: profile.tier,
        description: String(candidate.description || profile.description),
        rates: toNumberRecord(candidate.rates),
        cost_breakdown: toNumberRecord(candidate.cost_breakdown),
        model_profile: profile,
        mode: candidate.mode ?? null,
        max_input_tokens: candidate.max_input_tokens === null || candidate.max_input_tokens === undefined ? null : toNumber(candidate.max_input_tokens),
        max_output_tokens: candidate.max_output_tokens === null || candidate.max_output_tokens === undefined ? null : toNumber(candidate.max_output_tokens),
    };
};

export const normalizeOpenAICostOptimizationData = (
    data: OpenAICostOptimizationApiModel[]
): OpenAICostOptimizationModel[] => data.map((item) => {
    const modelName = String(item.model_name || 'unknown');
    const totalCost = toNumber(item.total_cost);
    const totalBillingCost = toNumber(item.total_billing_cost, totalCost);

    return {
        project_id: String(item.project_id || 'unknown_project'),
        project_name: String(item.project_name || 'Sin proyecto'),
        model_name: modelName,
        provider: String(item.provider || 'OpenAI'),
        model_version: String(item.model_version || modelName),
        period_label: String(item.period_label || ''),
        retrieved_at: String(item.retrieved_at || ''),
        start_time: toNumber(item.start_time),
        end_time: toNumber(item.end_time),
        start_time_date: String(item.start_time_date || ''),
        end_time_date: String(item.end_time_date || ''),
        model_profile: normalizeProfile(item.model_profile),
        tokens: withCachedInputAlias(toNumberRecord(item.tokens)),
        cost_breakdown: withCachedInputAlias(toNumberRecord(item.cost_breakdown)),
        total_cost: totalCost || totalBillingCost,
        total_billing_cost: totalBillingCost,
        billing_cost_breakdown: withCachedInputAlias(toNumberRecord(item.billing_cost_breakdown)),
        billing_quantity_breakdown: withCachedInputAlias(toNumberRecord(item.billing_quantity_breakdown)),
        catalog_rates: item.catalog_rates || {},
        billing_rates: item.billing_rates || {},
        line_items: (item.line_items || []).map(normalizeLineItem),
        price_comparison: (item.price_comparison || []).map((candidate) => normalizeCandidate(candidate, totalCost || totalBillingCost)),
    };
});