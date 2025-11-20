import { useSession } from '@/hooks/useSession';
import useSWR from 'swr'; 
import { Empresa } from '@/types/db'; 
import { useClientContext } from '@/components/context/ClientContext'; 

type EmpresaOption = Empresa;

const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(res => res.json());

const PLAN_ACCESS_CONFIG: Record<string, { 
    aws: 'full_dashboard' | 'pdf_report' | 'none'; 
    azure: 'full_dashboard' | 'pdf_report' | 'none';
    presupuesto: boolean;
    vistaAdvisor: boolean; 
}> = {
    'starter (freemium)': { aws: 'pdf_report', azure: 'pdf_report', presupuesto: false, vistaAdvisor: false }, 
    'starter': { aws: 'pdf_report', azure: 'pdf_report', presupuesto: false, vistaAdvisor: false }, 
    'pro': { aws: 'full_dashboard', azure: 'full_dashboard', presupuesto: false, vistaAdvisor: false },
    'business': { aws: 'full_dashboard', azure: 'full_dashboard', presupuesto: true, vistaAdvisor: true },
    'global access': { aws: 'full_dashboard', azure: 'full_dashboard', presupuesto: true, vistaAdvisor: true },
};

export const useFeatureAccess = () => {
    const { user: userLoggedIn, isLoading: loadingSession, refresh: refreshSession } = useSession();
    const { selectedCompany, setSelectedCompany } = useClientContext(); 
    const isGlobalAdmin = userLoggedIn?.role === 'admin_global';
    const isCompanyAdmin = userLoggedIn?.role === 'admin_empresa';
    const shouldFetchCompanyData = isGlobalAdmin;
    
    const { data: empresas, isLoading: loadingEmpresas } = useSWR<Empresa[]>(
        shouldFetchCompanyData ? '/api/perfilamiento/empresas' : null, 
        fetcher,
        { revalidateOnFocus: false }
    );
    const companiesList = isGlobalAdmin ? (empresas || []) : [];

    // FUNCIÓN CLAVE: Solicitar al backend que cambie el token
    const swapContextToken = async (targetClientName: string) => {
        if (!isGlobalAdmin || !targetClientName) return;
        
        try {
            const response = await fetch('/api/auth/swap-client-context', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ clientName: targetClientName }),
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Error al obtener el token de contexto.');
            }
            
            refreshSession(); 

        } catch (error) {
            console.error("Fallo al cambiar el contexto del cliente:", error);
        }
    };
    
    let activeCredentials;
    
    if (isGlobalAdmin && selectedCompany) {
        activeCredentials = {
            client: selectedCompany.name,
            is_aws: selectedCompany.is_aws,
            user_db_aws: selectedCompany.user_db_aws,
            is_azure: selectedCompany.is_azure,
            user_db_azure: selectedCompany.user_db_azure,
            planName: selectedCompany.planName,
        };
    } else if (userLoggedIn) {
        activeCredentials = userLoggedIn;
    } else {
        activeCredentials = {};
    }

    const sourcePlanName = activeCredentials.planName || (isGlobalAdmin ? 'Global Access' : undefined);
    const currentPlanNameKey = sourcePlanName?.toLowerCase() || '';

    const planRestrictions = PLAN_ACCESS_CONFIG[currentPlanNameKey] || { 
        aws: 'none', azure: 'none', presupuesto: false, vistaAdvisor: false 
    };
    
    const connectionData = {
        client: activeCredentials.client || userLoggedIn?.client,
        isAwsActive: activeCredentials.is_aws || false,
        dbAwsName: activeCredentials.user_db_aws,
        isAzureActive: activeCredentials.is_azure || false,
        dbAzureName: activeCredentials.user_db_azure,
    };


    return { 
        loading: loadingSession || (isGlobalAdmin && loadingEmpresas), 
        
        connectionData, 
        companiesList, 
        swapContextToken, // <-- Función para cambiar el JWT temporal
        setSelectedCompany, // <-- Función para actualizar el Contexto Visual
        
        canAccessFullDashboardAzure: isGlobalAdmin || (planRestrictions.azure === 'full_dashboard'),
        canAccessPdfReportAzure: isGlobalAdmin || (planRestrictions.azure !== 'none'),
        canAccessFullDashboardAws: isGlobalAdmin || (planRestrictions.aws === 'full_dashboard'),
        canAccessPdfReportAws: isGlobalAdmin || (planRestrictions.aws !== 'none'),
        canAccessPresupuesto: isGlobalAdmin || planRestrictions.presupuesto,
        canAccessVistaAdvisor: isGlobalAdmin || planRestrictions.vistaAdvisor,
        
        currentPlanName: sourcePlanName || 'SIN PLAN DEFINIDO', 
        isGlobalAdmin,
        isCompanyAdmin
    };
};