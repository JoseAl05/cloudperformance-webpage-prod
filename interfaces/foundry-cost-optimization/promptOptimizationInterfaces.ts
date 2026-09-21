export type PromptOptimizationViewMode = 'text' | 'ids';

export type PromptOptimizationSide = 'original' | 'optimized';

export interface PromptOptimizationRequest {
    model: string;
    prompt: string;
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
