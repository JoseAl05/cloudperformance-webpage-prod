'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSession } from '@/hooks/useSession';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { Database } from 'lucide-react';
import { SearchableSelect } from '@/components/general_alertas/SearchableSelect';
import { LoaderComponent } from '@/components/general_alertas/LoaderComponent';

import { budgetAlertsService, BudgetAlertConfig, CostCenter } from '@/lib/alertasBudget';
import { CostCenterBudgetForm } from './form/CostCenterBudgetForm';
import { CostCenterStatusBoard } from './status/CostCenterStatusBoard'; 

interface CloudAccount { 
    id: string; 
    alias: string; 
    db: string; 
}

interface UserProfile {
    email: string;
    client: string;
}

interface CostCenterBudgetViewProps {
    provider: string;
}

export default function CostCenterBudgetView({ provider }: CostCenterBudgetViewProps) {
    const { connectionData, swapContextToken } = useFeatureAccess();
    const { user: userLoggedIn } = useSession();
    
    const [currentUserEmail, setCurrentUserEmail] = useState<string | undefined>(undefined); 
    const [companyEmails, setCompanyEmails] = useState<string[]>([]);
    const [selectedDbAccount, setSelectedDbAccount] = useState<string>('');
    
    const [centrosCosto, setCentrosCosto] = useState<CostCenter[]>([]);
    const [configuraciones, setConfiguraciones] = useState<BudgetAlertConfig[]>([]);
    const [presupuestosMap, setPresupuestosMap] = useState<Record<number, number>>({});
    const [selectedCostCenterId, setSelectedCostCenterId] = useState<number>(0);
    
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

    const activeAccountsList: CloudAccount[] = useMemo(() => {
        if (!connectionData) return [];
        switch (provider) {
            case 'azure': return connectionData.azureAccountsList || [];
            case 'aws': return connectionData.awsAccountsList || [];
            case 'gcp': return connectionData.gcpAccountsList || [];
            default: return [];
        }
    }, [provider, connectionData]);

    useEffect(() => {
        if (activeAccountsList.length > 0 && !selectedDbAccount) {
            setSelectedDbAccount(activeAccountsList[0].id);
        }
    }, [activeAccountsList, selectedDbAccount]);

    useEffect(() => {
        const cargarDatosEquipo = async () => {
            if (!userLoggedIn) return; 
            try {
                const response = await fetch('/api/perfilamiento/users', { credentials: 'include' });
                if (!response.ok) throw new Error("Error al consultar la API");
                
                const usuariosRegistrados: UserProfile[] = await response.json();
                const miCorreo = userLoggedIn.email;
                const miEmpresa = userLoggedIn.client; 

                const correosDeMiEmpresa = usuariosRegistrados
                    .filter((u) => u.client === miEmpresa && u.email !== miCorreo)
                    .map((u) => u.email);

                setCurrentUserEmail(miCorreo);
                setCompanyEmails(correosDeMiEmpresa);
            } catch (error) {
                console.error("Error al cargar el equipo:", error);
            }
        };
        cargarDatosEquipo();
    }, [userLoggedIn]); 

    const cargarDatos = useCallback(async () => {
        if (!connectionData?.client) return;
        
        setIsFetching(true);
        try {
            const res = await budgetAlertsService.getConfigByClient(provider);
            setCentrosCosto(res.centros_costo || []);
            setConfiguraciones(res.configuraciones || []);
            setPresupuestosMap(res.presupuestos_asignados || {});
            
            if (res.centros_costo && res.centros_costo.length > 0 && selectedCostCenterId === 0) {
                setSelectedCostCenterId(res.centros_costo[0].id_centro_costo);
            }
        } catch (error) {
            console.error("Error cargando configuración por centro de costo:", error);
            setFeedbackMsg({ text: 'Error al cargar los datos del cliente.', type: 'error' });
        } finally {
            setIsFetching(false);
        }
    }, [provider, connectionData?.client, selectedCostCenterId]);

    useEffect(() => { 
        if (connectionData?.client) {
            cargarDatos(); 
        }
    }, [cargarDatos, connectionData?.client]);

    const handleDbChange = async (accountId: string) => {
        setSelectedDbAccount(accountId);
        const selectedAccount = activeAccountsList.find(acc => acc.id === accountId);
        
        if (selectedAccount && selectedAccount.db && connectionData) {
            await swapContextToken(
                connectionData.client,
                provider === 'azure' ? selectedAccount.db : connectionData.dbAzureName,
                provider === 'aws' ? selectedAccount.db : connectionData.dbAwsName,
                provider === 'gcp' ? selectedAccount.db : connectionData.dbGcpName
            );
            setTimeout(() => { cargarDatos(); }, 200);
        }
    };

    const currentConfig = useMemo<BudgetAlertConfig>(() => {
        const existente = configuraciones.find(c => c.cost_center_id === selectedCostCenterId);
        if (existente) return existente;
        
        return {
            cloud_provider: provider,
            cost_center_id: selectedCostCenterId,
            client_id: connectionData?.client || '',
            is_active: false,
            alert_emails: [],
            warning_percentages: [80, 90, 100]
        };
    }, [configuraciones, selectedCostCenterId, provider, connectionData?.client]);

    const handleConfigChange = (newConfig: BudgetAlertConfig) => {
        setConfiguraciones(prev => {
            const index = prev.findIndex(c => c.cost_center_id === newConfig.cost_center_id);
            if (index >= 0) {
                const next = [...prev];
                next[index] = newConfig;
                return next;
            }
            return [...prev, newConfig];
        });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (currentConfig.is_active && currentConfig.alert_emails.length === 0) {
            alert("Por favor ingresa al menos un correo de destino.");
            return;
        }

        setIsSaving(true);
        setFeedbackMsg(null);
        
        try {
            await budgetAlertsService.saveConfig(currentConfig, provider);
            setFeedbackMsg({ 
                text: currentConfig.is_active ? 'Regla guardada. Monitoreo activado.' : 'Configuración guardada. Alertas desactivadas.', 
                type: currentConfig.is_active ? 'success' : 'info' 
            });
            setTimeout(() => { setFeedbackMsg(null); }, 4000);
            
            const res = await budgetAlertsService.getConfigByClient(provider);
            setConfiguraciones(res.configuraciones || []);

        } catch (error) {
            console.error("Error al guardar la configuración de presupuesto:", error);
            setFeedbackMsg({ text: 'Error al guardar la regla. Intenta nuevamente.', type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    const dbOptions = activeAccountsList.map(acc => ({ label: acc.alias, value: acc.id }));

    return (
        <div className="flex flex-col gap-6 pb-10">
            <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-teal-50 text-teal-600 rounded-lg"><Database className="w-5 h-5" /></div>
                    <div className="hidden sm:block">
                        <h3 className="text-sm font-bold text-gray-800">Entorno Cloud</h3>
                        <p className="text-xs text-gray-500">Selecciona el tenant a monitorear</p>
                    </div>
                </div>
                <SearchableSelect 
                    value={selectedDbAccount} 
                    onChange={handleDbChange} 
                    options={dbOptions} 
                    placeholder="Selecciona cuenta..." 
                    className="w-[280px] font-bold bg-gray-50 border-gray-200 shadow-none" 
                />
            </div>

            {isFetching ? (
                <div className="flex items-center justify-center py-12">
                    <LoaderComponent text="Cargando estructura de costos y reglas..." />
                </div>
            ) : (
                <>
                    <div className="w-full mt-2">
                        <CostCenterStatusBoard 
                            provider={provider} 
                            configuraciones={configuraciones.filter(c => c.is_active)} 
                            centrosCosto={centrosCosto}
                            presupuestosMap={presupuestosMap}
                        />
                    </div>

                    <div className="border-t border-gray-200 my-4"></div>

                    <div className="w-full bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                        <div className="mb-6">
                            <h3 className="text-base font-bold text-gray-800">Añadir o Editar Regla de Monitoreo</h3>
                            <p className="text-xs text-gray-500">Configura nuevos umbrales de alerta para tus Centros de Costo.</p>
                        </div>
                        
                        <CostCenterBudgetForm 
                            config={currentConfig}
                            centrosCosto={centrosCosto}
                            selectedCostCenterId={selectedCostCenterId}
                            onCostCenterChange={setSelectedCostCenterId}
                            presupuestoActual={presupuestosMap[selectedCostCenterId] || 0}
                            setConfig={handleConfigChange}
                            handleSubmit={handleSave}
                            isSaving={isSaving}
                            currentUserEmail={currentUserEmail}
                            companyEmails={companyEmails}
                            feedbackMsg={feedbackMsg}
                        />
                    </div>
                </>
            )}
        </div>
    );
}