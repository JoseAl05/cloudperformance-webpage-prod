import React, { useState, useEffect, FormEvent } from 'react';
import { UserRole } from '@/types/db'; 
import { useSession } from '@/hooks/useSession'; 
import { X, User, Briefcase } from 'lucide-react'; 
import { cn } from '@/lib/utils'; 

interface UserToEdit {
    _id: string;
    email: string;
    username: string;
    client: string;
    role: UserRole;
    is_aws: boolean;
    is_azure: boolean;
}

interface EditUserModalProps {
    user: UserToEdit | null;
    onClose: () => void;
    refreshUserList: () => void;
}

const ASSIGNABLE_ROLES: UserRole[] = ['admin_global', 'admin_empresa', 'usuario'];

export default function EditUserModal({ user, onClose, refreshUserList }: EditUserModalProps) {
    const { user: userLoggedIn } = useSession();
    
    const [formData, setFormData] = useState<Partial<UserToEdit>>({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const isGlobalAdmin = userLoggedIn?.role === 'admin_global';

    useEffect(() => {
        if (user) {
            setFormData({
                email: user.email,
                username: user.username,
                client: user.client,
                role: user.role,
                is_aws: user.is_aws,
                is_azure: user.is_azure,
            });
            setMessage('');
        }
    }, [user]);

    if (!user) return null; 

    const availableRoles = ASSIGNABLE_ROLES.filter(r => 
        isGlobalAdmin || r !== 'admin_global'
    );
    
    const canEditRole = isGlobalAdmin || user.role !== 'admin_global';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await fetch(`/api/perfilamiento/users/${user._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData), 
                credentials: 'include',
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(`Éxito: ${data.message}`);
                setTimeout(() => {
                    refreshUserList(); 
                    onClose(); 
                }, 1000);
            } else {
                setMessage(`Error al actualizar: ${data.message}`);
            }
        } catch (err) {
            setMessage('Error de conexión con el servidor.');
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
                <div className="bg-white rounded-xl shadow-2xl border border-gray-100">
                    
                    <div className="flex items-center justify-between p-5 border-b bg-blue-600 rounded-t-xl text-white">
                        <div className="flex items-center space-x-3">
                            <User className="h-6 w-6" />
                            <h5 className="text-xl font-bold">Editar Usuario: {user.username}</h5>
                        </div>
                        <button type="button" className="text-white opacity-90 hover:opacity-100 transition p-1" onClick={onClose} disabled={loading}>
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="p-6 space-y-6">
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                                    <input type="email" name="email" id="email" value={formData.email || ''} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="username" className="text-sm font-medium">Nombre de Usuario</label>
                                    <input type="text" name="username" id="username" value={formData.username || ''} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                                </div>
                            </div>

                            <h6 className="text-sm font-bold text-gray-600 flex items-center space-x-2 border-t pt-4">
                                <Briefcase className="h-4 w-4" /> <span>Permisos y Rol</span>
                            </h6>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                
                                <div className="space-y-2">
                                    <label htmlFor="client" className="text-sm font-medium">Empresa</label>
                                    <input
                                        type="text"
                                        name="client"
                                        id="client"
                                        value={formData.client || ''}
                                        onChange={handleChange}
                                        disabled={!isGlobalAdmin} 
                                        className={cn("flex h-10 w-full rounded-md border px-3 py-2 text-sm", 
                                            !isGlobalAdmin ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white border-input"
                                        )}
                                    />
                                    {!isGlobalAdmin && <p className="text-xs text-muted-foreground mt-1">Fijo para Admins de Empresa.</p>}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="role" className="text-sm font-medium">Rol</label>
                                    <select
                                        name="role"
                                        id="role"
                                        value={formData.role || ''}
                                        onChange={handleChange}
                                        className={cn("flex h-10 w-full rounded-md border px-3 py-2 text-sm", 
                                            !canEditRole && "bg-red-50 border-red-300 cursor-not-allowed"
                                        )}
                                        disabled={!canEditRole}
                                    >
                                        {availableRoles.map(r => (
                                            <option key={r} value={r}>{r.toUpperCase().replace('_', ' ')}</option>
                                        ))}
                                    </select>
                                    {!canEditRole && <p className="text-xs text-red-600 mt-1">No tienes permiso para cambiar el rol de este usuario.</p>}
                                </div>
                            </div>
                            
                            {/* PERMISOS AWS/AZURE - UNIFICADO con color azul */}
                            {/* <div className="flex items-center space-x-4 pt-2 border-b pb-4">
                                <p className="text-sm font-medium text-gray-700">Accesos:</p>
                                <div className="flex items-center space-x-2">
                                    <input type="checkbox" name="is_aws" id="is_aws_edit" checked={formData.is_aws || false} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                    <label htmlFor="is_aws_edit" className="text-sm font-medium">AWS</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input type="checkbox" name="is_azure" id="is_azure_edit" checked={formData.is_azure || false} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                    <label htmlFor="is_azure_edit" className="text-sm font-medium">Azure</label>
                                </div>
                            </div> */}

                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-medium">Nueva Contraseña</label>
                                <input type="password" name="password" id="password" onChange={handleChange} placeholder="Dejar vacío para no cambiar" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                            </div>

                            {message && <p className={cn("mt-3 p-2 rounded text-sm text-center", message.startsWith('Éxito') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')}>{message}</p>}
                        </div>
                        
                        <div className="flex justify-end space-x-3 p-4 border-t bg-gray-50 rounded-b-xl">
                            <button type="button" className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100 transition" onClick={onClose} disabled={loading}>Cerrar</button>
                            <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition" disabled={loading}>
                                {loading ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}