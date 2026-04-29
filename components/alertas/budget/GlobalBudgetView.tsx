'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from '@/hooks/useSession';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { Database, DollarSign} from 'lucide-react';
import { SearchableSelect } from '@/components/general_alertas/SearchableSelect';

import { budgetAlertsService, GlobalBudgetConfig } from '@/lib/alertasBudget';
import { GlobalBudgetForm } from './form/GlobalBudgetForm'; 

import { LoaderComponent } from '@/components/general_alertas/LoaderComponent';

interface CloudAccount { 
    id: string; 
    alias: string; 
    db: string; 
}

interface UserProfile {
    email: string;
    client: string;
    [key: string]: unknown;
}

export default function GlobalBudgetView({ provider }: { provider: string }) {
    const { connectionData, swapContextToken } = useFeatureAccess();
    const { user: userLoggedIn } = useSession();
    
    const [currentUserEmail, setCurrentUserEmail] = useState<string | undefined>(undefined); 
    const [companyEmails, setCompanyEmails] = useState<string[]>([]);
    
    const [selectedDbAccount, setSelectedDbAccount] = useState('');
    
    const [config, setConfig] = useState<GlobalBudgetConfig>({
        is_active: false,
        warning_percentages: [80, 90, 100],
        alert_emails: []
    });
    
    const [presupuestoAsignado, setPresupuestoAsignado] = useState<number>(0);
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

    const activeAccountsList: CloudAccount[] = 
        provider === 'azure' ? (connectionData?.azureAccountsList || []) :
        provider === 'aws' ? (connectionData?.awsAccountsList || []) :
        provider === 'gcp' ? (connectionData?.gcpAccountsList || []) : [];

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
                
                const usuariosRegistrados = await response.json();
                const miCorreo = userLoggedIn.email;
                const miEmpresa = userLoggedIn.client; 

                const correosDeMiEmpresa = usuariosRegistrados
                    .filter((u: UserProfile) => u.client === miEmpresa && u.email !== miCorreo)
                    .map((u: UserProfile) => u.email);

                setCurrentUserEmail(miCorreo);
                setCompanyEmails(correosDeMiEmpresa);
            } catch (error) {
                console.error("Error al cargar el equipo:", error);
            }
        };
        cargarDatosEquipo();
    }, [userLoggedIn]); 

    const cargarDatos = useCallback(async () => {
        setIsFetching(true);
        try {
            const res = await budgetAlertsService.getConfig(provider);
            setConfig(res.config);
            setPresupuestoAsignado(res.presupuesto_neon || 0);
        } catch (error) {
            console.error("Error cargando configuración global:", error);
        } finally {
            setIsFetching(false);
        }
    }, [provider]);

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

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (config.is_active && config.alert_emails.length === 0) {
            alert("Por favor ingresa al menos un correo de destino.");
            return;
        }

        setIsSaving(true);
        setFeedbackMsg(null);
        
        try {
            await budgetAlertsService.saveConfig(config, provider);
            if (config.is_active) {
                setFeedbackMsg({ text: 'Configuración actualizada. Monitoreo activado.', type: 'success' });
            } else {
                setFeedbackMsg({ text: 'Configuración guardada. Alertas desactivadas.', type: 'info' });
            }
            setTimeout(() => { setFeedbackMsg(null); }, 4000);
        } catch (error) {
            console.error("Error al guardar la configuración de presupuesto global:", error);
            alert("Error al guardar la configuración");
        } finally {
            setIsSaving(false);
        }
    };

    const dbOptions = activeAccountsList.map(acc => ({ label: acc.alias, value: acc.id }));

    const fechaActual = new Date();
    const mes = fechaActual.toLocaleString('es-CL', { month: 'long' });
    const anio = fechaActual.getFullYear();
    const periodoActual = `${mes.charAt(0).toUpperCase() + mes.slice(1)} ${anio}`; 


    return (
        <div className="flex flex-col gap-6 pb-10">
            <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-teal-50 text-teal-600 rounded-lg"><Database className="w-5 h-5" /></div>
                    <div className="hidden sm:block">
                        <h3 className="text-sm font-bold text-gray-800">Entorno Global</h3>
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
                    <LoaderComponent text="Consultando Presupuesto..." />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <p className="text-sm font-semibold text-gray-500 flex items-center gap-2">
                                        Presupuesto asignado
                                        <span className="px-2 py-0.5 bg-gray-100 border border-gray-200 text-gray-600 rounded-md text-[10px] uppercase tracking-wider font-bold">
                                            {periodoActual}
                                        </span>
                                    </p>
                                    <h3 className="text-3xl font-bold text-gray-900 mt-2">
                                        ${presupuestoAsignado.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </h3>
                                </div>
                                <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
                                    <DollarSign className="w-6 h-6" />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-medium text-gray-500 bg-gray-50 p-2 rounded-lg mt-2 w-max">
                                <Database className="w-3 h-3" /> Sincronizado desde modulo de Presupuesto.
                            </div>
                        </div>
                    </div>

                    <GlobalBudgetForm 
                        config={config}
                        setConfig={setConfig}
                        handleSubmit={handleSave}
                        isSaving={isSaving}
                        currentUserEmail={currentUserEmail}
                        companyEmails={companyEmails}
                        feedbackMsg={feedbackMsg}
                        presupuestoAsignado={presupuestoAsignado}
                    />
                </>
            )}
        </div>
    );
}