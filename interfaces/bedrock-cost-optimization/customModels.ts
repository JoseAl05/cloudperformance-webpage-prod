export interface CustomModelsPriceRateComparison {
  modelName: string;
  provider: string;
  estimated_cost: number;
  cost_breakdown:{
    output: number;
    input: number;
  };
  delta_pct_vs_current: number;
  missing_rates: string[];
}

export interface CustomModelsPriceRate {
  modelName: string;
  modelId: string;
  region: string;
  customModelArn: string;
  customModelName: string;
  customModelDeploymentArn: string;
  provider: string;
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
  price_comparison: CustomModelsPriceRateComparison[];
}
