const NEXT_INTERNAL_API = "/api/alertas/bridge/budget"; 

export interface GlobalBudgetConfig {
    cloud_provider?: string;
    is_active: boolean;
    warning_percentages: number[];
    alert_emails: string[];
}

export interface BudgetConfigResponse {
    config: GlobalBudgetConfig;
    presupuesto_neon: number;
}

export const budgetAlertsService = {
    getConfig: async (provider: string): Promise<BudgetConfigResponse> => {
        const response = await fetch(`${NEXT_INTERNAL_API}/configurar?cloud=${provider}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Error al obtener configuración de presupuesto');
        return response.json();
    },

    saveConfig: async (config: GlobalBudgetConfig, provider: string): Promise<any> => {
        const payload = { ...config, cloud_provider: provider };
        const response = await fetch(`${NEXT_INTERNAL_API}/configurar?cloud=${provider}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error('Error al guardar configuración');
        return response.json();
    }
};