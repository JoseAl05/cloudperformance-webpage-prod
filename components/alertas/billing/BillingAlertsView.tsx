'use client';

import React, { useState, useEffect } from 'react';
import { AlertConfig } from '@/interfaces/alertas';
import { alertasService } from '@/lib/alertasService';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { Database } from 'lucide-react';
import { SearchableSelect } from '@/components/general_alertas/SearchableSelect';
import { useSession } from '@/hooks/useSession'; 

import { BillingKpiCards } from './cards/BillingKpiCards';
import { BillingAlertForm } from './form/BillingAlertForm';
import { BillingAlertsTable } from './table/BillingAlertsTable';

interface CloudAccount { 
    id: string; 
    alias: string; 
    db: string; 
}

interface UsuarioPerfil {
    client?: string;
    email: string;
    [key: string]: unknown; 
}

export default function BillingAlertsView({ provider }: { provider: string }) {
    const { connectionData, swapContextToken } = useFeatureAccess();
    const { user: userLoggedIn } = useSession(); 
    const [currentUserEmail, setCurrentUserEmail] = useState<string | undefined>(undefined); 
    const [companyEmails, setCompanyEmails] = useState<string[]>([]);
    const [alertas, setAlertas] = useState<AlertConfig[]>([]);
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    
    const [selectedDbAccount, setSelectedDbAccount] = useState('');
    const [availableProjects, setAvailableProjects] = useState<string[]>([]);
    const [isLoadingProjects, setIsLoadingProjects] = useState(false);
    const [availableServices, setAvailableServices] = useState<string[]>([]);
    const [isLoadingServices, setIsLoadingServices] = useState(false);
    
    const [alertEmails, setAlertEmails] = useState<string[]>([]);
    const [quiereAdvertencias, setQuiereAdvertencias] = useState(false);
    const [porcentajes, setPorcentajes] = useState<number[]>([80]);
    
    const [formData, setFormData] = useState<AlertConfig>({ 
        cloud_provider: provider, 
        project_id: 'all_projects', 
        service: 'all_services', 
        threshold_amount: 0, 
        currency: 'usd', 
        alert_emails: [] 
    });

    const activeAccountsList: CloudAccount[] = 
        provider === 'azure' ? (connectionData?.azureAccountsList || []) :
        provider === 'aws' ? (connectionData?.awsAccountsList || []) :
        provider === 'gcp' ? (connectionData?.gcpAccountsList || []) : [];

    useEffect(() => {
        const cargarDatosEquipo = async () => {
            if (!userLoggedIn) return; 

            try {
                const response = await fetch('/api/perfilamiento/users', {
                    credentials: 'include' 
                });

                if (!response.ok) {
                    throw new Error("Error al consultar la API de perfilamiento");
                }
                
                const usuariosRegistrados = await response.json();

                const miCorreo = userLoggedIn.email;
                const miEmpresa = userLoggedIn.client; 

                const correosDeMiEmpresa = usuariosRegistrados
                    .filter((u: UsuarioPerfil) => u.client === miEmpresa && u.email !== miCorreo)
                    .map((u: UsuarioPerfil) => u.email);

                setCurrentUserEmail(miCorreo);
                setCompanyEmails(correosDeMiEmpresa);

            } catch (error) {
                console.error("Error al cargar el equipo desde la API:", error);
            }
        };

        cargarDatosEquipo();
    }, [userLoggedIn]); 

    useEffect(() => {
        if (activeAccountsList.length > 0 && !selectedDbAccount) {
            setSelectedDbAccount(activeAccountsList[0].id);
        }
    }, [activeAccountsList, selectedDbAccount]);

    const cargarAlertas = async () => {
        setIsFetching(true);
        try {
            const data = await alertasService.getAlertas(provider);
            setAlertas(data);
        } catch (error) {
            console.error("Error cargando alertas:", error);
        } finally {
            setIsFetching(false);
        }
    };

    const cargarProyectos = async () => {
        setIsLoadingProjects(true);
        try {
            const proyectos = await alertasService.getProyectos(provider);
            setAvailableProjects(proyectos);
            setFormData(prev => ({ ...prev, project_id: 'all_projects' }));
        } catch (error) {
            console.error("Error al cargar proyectos:", error);
        } finally {
            setIsLoadingProjects(false);
        }
    };

    useEffect(() => {
        if (connectionData?.client) {
            cargarAlertas();
            cargarProyectos();
        }
    }, [connectionData?.client]);

    useEffect(() => {
        const cargarServicios = async () => {
            setIsLoadingServices(true);
            try {
                const servicios = await alertasService.getServicios(provider, formData.project_id);
                setAvailableServices(servicios);
                if (!servicios.includes(formData.service) && formData.service !== 'all_services') {
                    setFormData(prev => ({ ...prev, service: 'all_services' }));
                }
            } catch (error) {
                setAvailableServices([]);
                    console.error("Error cargando servicios:", error);
            } finally {
                setIsLoadingServices(false);
            }
        };

        if (connectionData?.client) {
            cargarServicios();
        }
    }, [formData.project_id, provider, connectionData?.client]);

    const handleDbChange = async (accountId: string) => {
        setSelectedDbAccount(accountId);
        const selectedAccount = activeAccountsList.find(acc => acc.id === accountId);
        
        if (selectedAccount && selectedAccount.db) {
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

    const togglePorcentaje = (valor: number) => {
        if (porcentajes.includes(valor)) {
            setPorcentajes(porcentajes.filter(p => p !== valor));
        } else {
            setPorcentajes([...porcentajes, valor]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (alertEmails.length === 0) {
            alert("Por favor ingresa al menos un correo de destino.");
            setLoading(false);
            return;
        }

        const finalPayload = {
            ...formData,
            alert_emails: alertEmails,
            warning_percentages: quiereAdvertencias ? porcentajes : []
        };

        try {
            if (editingId) {
                await alertasService.actualizarAlerta(editingId, finalPayload);
                setEditingId(null);
            } else {
                await alertasService.crearAlerta(finalPayload);
            }
            setFormData(prev => ({ ...prev, service: 'all_services', threshold_amount: 0 }));
            setAlertEmails([]);
            setQuiereAdvertencias(false);
            setPorcentajes([80]);
            cargarAlertas(); 
        } catch (error) {
            alert("Error al procesar la solicitud.");
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (alerta: AlertConfig) => {
        setEditingId(alerta._id || null);
        setFormData({
            cloud_provider: alerta.cloud_provider,
            project_id: alerta.project_id,
            service: alerta.service,
            threshold_amount: alerta.threshold_amount,
            currency: alerta.currency,
            alert_emails: alerta.alert_emails
        });
        setAlertEmails(alerta.alert_emails || []);
        const wp = alerta.warning_percentages || [];
        setPorcentajes(wp.length > 0 ? wp : [80]);
        setQuiereAdvertencias(wp.length > 0);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setFormData(prev => ({ ...prev, service: 'all_services', threshold_amount: 0 }));
        setAlertEmails([]);
        setQuiereAdvertencias(false);
        setPorcentajes([80]);
    };

    const handleDelete = async (id: string) => {
        if(confirm("¿Estás seguro de eliminar esta regla?")) {
            setIsDeleting(id);
            try {
                await alertasService.eliminarAlerta(id, provider);
                cargarAlertas();
            } catch (error) {
                alert("Error al eliminar.");
            } finally {
                setIsDeleting(null);
            }
        }
    };

    const dbOptions = activeAccountsList.map(acc => ({ label: acc.alias, value: acc.id }));
    const projectOptions = [{ label: 'Todas las Suscripciones', value: 'all_projects' }, ...availableProjects.map(p => ({ label: p, value: p }))];
    const serviceOptions = [{ label: 'Todos los Servicios', value: 'all_services' }, ...availableServices.map(s => ({ label: s, value: s }))];

    return (
        <div className="flex flex-col gap-6 pb-10">
            <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Database className="w-5 h-5" /></div>
                    <div className="hidden sm:block">
                        <h3 className="text-sm font-bold text-gray-800">Entorno de Facturación</h3>
                        <p className="text-xs text-gray-500">Selecciona el tenant a monitorear</p>
                    </div>
                </div>
                <SearchableSelect value={selectedDbAccount} onChange={handleDbChange} options={dbOptions} placeholder="Selecciona cuenta..." className="w-[280px] font-bold bg-gray-50 border-gray-200 shadow-none" />
            </div>

            <BillingKpiCards 
                totalReglas={alertas.length} 
                reglasDisparadas={alertas.filter(a => (a.triggered_warnings_this_month || []).length > 0).length}
                presupuestoProtegido={alertas.reduce((acc, curr) => acc + curr.threshold_amount, 0)}
            />
            
            <BillingAlertForm 
                formData={formData} setFormData={setFormData}
                projectOptions={projectOptions} serviceOptions={serviceOptions}
                isLoadingProjects={isLoadingProjects} isLoadingServices={isLoadingServices}
                alertEmails={alertEmails} setAlertEmails={setAlertEmails}
                quiereAdvertencias={quiereAdvertencias} setQuiereAdvertencias={setQuiereAdvertencias}
                porcentajes={porcentajes} togglePorcentaje={togglePorcentaje}
                handleSubmit={handleSubmit} editingId={editingId} cancelEdit={cancelEdit} loading={loading}
                currentUserEmail={currentUserEmail} 
                companyEmails={companyEmails}       
            />
            
            <BillingAlertsTable 
                alertas={alertas}
                isFetching={isFetching}
                handleEditClick={handleEditClick}
                handleDelete={handleDelete}
                isDeleting={isDeleting}
            />
        </div>
    );
}