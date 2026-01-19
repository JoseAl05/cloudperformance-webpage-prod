import { useSession } from '@/hooks/useSession';
import useSWR from 'swr'; 
import { Empresa } from '@/types/db'; 
import { useClientContext } from '@/components/context/ClientContext'; 

const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(res => res.json());

const PLAN_ACCESS_CONFIG: Record<string, { 
    aws: 'full_dashboard' | 'pdf_report' | 'none'; 
    azure: 'full_dashboard' | 'pdf_report' | 'none';
    gcp: 'full_dashboard' | 'pdf_report' | 'none'
    presupuesto: boolean;
    vistaAdvisor: boolean; 
}> = {
    'starter (freemium)': {
        aws: 'pdf_report',
        azure: 'pdf_report',
        gcp: 'none',
        presupuesto: false,
        vistaAdvisor: false,
    },
    'starter': {
        aws: 'pdf_report',
        azure: 'pdf_report',
        gcp: 'none',
        presupuesto: false,
        vistaAdvisor: false,
    },
    'pro': {
        aws: 'full_dashboard',
        azure: 'full_dashboard',
        gcp: 'pdf_report',
        presupuesto: false,
        vistaAdvisor: false,
    },
    'business': {
        aws: 'full_dashboard',
        azure: 'full_dashboard',
        gcp: 'full_dashboard',
        presupuesto: true,
        vistaAdvisor: true,
    },
    'global access': {
        aws: 'full_dashboard',
        azure: 'full_dashboard',
        gcp: 'full_dashboard',
        presupuesto: true,
        vistaAdvisor: true,
    },
}



export const useFeatureAccess = () => {
    const { user: userLoggedIn, isLoading: loadingSession, refresh: refreshSession } = useSession();
    const { 
        selectedCompany,
        setSelectedCompany,

        activeAzureAccountId,
        setActiveAzureAccountId,

        activeAwsAccountId,
        setActiveAwsAccountId,

        activeGcpAccountId,
        setActiveGcpAccountId,
    } = useClientContext(); 

    const isGlobalAdmin = userLoggedIn?.role === 'admin_global';
    const isCompanyAdmin = userLoggedIn?.role === 'admin_empresa';
    
    const shouldFetchCompanyData = isGlobalAdmin; 
    const { data: empresas, isLoading: loadingEmpresas } = useSWR<Empresa[]>(
        shouldFetchCompanyData ? '/api/perfilamiento/empresas' : null, 
        fetcher,
        { revalidateOnFocus: false }
    );
    const companiesList = isGlobalAdmin ? (empresas || []) : [];

    let activeCredentials;

    if (isGlobalAdmin && selectedCompany) {
        // Caso 1: Admin Global visualizando una empresa seleccionada
        activeCredentials = selectedCompany;
    } else if (userLoggedIn) {
        // Caso 2: Admin Empresa o Usuario  (usando su propia sesión)
        activeCredentials = userLoggedIn;
    } else {
        activeCredentials = null;
    }

    //  LÓGICA MULTI-TENANT 
    
    const normalizeAccounts = (rawAccounts: any[] | undefined, legacyDb: string | null | undefined) => {
        let list = rawAccounts || [];
        if (list.length === 0 && legacyDb) {
            list = [{ id: 'default-legacy', alias: 'Cuenta Principal', db: legacyDb }];
        }
        return list;
    };
    
    // Normalizar nubes
    const azureAccountsList = normalizeAccounts(activeCredentials?.azure_accounts, activeCredentials?.user_db_azure);
    const awsAccountsList = normalizeAccounts(activeCredentials?.aws_accounts, activeCredentials?.user_db_aws);
    const gcpAccountsList = normalizeAccounts(activeCredentials?.gcp_accounts, activeCredentials?.user_db_gcp);

    let currentDbAzure = null;
    if (azureAccountsList.length > 0) {
        const selectedAccount = azureAccountsList.find(acc => acc.id === activeAzureAccountId);
        currentDbAzure = selectedAccount ? selectedAccount.db : azureAccountsList[0].db;
    }
    
    let currentDbAws = null;
    if (awsAccountsList.length > 0) {
        const selectedAccount = awsAccountsList.find(acc => acc.id === activeAwsAccountId);
        currentDbAws = selectedAccount ? selectedAccount.db : awsAccountsList[0].db;
    }

    let currentDbGcp = null;
    if (gcpAccountsList.length > 0) {
        const selectedAccount = gcpAccountsList.find(acc => acc.id === activeGcpAccountId);
        currentDbGcp = selectedAccount ? selectedAccount.db : gcpAccountsList[0].db;
    }

    const sourcePlanName = activeCredentials?.planName || (isGlobalAdmin ? 'Global Access' : undefined);
    const currentPlanNameKey = sourcePlanName?.toLowerCase() || '';

    const planRestrictions = PLAN_ACCESS_CONFIG[currentPlanNameKey] || { 
        aws: 'none', azure: 'none', presupuesto: false, vistaAdvisor: false 
    };
    
    const connectionData = {
        client: activeCredentials?.name || activeCredentials?.client,
        
        isAwsActive: activeCredentials?.is_aws || false,
        dbAwsName: currentDbAws, 
        awsAccountsList, 
        
        isAzureActive: activeCredentials?.is_azure || false,
        dbAzureName: currentDbAzure, 
        azureAccountsList,

        isGcpActive: activeCredentials?.is_gcp || false,
        dbGcpName: currentDbGcp,
        gcpAccountsList,
    };


    const swapContextToken = async (targetClientName: string, explicitAzureDb: string | null = null, explicitAwsDb: string | null = null, explicitGcpDb: string | null = null) => {
        if (!targetClientName) return;
   
        try {
            const payload = { 
                clientName: targetClientName,
                user_db_azure: explicitAzureDb, 
                user_db_aws: explicitAwsDb,
                user_db_gcp: explicitGcpDb,      
            };

            const response = await fetch('/api/auth/swap-client-context', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload), 
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Error desconocido.' }));
                throw new Error(errorData.message || 'Error al cambiar contexto.');
            }
            refreshSession(); 

        } catch (error) {
            console.error("Fallo al cambiar el contexto:", error);
        }
   };


    return { 
        loading: loadingSession || (isGlobalAdmin && loadingEmpresas), 
        connectionData, 
        companiesList, 
        swapContextToken,
        setSelectedCompany,
        activeAzureAccountId, setActiveAzureAccountId, 
        activeAwsAccountId, setActiveAwsAccountId,
        activeGcpAccountId, setActiveGcpAccountId,

        canAccessFullDashboardAws: isGlobalAdmin || (planRestrictions.aws === 'full_dashboard'),
        canAccessFullDashboardAzure: isGlobalAdmin || (planRestrictions.azure === 'full_dashboard'),
        canAccessFullDashboardGcp:isGlobalAdmin || planRestrictions.gcp === 'full_dashboard',
        canAccessPdfReportAzure: isGlobalAdmin || (planRestrictions.azure !== 'none'),
        canAccessPdfReportAws: isGlobalAdmin || (planRestrictions.aws !== 'none'),
        canAccessPdfReportGcp: isGlobalAdmin || planRestrictions.gcp !== 'none',
        canAccessPresupuesto: isGlobalAdmin || planRestrictions.presupuesto,
        canAccessVistaAdvisor: isGlobalAdmin || planRestrictions.vistaAdvisor,
        
        currentPlanName: sourcePlanName || 'SIN PLAN DEFINIDO', 
        isGlobalAdmin,
        isCompanyAdmin: activeCredentials?.role === 'admin_empresa',
    };
};