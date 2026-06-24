const NEXT_INTERNAL_API = "/api/alertas/bridge/budget";

export interface CostCenter {
    id_centro_costo: number;
    nombre_centro: string;
}

export interface BudgetAlertConfig {
    _id?: string; 
    cloud_provider: string;
    cost_center_id: number;
    client_id: string;
    is_active: boolean;
    alert_emails: string[];
    warning_percentages: number[];
}

export interface BudgetServiceResponse {
    configuraciones: BudgetAlertConfig[];
    centros_costo: CostCenter[];
    presupuestos_asignados: Record<number, number>;
}

export interface SaveConfigResponse {
    mensaje: string;
    id?: string;
}

export interface BudgetStatus {
    id_regla: string;
    cost_center_id: number;
    tipo_alerta: 'PRECAUCION' | 'EXCEDIDO' | 'OPTIMO';
    timestamp: string | null;
    porcentaje_actual?: number;
}

export const budgetAlertsService = {
    getConfigByClient: async (provider: string) => {
        const res = await fetch(`${NEXT_INTERNAL_API}/configurar?cloud=${provider}`);
        if (!res.ok) throw new Error("Error fetching config");
        return res.json();
    },
    saveConfig: async (config: BudgetAlertConfig, provider: string) => {
        const isUpdate = Boolean(config._id);
        const url = isUpdate ? `${NEXT_INTERNAL_API}/configurar/${config._id}?cloud=${provider}` : `${NEXT_INTERNAL_API}/configurar?cloud=${provider}`;
        const res = await fetch(url, {
            method: isUpdate ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(config)
        });
        if (!res.ok) throw new Error("Error saving config");
        return res.json();
    },
    getHistory: async (id_alerta: string, provider: string) => {
        const res = await fetch(`${NEXT_INTERNAL_API}/historial/${id_alerta}?cloud=${provider}`);
        if (!res.ok) throw new Error("Error fetching history");
        return res.json();
    },
    getStatus: async (provider: string): Promise<{ data: BudgetStatus[] }> => {
        const response = await fetch(`${NEXT_INTERNAL_API}/estado?cloud=${provider}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store' 
        });

        if (!response.ok) {
            throw new Error('Error al obtener el estado global de presupuestos');
        }

        return response.json();
    }
};