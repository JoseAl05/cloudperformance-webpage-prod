import React, { useState, FormEvent } from 'react';
import { useSession } from '@/hooks/useSession';
import { PLAN_CONFIG } from '@/lib/plans'; 
import { cn } from '@/lib/utils';
import { Cloud } from 'lucide-react'; 

// Obtener los nombres de los planes disponibles
const PLAN_NAMES = Object.keys(PLAN_CONFIG);

export default function LicenseCreationForm({ refreshLicenseStatus }) {
    const { user: userLoggedIn } = useSession();
    
    // Solo mostramos este formulario si el usuario es admin_global
    if (userLoggedIn?.role !== 'admin_global') {
        return null;
    }

    const [formData, setFormData] = useState({
        name: '', 
        planName: PLAN_NAMES[0] || '', 
        user_db_aws: '', 
        user_db_azure: '', 
        is_aws: true, 
        is_azure: true,
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

        setFormData(prev => {
            const newState = {
                ...prev,
                [name]: type === 'checkbox' ? checked : value,
            };

            if (name === 'is_aws' && !checked) newState.user_db_aws = '';
            if (name === 'is_azure' && !checked) newState.user_db_azure = '';

            return newState;
        });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        if (!formData.name || !formData.planName) {
            setMessage('Error: Por favor, ingrese un nombre de empresa y seleccione un plan.');
            setLoading(false);
            return;
        }
        
        if (formData.is_aws && !formData.user_db_aws) {
            setMessage('Error: El campo Nombre DB AWS es requerido si el acceso AWS está activado.');
            setLoading(false);
            return;
        }
        if (formData.is_azure && !formData.user_db_azure) {
            setMessage('Error: El campo Nombre DB Azure es requerido si el acceso Azure está activado.');
            setLoading(false);
            return;
        }

        try {
            // 2. LLAMADA A LA API PARA CREAR LA LICENCIA
            const response = await fetch('/api/perfilamiento/empresas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    planName: formData.planName,
                    user_db_aws: formData.is_aws ? formData.user_db_aws : null,
                    is_aws: formData.is_aws,
                    user_db_azure: formData.is_azure ? formData.user_db_azure : null,
                    is_azure: formData.is_azure,
                }),
                credentials: 'include',
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(`Éxito: ${data.message} Límite asignado: ${data.userLimit}.`);

                setFormData({ name: '', planName: PLAN_NAMES[0] || '', is_aws: true, is_azure: true, user_db_aws: '', user_db_azure: '' });
                if (refreshLicenseStatus) refreshLicenseStatus(); 
            } else {
                setMessage(`Error al crear licencia: ${data.message}`);
            }
        } catch (err) {
            setMessage('Error de conexión con el servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Nombre de la Empresa</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        placeholder="Ej: NUEVO_CLIENTE"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="planName" className="text-sm font-medium">Plan Contratado</label>
                    <select
                        name="planName"
                        id="planName"
                        value={formData.planName}
                        onChange={handleChange}
                        required
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                        {PLAN_NAMES.map(plan => (
                            <option key={plan} value={plan}>{plan} (Límite: {PLAN_CONFIG[plan].userLimit})</option>
                        ))}
                    </select>
                </div>
            </div>

            <h6 className="text-sm font-bold text-gray-600 flex items-center space-x-2 border-t pt-4">
                <Cloud className="h-4 w-4" /> <span>Configuración de Conexiones Maestras</span>
            </h6>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* AWS CONFIGURATION */}
                <div className={cn("rounded-lg p-3 border", formData.is_aws ? "border-amber-400 bg-amber-50" : "bg-gray-50")}>
                    <div className="flex items-center space-x-2 mb-3">
                        <input type="checkbox" name="is_aws" id="is_aws" checked={formData.is_aws} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <label htmlFor="is_aws" className="text-sm font-medium">Habilitar Acceso AWS</label>
                    </div>
                    
                    {formData.is_aws && (
                        <div className="space-y-2">
                            <label htmlFor="user_db_aws" className="text-xs font-medium text-amber-700">Nombre DB AWS (Requerido)</label>
                            <input
                                type="text"
                                name="user_db_aws"
                                id="user_db_aws"
                                value={formData.user_db_aws}
                                onChange={handleChange}
                                required={formData.is_aws} // Requerido si el check está activo
                                className="flex h-10 w-full rounded-md border border-amber-300 bg-white px-3 py-2 text-sm"
                                placeholder="Ej: UC_Christus_Cloud_Performance_AWS"
                            />
                        </div>
                    )}
                </div>

                {/* AZURE CONFIGURATION */}
                <div className={cn("rounded-lg p-3 border", formData.is_azure ? "border-blue-400 bg-blue-50" : "bg-gray-50")}>
                    <div className="flex items-center space-x-2 mb-3">
                        <input type="checkbox" name="is_azure" id="is_azure" checked={formData.is_azure} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <label htmlFor="is_azure" className="text-sm font-medium">Habilitar Acceso Azure</label>
                    </div>

                    {formData.is_azure && (
                        <div className="space-y-2">
                            <label htmlFor="user_db_azure" className="text-xs font-medium text-blue-700">Nombre DB Azure (Requerido)</label>
                            <input
                                type="text"
                                name="user_db_azure"
                                id="user_db_azure"
                                value={formData.user_db_azure}
                                onChange={handleChange}
                                required={formData.is_azure} // Requerido si el check está activo
                                className="flex h-10 w-full rounded-md border border-blue-300 bg-white px-3 py-2 text-sm"
                                placeholder="Ej: Cloud_Performance_Azure"
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="pt-4 border-t">
                <button type="submit" className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition" disabled={loading}>
                    {loading ? 'Creando Licencia...' : 'Crear Licencia y Límite'}
                </button>
            </div>
            
            {message && <p className={`mt-3 p-2 rounded text-sm ${message.startsWith('Éxito') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</p>}
        </form>
    );
}