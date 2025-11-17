import React, { useState, FormEvent, useEffect } from 'react';
import { Empresa } from '@/types/db'; 
import { PLAN_CONFIG } from '@/lib/plans'; 
import { cn } from '@/lib/utils';
import { Cloud, Edit, Users, X } from 'lucide-react';

// Obtener los nombres de los planes disponibles
const PLAN_NAMES = Object.keys(PLAN_CONFIG);

interface EditLicenseModalProps {
    empresa: Empresa;
    onClose: () => void;
    refreshList: () => void; 
}

export default function EditLicenseModal({ empresa, onClose, refreshList }: EditLicenseModalProps) {
    const [formData, setFormData] = useState({
        name: empresa.name,
        planName: empresa.planName,
        userLimit: empresa.userLimit,
        currentUsers: empresa.currentUsers,
        is_aws: empresa.is_aws || false,
        user_db_aws: empresa.user_db_aws || '',
        is_azure: empresa.is_azure || false,
        user_db_azure: empresa.user_db_azure || '',
    });
    
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const currentUsers = empresa?.currentUsers ?? 0;
    
    useEffect(() => {
        if (empresa) {
            setFormData({
                name: empresa.name,
                planName: empresa.planName,
                userLimit: empresa.userLimit,
                currentUsers: empresa.currentUsers, 
                is_aws: empresa.is_aws || false,
                user_db_aws: empresa.user_db_aws || '',
                is_azure: empresa.is_azure || false,
                user_db_azure: empresa.user_db_azure || '',
            });
            setMessage('');
        }
    }, [empresa]);

    if (!empresa) return null;
    
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
            
            if (name === 'planName') {
                newState.userLimit = PLAN_CONFIG[value as keyof typeof PLAN_CONFIG]?.userLimit || prev.userLimit;
            }

            return newState;
        });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        if (!formData.name || !formData.planName) {
            setMessage('Error: Faltan campos esenciales (Nombre o Plan).');
            setLoading(false); return;
        }
        
        if (formData.is_aws && (!formData.user_db_aws || formData.user_db_aws.trim() === '')) {
            setMessage('Error: El Nombre DB AWS es requerido si el acceso AWS está activado.');
            setLoading(false); return;
        }
        if (formData.is_azure && (!formData.user_db_azure || formData.user_db_azure.trim() === '')) {
            setMessage('Error: El Nombre DB Azure es requerido si el acceso Azure está activado.');
            setLoading(false); return;
        }
        
        if (formData.userLimit !== undefined && formData.userLimit < currentUsers) {
            setMessage(`Error: El nuevo límite (${formData.userLimit}) no puede ser menor a los usuarios activos (${currentUsers}).`);
            setLoading(false);
            return;
        }

        const updatePayload = {
            planName: formData.planName,
            userLimit: formData.userLimit,
            is_aws: formData.is_aws,
            user_db_aws: formData.is_aws ? formData.user_db_aws : null,
            is_azure: formData.is_azure,
            user_db_azure: formData.is_azure ? formData.user_db_azure : null,
        };


        try {
            //Llamada a la API PUT /api/perfilamiento/empresas/[id]
            const response = await fetch(`/api/perfilamiento/empresas/${empresa._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatePayload),
                credentials: 'include',
            });

            let data: any = {};
            try {
                if (response.headers.get('content-length') !== '0') {
                    data = await response.json(); 
                }
            } catch (jsonError) {
                if (response.ok) {
                    data = { message: "Actualización exitosa (Respuesta del servidor OK)." };
                } else {
                    data = { message: 'Error desconocido del servidor.' };
                }
            }

            if (response.ok) {
                setMessage(`Éxito: ${data.message}`);
                refreshList(); 
                setTimeout(onClose, 1000); 
            } else {
                setMessage(`Error: ${data.message || 'Error desconocido del servidor.'}`);
            }
        } catch (err) {
        } finally {
            setLoading(false);
        }
    };

    return (
        <div 
            className="fixed inset-0 z-[1050] flex justify-center items-center transition-opacity duration-300"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }} 
        >
            <div className="relative w-full max-w-2xl mx-4 transform transition-all duration-300 scale-100">
                <div className="bg-white rounded-xl shadow-2xl border">
                    
                    <header className="flex items-center justify-between p-5 border-b bg-blue-600 rounded-t-xl text-white">
                        <div className="flex items-center space-x-3">
                            <Edit className="h-6 w-6" /> 
                            <h5 className="text-xl font-bold">Editar Licencia: {empresa.name}</h5>
                        </div>
                        <button type="button" className="text-white opacity-90 hover:opacity-100 transition p-1" onClick={onClose} disabled={loading}>
                            <X className="h-6 w-6" />
                        </button>
                    </header>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="p-6 space-y-6">
                            
                            <div className="grid grid-cols-2 gap-4 border-b pb-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-500">Empresa</label>
                                    <p className="font-bold text-gray-800">{formData.name}</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                                        <Users className="h-4 w-4"/> Usuarios
                                    </label>
                                    <p className="font-bold text-gray-800">
                                        {formData.currentUsers} / {formData.userLimit}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
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
                                            <option key={plan} value={plan}>{plan} </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-500">Límite de Usuarios</label>
                                    <div className="flex h-10 w-full rounded-md border border-input bg-gray-100 px-3 py-2 text-sm items-center">
                                        {formData.userLimit}
                                    </div>
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
                                                required={formData.is_aws}
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
                                                required={formData.is_azure}
                                                className="flex h-10 w-full rounded-md border border-blue-300 bg-white px-3 py-2 text-sm"
                                                placeholder="Ej: Cloud_Performance_Azure"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {message && <p className={`mt-3 p-2 rounded text-sm ${message.startsWith('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</p>}
                        </div>
                        
                        <div className="flex justify-end space-x-3 p-4 border-t bg-gray-50 rounded-b-xl">
                            <button type="button" onClick={onClose} className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 transition">
                                Cancelar
                            </button>
                            <button type="submit" className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition" disabled={loading}>
                                {loading ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}