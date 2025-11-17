import React, { useState, FormEvent } from 'react';
import { useSession } from '@/hooks/useSession';
import { UserRole } from '@/types/db'; 
import useSWR from 'swr'; 
import { Eye, EyeOff } from 'lucide-react'; 

interface EmpresaOption {
    _id: string;
    name: string;
    userLimit: number;
}

const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(res => res.json());


const ASSIGNABLE_ROLES: UserRole[] = ['admin_empresa', 'usuario']; 

interface CreateUserFormProps {
    refreshUserList: () => void; 
}

export default function CreateUserForm({ refreshUserList }: CreateUserFormProps) {
    const { user: userLoggedIn, refresh: refreshSession } = useSession();
    
    const clientName = userLoggedIn?.client || ''; 
    const isGlobalAdmin = userLoggedIn?.role === 'admin_global';
    const isCompanyAdmin = userLoggedIn?.role === 'admin_empresa'; 
    
    // 1. CARGA DE EMPRESAS REGISTRADAS (Solo si es Admin Global)
    const { data: empresas, isLoading: loadingEmpresas } = useSWR<EmpresaOption[]>(
        isGlobalAdmin ? '/api/perfilamiento/empresas' : null, 
        fetcher
    );

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        username: '',
        role: 'usuario' as UserRole, 
        is_aws: false,
        is_azure: false,
        client: isGlobalAdmin ? '' : clientName, 
    });
    
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    
    const [showPassword, setShowPassword] = useState(false); 

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

        // Validación: Global Admin debe haber seleccionado una empresa
        if (isGlobalAdmin && !formData.client) {
             setMessage('Error: Por favor, selecciona una empresa de la lista.');
             setLoading(false);
             return;
        }
        
        // Validación básica
        if (!formData.email || !formData.password || !formData.username) {
             setMessage('Error: Por favor, complete todos los campos requeridos.');
             setLoading(false);
             return;
        }
        
        // LÓGICA DE RESTRICCIÓN ADICIONAL:
        // Si es Admin de Empresa, forzar el rol a 'usuario' en el envío,
        // incluso si el frontend permite (o por si alguien manipula el select).
        const roleToSubmit: UserRole = isCompanyAdmin ? 'usuario' : formData.role;


        try {
            const response = await fetch('/api/perfilamiento/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    role: roleToSubmit, 
                }),
                credentials: 'include',
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(`Éxito: ${data.message}`);
                setFormData(prev => ({ 
                    ...prev, 
                    email: '', 
                    password: '', 
                    username: '',
                    client: isGlobalAdmin ? formData.client : clientName // Mantener selección si es Global
                }));
                refreshUserList(); 
                refreshSession(); 
            } else {
                const errorPrefix = response.status === 400 ? 'Error de Licencia: ' : 'Error: ';
                setMessage(errorPrefix + data.message);
            }
        } catch (err) {
            setMessage('Error de conexión con el servidor.');
        } finally {
            setLoading(false);
        }
    };

    if (!userLoggedIn || (!isCompanyAdmin && !isGlobalAdmin)) {
        return null;
    }

    // LÓGICA CLAVE: Filtrar los roles
    let rolesForSelect: UserRole[] = [];

    if (isGlobalAdmin) {
        // Admin Global puede asignar todos los roles, incluyendo admin_global
        rolesForSelect = [...ASSIGNABLE_ROLES, 'admin_global'];
    } else if (isCompanyAdmin) {
        // Admin de Empresa solo puede crear 'usuario'
        rolesForSelect = ['usuario'];
    }

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    return (
        <div className="rounded-lg border bg-white p-6 shadow-lg"> 
            <header className="mb-4 border-b pb-2">
                <h3 className="text-xl font-semibold text-gray-800">Creación de Nuevo Usuario</h3> 
                <p className="text-sm text-gray-500">Asigne roles y permisos de acceso a la nube.</p>
            </header>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    <div className="space-y-2">
                        <label htmlFor="client" className="text-sm font-medium">Empresa</label>
                        {isGlobalAdmin ? (
                            <select
                                name="client"
                                id="client"
                                value={formData.client}
                                onChange={handleChange}
                                required
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                disabled={loadingEmpresas}
                            >
                                <option value="" disabled>
                                    {loadingEmpresas ? 'Cargando empresas...' : 'Selecciona una empresa'}
                                </option>
                                {empresas?.map(empresa => (
                                    <option key={empresa._id} value={empresa.name}>
                                        {empresa.name} (Límite: {empresa.userLimit})
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input
                                type="text"
                                value={clientName}
                                disabled
                                className="flex h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500"
                            />
                        )}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="role" className="text-sm font-medium">Rol</label>
                        <select
                            name="role"
                            id="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            disabled={isCompanyAdmin} // Deshabilitar si es Admin de Empresa (el rol siempre será 'usuario')
                        >
                            {/* Si es Admin de Empresa, solo se muestra 'USUARIO' */}
                            {rolesForSelect.map(r => (
                                <option key={r} value={r}>{r.toUpperCase().replace('_', ' ')}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">Email</label>
                        <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium">Contraseña</label>
                        <div className="relative">
                            <input 
                                type={showPassword ? 'text' : 'password'} 
                                name="password" 
                                id="password" 
                                value={formData.password} 
                                onChange={handleChange} 
                                required 
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm pr-10" // Añadimos padding a la derecha
                            />
                            <button 
                                type="button" 
                                onClick={togglePasswordVisibility} 
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                                title={showPassword ? 'Ocultar Contraseña' : 'Ver Contraseña'}
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <label htmlFor="username" className="text-sm font-medium">Nombre de Usuario</label>
                        <input type="text" name="username" id="username" value={formData.username} onChange={handleChange} required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                    </div>
                    
                    {/* CAMPO 6: PERMISOS (Checkboxes) */}
                    {/* <div className="flex items-center space-x-4 pt-6">
                        <div className="flex items-center space-x-2">
                            <input type="checkbox" name="is_aws" id="is_aws" checked={formData.is_aws} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            <label htmlFor="is_aws" className="text-sm font-medium">Acceso AWS</label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input type="checkbox" name="is_azure" id="is_azure" checked={formData.is_azure} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            <label htmlFor="is_azure" className="text-sm font-medium">Acceso Azure</label>
                        </div>
                    </div> */}
                </div>

                <div className="pt-4 border-t"> 
                    <button type="submit" className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition" disabled={loading}>
                        {loading ? 'Creando...' : 'Crear Usuario'}
                    </button>
                </div>
                
                {message && <p className={`mt-3 p-2 rounded text-sm ${message.startsWith('Éxito') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</p>}
            </form>
        </div>
    );
}