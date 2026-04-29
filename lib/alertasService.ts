import { AlertConfig } from '@/interfaces/alertas';
const NEXT_INTERNAL_API = "/api/alertas/bridge"; 

export const alertasService = {
    getAlertas: async (provider: string): Promise<AlertConfig[]> => {
        const response = await fetch(`${NEXT_INTERNAL_API}/configurar?cloud=${provider}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Error al cargar alertas');
        return await response.json();
    },
    
    crearAlerta: async (alertaData: AlertConfig): Promise<any> => {
        const response = await fetch(`${NEXT_INTERNAL_API}/configurar?cloud=${alertaData.cloud_provider}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(alertaData)
        });
        if (!response.ok) throw new Error('Error al crear alerta');
        return await response.json();
    },

    getServicios: async (provider: string, projectId: string): Promise<string[]> => {
        const response = await fetch(`${NEXT_INTERNAL_API}/servicios?cloud=${provider}&project_id=${projectId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Error al cargar servicios');
        return await response.json();
    },

    getProyectos: async (provider: string): Promise<string[]> => {
        const response = await fetch(`${NEXT_INTERNAL_API}/proyectos?cloud=${provider}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Error al cargar proyectos/suscripciones');
        return await response.json();
    },    

    actualizarAlerta: async (id: string, alertaData: AlertConfig): Promise<any> => {
        const response = await fetch(`${NEXT_INTERNAL_API}/configurar/${id}?cloud=${alertaData.cloud_provider}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(alertaData)
        });
        if (!response.ok) throw new Error('Error al actualizar alerta');
        return await response.json();
    },

    eliminarAlerta: async (id: string, provider: string): Promise<any> => {
        const response = await fetch(`${NEXT_INTERNAL_API}/configurar/${id}?cloud=${provider}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Error al eliminar alerta');
        return await response.json();
    }
   
};