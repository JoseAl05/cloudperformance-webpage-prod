import { AnomalyConfig } from '@/interfaces/anomalias';


const NEXT_INTERNAL_API = "/api/alertas/bridge"; 

export const alertasAnomaliasService = {
    getAlertasAnomalias: async (provider: string): Promise<AnomalyConfig[]> => {
        const response = await fetch(`${NEXT_INTERNAL_API}/anomalias/configurar?cloud=${provider}`, { 
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Error al obtener alertas de anomalías');
        return response.json();
    },

    crearAlertaAnomalia: async (alerta: AnomalyConfig, provider: string): Promise<unknown> => {
        const response = await fetch(`${NEXT_INTERNAL_API}/anomalias/configurar?cloud=${provider}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(alerta)
        });
        if (!response.ok) throw new Error('Error al crear alerta de anomalía');
        return response.json();
    },

    actualizarAlertaAnomalia: async (id: string, alerta: Partial<AnomalyConfig>, provider: string): Promise<unknown> => {
        const response = await fetch(`${NEXT_INTERNAL_API}/anomalias/configurar/${id}?cloud=${provider}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(alerta)
        });
        if (!response.ok) throw new Error('Error al actualizar alerta de anomalía');
        return response.json();
    },

    eliminarAlertaAnomalia: async (id: string, provider: string): Promise<unknown> => {
        const response = await fetch(`${NEXT_INTERNAL_API}/anomalias/configurar/${id}?cloud=${provider}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Error al eliminar alerta de anomalía');
        return response.json();
    }
};