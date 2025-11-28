import React, { useState, FormEvent, useEffect, useCallback, memo } from 'react';
import { Cloud, Edit, Users, X, Plus, Trash2 } from 'lucide-react';
import { Empresa } from '@/types/db';
import { PLAN_CONFIG } from '@/lib/plans';
import { cn } from '@/lib/utils';

type CloudAccount = { id: string; alias: string; db: string; };

const PLAN_NAMES = Object.keys(PLAN_CONFIG);
const generateAccountId = () => 'clp-' + Date.now().toString(36);

// Componente AccountRow
interface AccountRowProps {
    account: CloudAccount;
    cloud: 'azure' | 'aws';
    onUpdate: (cloud: 'azure' | 'aws', id: string, field: keyof CloudAccount, value: string) => void;
    onRemove: (cloud: 'azure' | 'aws', id: string) => void;
}

const AccountRow = memo(({ account, cloud, onUpdate, onRemove }: AccountRowProps) => {
    const themeColor = cloud === 'azure' ? 'text-blue-700 border-blue-300' : 'text-amber-700 border-amber-300';
    
    return (
        <div className="grid grid-cols-6 gap-2 items-center py-2 border-b border-gray-200">
            <input
                type="text"
                value={account.id}
                disabled
                title="ID generado automáticamente"
                className="col-span-1 flex h-8 rounded-md border border-gray-100 bg-gray-50 px-2 text-xs text-gray-500 cursor-not-allowed"
            />
            <input
                type="text"
                value={account.alias}
                onChange={(e) => onUpdate(cloud, account.id, 'alias', e.target.value)}
                required
                placeholder="Alias (Ej: Producción)"
                className={cn("col-span-2 flex h-8 rounded-md border px-2 text-sm", themeColor)}
            />
            <input
                type="text"
                value={account.db}
                onChange={(e) => onUpdate(cloud, account.id, 'db', e.target.value)}
                required
                placeholder="Cadena de Conexión DB"
                className={cn("col-span-2 flex h-8 rounded-md border px-2 text-xs", themeColor)}
            />
            <button 
                type="button" 
                onClick={() => onRemove(cloud, account.id)}
                className="col-span-1 text-red-500 hover:text-red-700 transition flex justify-center"
            >
                <Trash2 className="h-4 w-4" />
            </button>
        </div>
    );
});

AccountRow.displayName = 'AccountRow';

// Componente AccountListEditor
interface AccountListEditorProps {
    cloud: 'azure' | 'aws';
    accounts: CloudAccount[];
    onUpdate: (cloud: 'azure' | 'aws', id: string, field: keyof CloudAccount, value: string) => void;
    onRemove: (cloud: 'azure' | 'aws', id: string) => void;
    onAdd: (cloud: 'azure' | 'aws') => void;
}

const AccountListEditor = memo(({ cloud, accounts, onUpdate, onRemove, onAdd }: AccountListEditorProps) => {
    const accentColor = cloud === 'azure' ? 'text-blue-600 hover:text-blue-800' : 'text-amber-600 hover:text-amber-800';

    return (
        <div className="space-y-2 pt-1 border-t mt-2">
            <button 
                type="button" 
                onClick={() => onAdd(cloud)} 
                className={cn("flex items-center text-sm font-medium transition", accentColor)}
            >
                <Plus className="h-4 w-4 mr-1" /> Añadir Cuenta {cloud.toUpperCase()}
            </button>
            {accounts.map(acc => (
                <AccountRow 
                    key={acc.id} 
                    account={acc} 
                    cloud={cloud}
                    onUpdate={onUpdate}
                    onRemove={onRemove}
                />
            ))}
        </div>
    );
});

AccountListEditor.displayName = 'AccountListEditor';

// Modal Principal
interface EditLicenseModalProps {
    empresa: Empresa;
    onClose: () => void;
    refreshList: () => void;
}

export default function EditLicenseModal({ empresa, onClose, refreshList }: EditLicenseModalProps) {
    const [azureAccountsData, setAzureAccountsData] = useState<CloudAccount[]>([]);
    const [awsAccountsData, setAwsAccountsData] = useState<CloudAccount[]>([]);
    const [formData, setFormData] = useState({
        name: empresa.name,
        planName: empresa.planName,
        userLimit: empresa.userLimit,
        currentUsers: empresa.currentUsers,
        is_aws: empresa.is_aws || false,
        user_db_aws: empresa.user_db_aws || '',
        is_azure: empresa.is_azure || false,
        user_db_azure: empresa.user_db_azure || '',
        is_aws_multi_tenant: empresa.is_aws_multi_tenant || false,
        is_azure_multi_tenant: empresa.is_azure_multi_tenant || false,
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
                is_aws_multi_tenant: empresa.is_aws_multi_tenant || false,
                is_azure_multi_tenant: empresa.is_azure_multi_tenant || false,
            });
            
            // Cargar las cuentas existentes
            setAzureAccountsData(empresa.azure_accounts || []);
            setAwsAccountsData(empresa.aws_accounts || []);
            
            setMessage('');
        }
    }, [empresa]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

        setFormData(prev => {
            const newState = {
                ...prev,
                [name]: type === 'checkbox' ? checked : value,
            };

            if (name === 'planName') {
                newState.userLimit = PLAN_CONFIG[value as keyof typeof PLAN_CONFIG]?.userLimit || prev.userLimit;
            }

            // Limpiar datos cuando se desactiva AWS
            if (name === 'is_aws' && !checked) {
                newState.user_db_aws = '';
                newState.is_aws_multi_tenant = false;
                setAwsAccountsData([]);
            }

            // Limpiar datos cuando se desactiva Azure
            if (name === 'is_azure' && !checked) {
                newState.user_db_azure = '';
                newState.is_azure_multi_tenant = false;
                setAzureAccountsData([]);
            }

            // Limpiar arrays cuando se desactiva multi-tenant
            if (name === 'is_azure_multi_tenant' && !checked) {
                setAzureAccountsData([]);
            }
            if (name === 'is_aws_multi_tenant' && !checked) {
                setAwsAccountsData([]);
            }

            return newState;
        });
    };

    const handleAddAccount = useCallback((cloud: 'azure' | 'aws') => {
        const newAccount: CloudAccount = {
            id: generateAccountId(),
            alias: `Nueva Cuenta ${cloud.toUpperCase()}`,
            db: '',
        };
        const setter = cloud === 'azure' ? setAzureAccountsData : setAwsAccountsData;
        setter(prev => [...prev, newAccount]);
    }, []);

    const handleUpdateAccount = useCallback((cloud: 'azure' | 'aws', id: string, field: keyof CloudAccount, value: string) => {
        const setter = cloud === 'azure' ? setAzureAccountsData : setAwsAccountsData;
        setter(prev => prev.map(acc => 
            acc.id === id ? { ...acc, [field]: value } : acc
        ));
    }, []);
    
    const handleRemoveAccount = useCallback((cloud: 'azure' | 'aws', id: string) => {
        const setter = cloud === 'azure' ? setAzureAccountsData : setAwsAccountsData;
        setter(prev => prev.filter(acc => acc.id !== id));
    }, []);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        // Validaciones
        if (!formData.name || !formData.planName) {
            setMessage('Error: Faltan campos esenciales (Nombre o Plan).');
            setLoading(false);
            return;
        }

        if (!formData.is_aws_multi_tenant && formData.is_aws && !formData.user_db_aws) {
            setMessage('Error: El Nombre DB AWS es requerido si el acceso AWS está activado.');
            setLoading(false);
            return;
        }

        if (!formData.is_azure_multi_tenant && formData.is_azure && !formData.user_db_azure) {
            setMessage('Error: El Nombre DB Azure es requerido si el acceso Azure está activado.');
            setLoading(false);
            return;
        }

        if (formData.is_azure_multi_tenant && azureAccountsData.length === 0) {
            setMessage('Error: Si marca Multi-Tenant Azure, debe agregar al menos una cuenta.');
            setLoading(false);
            return;
        }

        if (formData.is_aws_multi_tenant && awsAccountsData.length === 0) {
            setMessage('Error: Si marca Multi-Tenant AWS, debe agregar al menos una cuenta.');
            setLoading(false);
            return;
        }

        if (formData.userLimit !== undefined && formData.userLimit < currentUsers) {
            setMessage(`Error: El nuevo límite (${formData.userLimit}) no puede ser menor a los usuarios activos (${currentUsers}).`);
            setLoading(false);
            return;
        }

        // Preparar cuentas finales
        const finalAzureAccounts = formData.is_azure_multi_tenant 
            ? azureAccountsData
            : formData.is_azure ? [{ id: 'prod01', alias: formData.name + ' - Principal', db: formData.user_db_azure }] : undefined;

        const finalAwsAccounts = formData.is_aws_multi_tenant 
            ? awsAccountsData
            : formData.is_aws ? [{ id: 'aws01', alias: formData.name + ' - Principal', db: formData.user_db_aws }] : undefined;

        const updatePayload = {
            planName: formData.planName,
            userLimit: formData.userLimit,
            is_aws: formData.is_aws,
            user_db_aws: formData.is_aws && !formData.is_aws_multi_tenant ? formData.user_db_aws : null,
            is_azure: formData.is_azure,
            user_db_azure: formData.is_azure && !formData.is_azure_multi_tenant ? formData.user_db_azure : null,
            is_aws_multi_tenant: formData.is_aws_multi_tenant,
            is_azure_multi_tenant: formData.is_azure_multi_tenant,
            azure_accounts: finalAzureAccounts,
            aws_accounts: finalAwsAccounts,
        };

        try {
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
                setMessage(`✅ Éxito: ${data.message || 'Licencia actualizada correctamente.'}`);
                refreshList();
                setTimeout(onClose, 1500);
            } else {
                setMessage(`Error: ${data.message || 'Error desconocido del servidor.'}`);
            }
        } catch (err) {
            setMessage('Error de conexión con el servidor.');
        } finally {
            setLoading(false);
        }
    };

    if (!empresa) return null;

    return (
        <div
            className="fixed inset-0 z-[1050] flex justify-center items-center transition-opacity duration-300"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
        >
            <div className="relative w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
                <div className="bg-white rounded-xl shadow-2xl border">
                    <header className="flex items-center justify-between p-5 border-b bg-blue-600 rounded-t-xl text-white sticky top-0 z-10">
                        <div className="flex items-center space-x-3">
                            <Edit className="h-6 w-6" />
                            <h5 className="text-xl font-bold">Editar Licencia: {empresa.name}</h5>
                        </div>
                        <button 
                            type="button" 
                            className="text-white opacity-90 hover:opacity-100 transition p-1" 
                            onClick={onClose} 
                            disabled={loading}
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </header>

                    <div>
                        <div className="p-6 space-y-6">
                            {/* Información básica */}
                            <div className="grid grid-cols-2 gap-4 border-b pb-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-500">Empresa</label>
                                    <p className="font-bold text-gray-800">{formData.name}</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                                        <Users className="h-4 w-4" /> Usuarios
                                    </label>
                                    <p className="font-bold text-gray-800">
                                        {formData.currentUsers} / {formData.userLimit}
                                    </p>
                                </div>
                            </div>

                            {/* Plan y límite */}
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
                                            <option key={plan} value={plan}>
                                                {plan} (Límite: {PLAN_CONFIG[plan as keyof typeof PLAN_CONFIG].userLimit})
                                            </option>
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

                            {/* Configuración de Conexiones */}
                            <h6 className="text-sm font-bold text-gray-600 flex items-center space-x-2 border-t pt-4">
                                <Cloud className="h-4 w-4" /> <span>Configuración de Conexiones Maestras</span>
                            </h6>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* AWS CONFIGURATION */}
                                <div className="space-y-2 border p-3 rounded-lg">
                                    <div className="flex items-center space-x-4 mb-2">
                                        <input 
                                            type="checkbox" 
                                            name="is_aws" 
                                            id="is_aws" 
                                            checked={formData.is_aws} 
                                            onChange={handleChange} 
                                            className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500" 
                                        />
                                        <label htmlFor="is_aws" className="text-sm font-medium">Acceso AWS</label>
                                        
                                        {formData.is_aws && (
                                            <div className="flex items-center space-x-2">
                                                <input 
                                                    type="checkbox" 
                                                    name="is_aws_multi_tenant" 
                                                    id="is_aws_multi_tenant" 
                                                    checked={formData.is_aws_multi_tenant} 
                                                    onChange={handleChange} 
                                                    className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500" 
                                                />
                                                <label htmlFor="is_aws_multi_tenant" className="text-sm font-medium text-amber-700">
                                                    Multi-Tenant
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {formData.is_aws && !formData.is_aws_multi_tenant && (
                                        <div className="space-y-2 pt-1">
                                            <label htmlFor="user_db_aws" className="text-xs font-medium text-amber-700">
                                                Nombre DB AWS (Maestra/Principal)
                                            </label>
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

                                    {formData.is_aws && formData.is_aws_multi_tenant && (
                                        <AccountListEditor 
                                            cloud="aws" 
                                            accounts={awsAccountsData} 
                                            onAdd={handleAddAccount} 
                                            onUpdate={handleUpdateAccount} 
                                            onRemove={handleRemoveAccount} 
                                        />
                                    )}
                                </div>

                                {/* AZURE CONFIGURATION */}
                                <div className="space-y-2 border p-3 rounded-lg">
                                    <div className="flex items-center space-x-4 mb-2">
                                        <input 
                                            type="checkbox" 
                                            name="is_azure" 
                                            id="is_azure" 
                                            checked={formData.is_azure} 
                                            onChange={handleChange} 
                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                                        />
                                        <label htmlFor="is_azure" className="text-sm font-medium">Acceso Azure</label>

                                        {formData.is_azure && (
                                            <div className="flex items-center space-x-2">
                                                <input 
                                                    type="checkbox" 
                                                    name="is_azure_multi_tenant" 
                                                    id="is_azure_multi_tenant" 
                                                    checked={formData.is_azure_multi_tenant} 
                                                    onChange={handleChange} 
                                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                                                />
                                                <label htmlFor="is_azure_multi_tenant" className="text-sm font-medium text-blue-700">
                                                    Multi-Tenant
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {formData.is_azure && !formData.is_azure_multi_tenant && (
                                        <div className="space-y-2 pt-2">
                                            <label htmlFor="user_db_azure" className="text-xs font-medium text-blue-700">
                                                Nombre DB Azure (Maestra/Principal)
                                            </label>
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

                                    {formData.is_azure && formData.is_azure_multi_tenant && (
                                        <AccountListEditor 
                                            cloud="azure" 
                                            accounts={azureAccountsData} 
                                            onAdd={handleAddAccount} 
                                            onUpdate={handleUpdateAccount} 
                                            onRemove={handleRemoveAccount} 
                                        />
                                    )}
                                </div>
                            </div>

                            {message && (
                                <p className={`mt-3 p-2 rounded text-sm ${
                                    message.startsWith('✅') || message.startsWith('Éxito') 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-red-100 text-red-700'
                                }`}>
                                    {message}
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end space-x-3 p-4 border-t bg-gray-50 rounded-b-xl sticky bottom-0">
                            <button 
                                type="button" 
                                onClick={onClose} 
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                                disabled={loading}
                            >
                                Cancelar
                            </button>
                            <button 
                                type="button"
                                onClick={handleSubmit} 
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition" 
                                disabled={loading}
                            >
                                {loading ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}