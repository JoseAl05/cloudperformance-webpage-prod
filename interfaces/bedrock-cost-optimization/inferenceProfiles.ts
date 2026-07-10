export interface InferenceProfilesPriceRate {
  modelName: string;
  modelId: string;
  region: string;
  inferenceProfileId: string;
  inferenceProfileName: string;
  rates: {
    input: {
      price_per_1k_tokens: string;
      price_per_1m_tokens: string;
    };
    output: {
      price_per_1k_tokens: string;
      price_per_1m_tokens: string;
    };
    cache_read: {
      price_per_1k_tokens: string;
      price_per_1m_tokens: string;
    };
    cache_write: {
      price_per_1k_tokens: string;
      price_per_1m_tokens: string;
    };
  };
  tokens:{
    input: number;
    output: number;
  };
  cost: number;
  cost_breakdown: {
    input:number;
    output: number;
  }
}
