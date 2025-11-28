import React, { useState, FormEvent, useCallback, memo } from 'react';
import { useSession } from '@/hooks/useSession';
import { PLAN_CONFIG } from '@/lib/plans';
import { cn } from '@/lib/utils';
import { Briefcase, Cloud, Plus, Trash2 } from 'lucide-react'; 

type CloudAccount = { id: string; alias: string; db: string; };
const generateAccountId = () => 'clp-' + Date.now().toString(36);
const PLAN_NAMES = Object.keys(PLAN_CONFIG);

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
            <button type="button" onClick={() => onAdd(cloud)} className={cn("flex items-center text-sm font-medium transition", accentColor)}>
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

export default function LicenseCreationForm({ refreshLicenseStatus }) {
    const { user: userLoggedIn } = useSession();
    
    if (userLoggedIn?.role !== 'admin_global') {
        return null;
    }
    const [azureAccountsData, setAzureAccountsData] = useState<CloudAccount[]>([]);
    const [awsAccountsData, setAwsAccountsData] = useState<CloudAccount[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        planName: PLAN_NAMES[0] || '',
        userLimit: PLAN_CONFIG[PLAN_NAMES[0]]?.userLimit || 1, 
        user_db_aws: '',
        user_db_azure: '',
        is_aws: true,
        is_azure: true,
        is_aws_multi_tenant: false,
        is_azure_multi_tenant: false,
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        
        const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        
        setFormData(prev => {
            const newState = { ...prev, [name]: finalValue };

            // Lógica para actualizar límite de usuarios
            if (name === 'planName' && typeof finalValue === 'string' && PLAN_CONFIG[finalValue]) {
                 newState.userLimit = PLAN_CONFIG[finalValue].userLimit;
            }
            
            // Lógica para limpiar cadenas y arrays al desactivar acceso o multi-tenant
            if (name === 'is_aws' && !finalValue) {
                newState.user_db_aws = '';
                newState.is_aws_multi_tenant = false;
                setAwsAccountsData([]);
            }
            if (name === 'is_azure' && !finalValue) {
                newState.user_db_azure = '';
                newState.is_azure_multi_tenant = false;
                setAzureAccountsData([]);
            }
            
            if (name === 'is_azure_multi_tenant' && !finalValue) setAzureAccountsData([]);
            if (name === 'is_aws_multi_tenant' && !finalValue) setAwsAccountsData([]);

            return newState;
        });
    };
    
    const handleAddAccount = useCallback((cloud: 'azure' | 'aws') => {
        const newAccount: CloudAccount = {
            id: generateAccountId(), // ID único generado
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

        if (!formData.name || !formData.planName) {
            setMessage('Error: Por favor, ingrese un nombre de empresa y seleccione un plan.');
            setLoading(false);
            return;
        }

        if (!formData.is_aws_multi_tenant && formData.is_aws && !formData.user_db_aws) {
            setMessage('Error: El Nombre DB AWS es requerido si el acceso AWS está activado.');
            setLoading(false); return;
        }
        if (!formData.is_azure_multi_tenant && formData.is_azure && !formData.user_db_azure) {
            setMessage('Error: El Nombre DB Azure es requerido si el acceso Azure está activado.');
            setLoading(false); return;
        }
        
        if (formData.is_azure_multi_tenant && azureAccountsData.length === 0) {
            setMessage('Error: Si marca Multi-Tenant Azure, debe agregar al menos una cuenta.');
            setLoading(false); return;
        }
        if (formData.is_aws_multi_tenant && awsAccountsData.length === 0) {
            setMessage('Error: Si marca Multi-Tenant AWS, debe agregar al menos una cuenta.');
            setLoading(false); return;
        }

        const finalAzureAccounts = formData.is_azure_multi_tenant 
            ? azureAccountsData
            : formData.is_azure ? [{ id: 'prod01', alias: formData.name + ' - Principal', db: formData.user_db_azure }] : undefined;

        const finalAwsAccounts = formData.is_aws_multi_tenant 
            ? awsAccountsData
            : formData.is_aws ? [{ id: 'aws01', alias: formData.name + ' - Principal', db: formData.user_db_aws }] : undefined;


        try {
            const response = await fetch('/api/perfilamiento/empresas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    planName: formData.planName,
                    userLimit: formData.userLimit,
                    user_db_aws: formData.is_aws && !formData.is_aws_multi_tenant ? formData.user_db_aws : null,
                    is_aws: formData.is_aws,
                    user_db_azure: formData.is_azure && !formData.is_azure_multi_tenant ? formData.user_db_azure : null,
                    is_azure: formData.is_azure,
                    is_aws_multi_tenant: formData.is_aws_multi_tenant,
                    is_azure_multi_tenant: formData.is_azure_multi_tenant,
                    azure_accounts: finalAzureAccounts, 
                    aws_accounts: finalAwsAccounts,
                }),
                credentials: 'include',
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(`Éxito: ${data.message} Límite asignado: ${data.userLimit}.`);

                // Resetear el formulario y vaciar arrays
                setFormData(prev => ({ 
                    name: '', 
                    planName: PLAN_NAMES[0] || '', 
                    userLimit: PLAN_CONFIG[PLAN_NAMES[0]]?.userLimit || 1, 
                    is_aws: true, 
                    is_azure: true, 
                    user_db_aws: '', 
                    user_db_azure: '',
                    is_aws_multi_tenant: false, 
                    is_azure_multi_tenant: false, 
                }));
                setAzureAccountsData([]);
                setAwsAccountsData([]);
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
            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2 border-b pb-3 mb-3">
                <Briefcase className="h-5 w-5 text-blue-600" />
                Creación de Nueva Licencia
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Nombre de la Empresa</label>
                    <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Ej: NUEVO_CLIENTE" />
                </div>
                <div className="space-y-2">
                    <label htmlFor="planName" className="text-sm font-medium">Plan Contratado</label>
                    <select name="planName" id="planName" value={formData.planName} onChange={handleChange} required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                        {PLAN_NAMES.map(plan => (<option key={plan} value={plan}>{plan} (Límite: {PLAN_CONFIG[plan].userLimit})</option>))}
                    </select>
                </div>
                 <div className="space-y-2">
                    <label htmlFor="userLimit" className="text-sm font-medium">Límite de Usuarios (Automático)</label>
                    <input
                        type="number"
                        name="userLimit"
                        id="userLimit"
                        value={formData.userLimit}
                        onChange={handleChange}
                        disabled
                        className="flex h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm"
                    />
                </div>
            </div>

            <h6 className="text-sm font-bold text-gray-600 flex items-center space-x-2 border-t pt-4">
                <Cloud className="h-4 w-4" /> <span>Configuración de Conexiones Maestras</span>
            </h6>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="space-y-2 border p-3 rounded-lg">
                    <div className="flex items-center space-x-4 mb-2">
                        <input type="checkbox" name="is_aws" id="is_aws" checked={formData.is_aws} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500" />
                        <label htmlFor="is_aws" className="text-sm font-medium">Acceso AWS</label>
                        
                        {formData.is_aws && (
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" name="is_aws_multi_tenant" id="is_aws_multi_tenant" checked={formData.is_aws_multi_tenant} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500" />
                                <label htmlFor="is_aws_multi_tenant" className="text-sm font-medium text-amber-700">Multi-Tenant</label>
                            </div>
                        )}
                    </div>
                    
                    {formData.is_aws && !formData.is_aws_multi_tenant && (
                        <div className="space-y-2 pt-1">
                            <label htmlFor="user_db_aws" className="text-xs font-medium text-amber-700">Nombre DB AWS (Maestra/Principal)</label>
                            <input type="text" name="user_db_aws" id="user_db_aws" value={formData.user_db_aws} onChange={handleChange} required={formData.is_aws} className="flex h-10 w-full rounded-md border border-amber-300 bg-white px-3 py-2 text-sm" placeholder="Ej: UC_Christus_Cloud_Performance_AWS" />
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

                <div className="space-y-2 border p-3 rounded-lg">
                     <div className="flex items-center space-x-4 mb-2">
                        <input type="checkbox" name="is_azure" id="is_azure" checked={formData.is_azure} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <label htmlFor="is_azure" className="text-sm font-medium">Acceso Azure</label>

                        {formData.is_azure && (
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" name="is_azure_multi_tenant" id="is_azure_multi_tenant" checked={formData.is_azure_multi_tenant} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                <label htmlFor="is_azure_multi_tenant" className="text-sm font-medium text-blue-700">Multi-Tenant</label>
                            </div>
                        )}
                    </div>
                    
                    {formData.is_azure && !formData.is_azure_multi_tenant && (
                        <div className="space-y-2 pt-2">
                            <label htmlFor="user_db_azure" className="text-xs font-medium text-blue-700">Nombre DB Azure (Maestra/Principal)</label>
                            <input type="text" name="user_db_azure" id="user_db_azure" value={formData.user_db_azure} onChange={handleChange} required={formData.is_azure} className="flex h-10 w-full rounded-md border border-blue-300 bg-white px-3 py-2 text-sm" placeholder="Ej: Cloud_Performance_Azure" />
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

            <div className="pt-4 border-t">
                <button type="submit" className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition" disabled={loading}>
                    {loading ? 'Creando Licencia...' : 'Crear Licencia y Límite'}
                </button>
            </div>

            {message && <p className={`mt-3 p-2 rounded text-sm ${message.startsWith('Éxito') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</p>}
        </form>
    );
}