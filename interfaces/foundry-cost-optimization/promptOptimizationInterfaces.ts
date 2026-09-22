export type PromptOptimizationViewMode = 'text' | 'ids';

export type PromptOptimizationSide = 'original' | 'optimized';

export type PromptOptimizationTarget = 'rate' | 'target_token';

export interface PromptOptimizationRequest {
    model: string;
    prompt: string;
    rate?: number;
    target_token?: number;
    use_context_level_filter: boolean;
    use_token_level_filter: boolean;
}

export interface PromptOptimizationToken {
    text: string;
    token_ids: number[];
}

export interface PromptOptimizationBreakdown {
    text: string;
    token_count: number;
    token_price: number | null;
    tokens: PromptOptimizationToken[];
}

export interface PromptOptimizationResponse {
    model: string;
    encoding_name: string;
    original_prompt: PromptOptimizationBreakdown;
    optimized_prompt: PromptOptimizationBreakdown;
    token_difference: number;
    token_difference_percentage: number;
    cost_difference_usd: number | null;
}
