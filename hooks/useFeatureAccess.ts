import { useSession } from '@/hooks/useSession';
import  useSWR  from 'swr'; 
import { Empresa} from '@/types/db'; 

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
    'business': { aws: 'full_dashboard', azure: 'full_dashboard', presupuesto: true, vistaAdvisor: true }, // <-- ACCESO CLAVE
    'global access': { aws: 'full_dashboard', azure: 'full_dashboard', presupuesto: true, vistaAdvisor: true },
};

/**
 * Hook para determinar el acceso a funcionalidades de nube y módulos basado en el plan de la empresa.
 * Prioriza la lectura del plan directamente desde la sesión del usuario.
 */
export const useFeatureAccess = () => {
    const { user: userLoggedIn, isLoading: loadingSession } = useSession();
    
    const isGlobalAdmin = userLoggedIn?.role === 'admin_global';
    const isCompanyAdmin = userLoggedIn?.role === 'admin_empresa';

    const shouldFetchCompanyData = false; 

    const { data: empresas, isLoading: loadingEmpresas } = useSWR<Empresa[]>(
        shouldFetchCompanyData ? '/api/perfilamiento/empresas' : null, 
        fetcher
    );

    let sourcePlanName: string | undefined;
    
    if (isGlobalAdmin) {
        sourcePlanName = 'Global Access';
    } else if (userLoggedIn?.planName) {
        sourcePlanName = userLoggedIn.planName;
    }

    const currentPlanNameKey = sourcePlanName?.toLowerCase() || '';

    const planRestrictions = PLAN_ACCESS_CONFIG[currentPlanNameKey] || { 
        aws: 'none', 
        azure: 'none', 
        presupuesto: false,
        vistaAdvisor: false 
    };
    
    const canAccessFullDashboardAzure = isGlobalAdmin || (planRestrictions.azure === 'full_dashboard');
    const canAccessPdfReportAzure = isGlobalAdmin || (planRestrictions.azure !== 'none');
    const canAccessPdfReportAws = isGlobalAdmin || (planRestrictions.aws !== 'none');

   
    const canAccessPresupuesto = isGlobalAdmin || planRestrictions.presupuesto; 
    
    const canAccessVistaAdvisor = isGlobalAdmin || planRestrictions.vistaAdvisor; 

    return { 
        loading: loadingSession, 
        canAccessFullDashboardAws: isGlobalAdmin || (planRestrictions.aws === 'full_dashboard'),
        canAccessFullDashboardAzure,
        canAccessPdfReportAzure,
        canAccessPdfReportAws,
        canAccessPresupuesto,
        canAccessVistaAdvisor, 
        currentPlanName: sourcePlanName || 'SIN PLAN DEFINIDO', 
        isGlobalAdmin,
        isCompanyAdmin
    };
};