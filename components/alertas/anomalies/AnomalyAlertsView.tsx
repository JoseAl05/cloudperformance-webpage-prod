'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from '@/hooks/useSession';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { Database } from 'lucide-react';
import { SearchableSelect } from '@/components/general_alertas/SearchableSelect';

import { alertasAnomaliasService } from '@/lib/alertasAnomaliasService';
import { alertasService } from '@/lib/alertasService'; 
import { AnomalyConfig } from '@/interfaces/anomalias';

import { AnomalyKpiCards } from './cards/AnomalyKpiCards';
import { AnomalyAlertForm } from './form/AnomalyAlertForm';
import { AnomalyAlertsTable } from './table/AnomalyAlertsTable';

export interface CloudProject {
    id: string;
    name?: string;
}

interface UserProfile {
    email: string;
    client: string;
    [key: string]: unknown;
}

interface CloudAccount { 
    id: string; 
    alias: string; 
    db: string; 
}

interface AnomalyAlertsViewProps {
    provider: string; 
}

export default function AnomalyAlertsView({ provider }: AnomalyAlertsViewProps) {
    const { connectionData, swapContextToken } = useFeatureAccess();
    const { user: userLoggedIn } = useSession();
    
    const [currentUserEmail, setCurrentUserEmail] = useState<string | undefined>(undefined); 
    const [companyEmails, setCompanyEmails] = useState<string[]>([]);
    
    const [selectedDbAccount, setSelectedDbAccount] = useState('');
    const [projectOptions, setProjectOptions] = useState<CloudProject[]>([]);
    const [serviceOptions, setServiceOptions] = useState<string[]>([]);
    const [isLoadingProjects, setIsLoadingProjects] = useState<boolean>(false);
    const [isLoadingServices, setIsLoadingServices] = useState<boolean>(false);

    const [alertas, setAlertas] = useState<AnomalyConfig[]>([]);
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [alertEmails, setAlertEmails] = useState<string[]>([]);
    
    const [formData, setFormData] = useState<AnomalyConfig>({ 
        cloud_provider: provider, 
        project_id: 'all_projects', 
        service: 'all_services', 
        sensitivity_percentage: 20, 
        comparison_period: '7d',    
        alert_emails: [] 
    });

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
                const usuariosRegistrados: UserProfile[] = await response.json();
                const miCorreo = userLoggedIn.email;
                const miEmpresa = userLoggedIn.client; 
                const correosDeMiEmpresa = usuariosRegistrados
                    .filter((u: UserProfile) => u.client === miEmpresa && u.email !== miCorreo)
                    .map((u: UserProfile) => u.email);
                setCurrentUserEmail(miCorreo);
                setCompanyEmails(correosDeMiEmpresa);
            } catch (error) {
                console.error("Error al cargar equipo:", error);
            }
        };
        cargarDatosEquipo();
    }, [userLoggedIn]);

    const cargarAlertas = useCallback(async () => {
        setIsFetching(true);
        try {
            const data: AnomalyConfig[] = await alertasAnomaliasService.getAlertasAnomalias(provider);
            setAlertas(data);
        } catch (error) {
            console.error("Error cargando alertas de anomalías:", error);
        } finally {
            setIsFetching(false);
        }
    }, [provider]);

    const cargarProyectos = useCallback(async () => {
        setIsLoadingProjects(true);
        try {
            const data = await alertasService.getProyectos(provider);
            const typedProjects: CloudProject[] = data.map((item: unknown) => {
                if (typeof item === 'string') return { id: item, name: item };
                return item as CloudProject;
            });
            setProjectOptions(typedProjects);
            setFormData(prev => ({ ...prev, project_id: 'all_projects' }));
        } catch (error) {
            console.error("Error al cargar proyectos:", error);
        } finally {
            setIsLoadingProjects(false);
        }
    }, [provider]);

    useEffect(() => {
        if (connectionData?.client) {
            cargarAlertas();
            cargarProyectos();
        }
    }, [connectionData?.client, cargarAlertas, cargarProyectos]);

    useEffect(() => {
        const fetchServices = async () => {
            if (formData.project_id === 'all_projects') {
                setServiceOptions([]);
                return;
            }
            setIsLoadingServices(true);
            try {
                const data: string[] = await alertasService.getServicios(provider, formData.project_id);
                setServiceOptions(data);
                if (!data.includes(formData.service) && formData.service !== 'all_services') {
                    setFormData(prev => ({ ...prev, service: 'all_services' }));
                }
            } catch (error) {
                console.error("Error al cargar servicios:", error);
                setServiceOptions([]);
            } finally {
                setIsLoadingServices(false);
            }
        };
        if (connectionData?.client) {
            fetchServices();
        }
    }, [provider, formData.project_id, formData.service, connectionData?.client]);

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
            setTimeout(() => {
                cargarAlertas();
                cargarProyectos();
            }, 200);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (alertEmails.length === 0) {
            alert("Por favor ingresa al menos un correo de destino.");
            return;
        }
        setLoading(true);
        try {
            if (editingId) {
                await alertasAnomaliasService.actualizarAlertaAnomalia(editingId, { ...formData, alert_emails: alertEmails }, provider);
            } else {
                await alertasAnomaliasService.crearAlertaAnomalia({ ...formData, alert_emails: alertEmails }, provider);
            }
            setEditingId(null);
            setFormData(prev => ({ ...prev, service: 'all_services', project_id: 'all_projects' }));
            setAlertEmails([]);
            cargarAlertas(); 
        } catch (error) {
            console.error("Error al procesar la solicitud de anomalía:", error);
            alert("Error al procesar la solicitud.");
        } finally {
            setLoading(false);
        }
    };

    const dbOptions = activeAccountsList.map(acc => ({ label: acc.alias, value: acc.id }));

    return (
        <div className="flex flex-col gap-6 pb-10">
            <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Database className="w-5 h-5" /></div>
                    <div className="hidden sm:block">
                        <h3 className="text-sm font-bold text-gray-800">Entorno de Monitoreo</h3>
                        <p className="text-xs text-gray-500">Selecciona el tenant a analizar</p>
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

            <AnomalyKpiCards 
                totalReglas={alertas.length} 
                anomaliasDetectadas={alertas.filter(a => a.status === 'spike_detected').length}
            />
            
            <AnomalyAlertForm 
                formData={formData} setFormData={setFormData}
                projectOptions={projectOptions} serviceOptions={serviceOptions}
                isLoadingProjects={isLoadingProjects} isLoadingServices={isLoadingServices}
                alertEmails={alertEmails} setAlertEmails={setAlertEmails}
                handleSubmit={handleSubmit} editingId={editingId} 
                cancelEdit={() => setEditingId(null)} 
                loading={loading}
                currentUserEmail={currentUserEmail}
                companyEmails={companyEmails}
            />
            
            <AnomalyAlertsTable 
                alertas={alertas} isFetching={isFetching}
                handleEditClick={(alerta) => {
                    setEditingId(alerta._id || null);
                    setFormData({ ...alerta });
                    setAlertEmails(alerta.alert_emails || []);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
                handleDelete={async (id) => {
                    if(confirm("¿Eliminar detector?")) {
                        setIsDeleting(id);
                        await alertasAnomaliasService.eliminarAlertaAnomalia(id, provider);
                        cargarAlertas();
                        setIsDeleting(null);
                    }
                }}
                isDeleting={isDeleting}
            />
        </div>
    );
}