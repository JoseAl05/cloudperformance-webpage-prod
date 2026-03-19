'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { Card, CardContent } from '@/components/ui/card'
import {
  Tags,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  LayoutGrid,
  Info,
  ServerOff,
  PieChart,
  Cloud,    
  Laptop,   
  Layers,   
  X         
} from 'lucide-react'
import { LoaderComponent } from '@/components/general_gcp/LoaderComponent'
import { MessageCard } from '@/components/aws/cards/MessageCards'
import { TagsDataTableAzure } from './table/TagsDataTable'

/* ======================
    Types
====================== */
export interface ResourceItemAzure {
  resource: string
  id_resource: string
  sub_service: string
  subscription_guid: string    
  subscription_name: string  
  region: string 
  tags: Record<string, string> | "SIN TAGS"
  local_keys?: string[]
}

export interface ServiceGroupAzure {
  service: string
  resources: ResourceItemAzure[]
}

export interface ApiResponseWrapper {
  data?: ServiceGroupAzure[]
  items?: ServiceGroupAzure[]
  results?: ServiceGroupAzure[]
  detail?: string | Record<string, unknown>
  message?: string | Record<string, unknown>
}

interface TagsAnalysisProps {
  startDate: Date
  endDate: Date
  subscription: string
  region: string
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export const TagsAnalysisComponentAzure = ({ startDate, endDate, subscription, region }: TagsAnalysisProps) => {
  // Estado para controlar el pop-up de detalles
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4)
  const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : ''

  const endpointUrl = `/api/azure/bridge/mantenedor-tags/azure/get_resource_tags?date_from=${startDateFormatted}&date_to=${endDateFormatted}&subscription_id=${subscription}&region=${region}`;

  const { data, isLoading, error } = useSWR<unknown>(endpointUrl, fetcher)

  if (isLoading) return <LoaderComponent />
  
  if (error || !data) {
    return (
      <div className="w-full min-w-0 px-4 py-10">
        <MessageCard
          icon={AlertCircle}
          title="Error al cargar inventario"
          description="Hubo un problema de conexión con el endpoint de tags de Azure."
          tone="error"
        />
      </div>
    )
  }

  // --- LÓGICA DE CÁLCULO AMPLIADA ---
  let totalRecursos = 0;
  let recursosSinTags = 0;
  
  // Contadores para el detalle Nube vs Local
  let soloNube = 0;
  let soloLocal = 0;
  let mixtos = 0;

  let gruposArray: ServiceGroupAzure[] = [];
  
  if (Array.isArray(data)) {
    gruposArray = data;
  } else if (data && typeof data === 'object') {
      const apiResponse = data as ApiResponseWrapper;
      
      gruposArray = apiResponse.data || apiResponse.items || apiResponse.results || [];
      
      if (gruposArray.length === 0 && (apiResponse.detail || apiResponse.message)) {
        const detail = apiResponse.detail;
        const message = apiResponse.message;
        
        const errorMsg = typeof detail === 'string' 
          ? detail 
          : JSON.stringify(detail || message);
        
        return (
          <div className="w-full min-w-0 px-4 py-6">
            <MessageCard icon={AlertCircle} title="Aviso del Servidor" description={`El endpoint respondió con: ${errorMsg}`} tone="warn" />
          </div>
        )
      }
    }

  if (gruposArray.length === 0) {
    return (
      <div className="w-full min-w-0 px-4 py-6">
        <MessageCard icon={Info} title="Sin recursos" description="No se detectaron recursos en este rango de fechas." tone="info" />
      </div>
    )
  }

  // Iteración para calcular todos los KPIs incluyendo nube vs local
  gruposArray.forEach(grupo => {
    const resources = grupo.resources || [];
    totalRecursos += resources.length;
    
    resources.forEach((r: ResourceItemAzure) => {
      if (r.tags === "SIN TAGS" || !r.tags || Object.keys(r.tags).length === 0) {
        recursosSinTags++;
      } else {
        const totalTagsCount = Object.keys(r.tags).length;
        const localTagsCount = r.local_keys?.length || 0;
        const cloudTagsCount = totalTagsCount - localTagsCount;

        if (cloudTagsCount > 0 && localTagsCount > 0) mixtos++;
        else if (cloudTagsCount > 0 && localTagsCount === 0) soloNube++;
        else if (cloudTagsCount === 0 && localTagsCount > 0) soloLocal++;
      }
    });
  });

  const recursosTageados = totalRecursos - recursosSinTags;
  const porcentajeCobertura = totalRecursos > 0 ? Math.round((recursosTageados / totalRecursos) * 100) : 0;

  const isOptimal = porcentajeCobertura >= 90;
  const isWarning = porcentajeCobertura >= 50 && porcentajeCobertura < 90;


  // Calcula el % basado en el TOTAL de la infraestructura (tageados + huérfanos)
  const calcPercent = (val: number) => totalRecursos > 0 ? Math.round((val / totalRecursos) * 100) : 0;

  return (
    <div className="w-full min-w-0 px-4 py-6 space-y-6 relative">
      
      {/* HEADER Y TEXTOS */}
      <div className="flex items-center gap-3 mb-6">
        <Tags className="h-7 w-7 text-[#0078D4]" />
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Análisis de Cobertura de Etiquetas</h1>
      </div>

      <div className={`w-full p-4 rounded-xl border-l-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-sm ${
        isOptimal ? 'bg-green-50 border-green-500' : isWarning ? 'bg-yellow-50 border-yellow-500' : 'bg-red-50 border-red-500'
      }`}>
        <div className={`p-2.5 rounded-full shrink-0 ${
          isOptimal ? 'bg-green-100 text-green-600' : isWarning ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
        }`}>
          {isOptimal ? <CheckCircle2 className="h-6 w-6" /> : <AlertTriangle className="h-6 w-6" />}
        </div>
        <div className="flex-1">
          <h3 className={`text-base sm:text-lg font-bold ${
            isOptimal ? 'text-green-800' : isWarning ? 'text-yellow-800' : 'text-red-800'
          }`}>
            Estado: {isOptimal ? 'Excelente' : isWarning ? 'Requiere Atención' : 'Crítico (Falta de visibilidad)'}
          </h3>
          <p className="text-sm text-gray-700 mt-1 leading-relaxed">
            {isOptimal 
              ? `Gran trabajo. El ${porcentajeCobertura}% de tu infraestructura está correctamente etiquetada.` 
              : isWarning
                ? `Tienes una cobertura del ${porcentajeCobertura}%. Se recomienda aplicar tags locales a los recursos huérfanos para mejorar el reporte FinOps.`
                : `Atención: Solo el ${porcentajeCobertura}% de los recursos tiene tags. Tienes ${recursosSinTags} recursos generando gastos sin asignación clara.`
            }
          </p>
        </div>
      </div>

      {/* TARJETAS KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 w-full">
        <Card className="border-l-4 border-l-gray-500 shadow-sm flex flex-col justify-between w-full">
          <CardContent className="p-4 sm:p-5">
            <div className="flex justify-between items-start mb-3">
              <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">Total Recursos</p>
              <LayoutGrid className="h-5 w-5 text-gray-500 opacity-80" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-800 truncate">{totalRecursos}</p>
          </CardContent>
        </Card>

        {/* TARJETA: RECURSOS TAGEADOS CON BOTÓN INFO */}
        <Card className="border-l-4 border-l-[#0078D4] shadow-sm flex flex-col justify-between w-full">
          <CardContent className="p-4 sm:p-5 relative">
            <div className="flex justify-between items-start mb-3">
              <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                Recursos Tageados
                <button onClick={() => setShowDetailsModal(true)} className="text-gray-400 hover:text-[#0078D4] transition-colors" title="Ver detalle Nube vs Local">
                  <Info className="h-4 w-4" />
                </button>
              </p>
              <Tags className="h-5 w-5 text-[#0078D4] opacity-80" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-800 truncate">{recursosTageados}</p>
          </CardContent>
        </Card>

        <Card className={`border-l-4 shadow-sm flex flex-col justify-between w-full ${recursosSinTags > 0 ? 'border-l-red-500' : 'border-l-green-500'}`}>
          <CardContent className="p-4 sm:p-5">
            <div className="flex justify-between items-start mb-3">
              <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">Huérfanos</p>
              <ServerOff className={`h-5 w-5 opacity-80 ${recursosSinTags > 0 ? 'text-red-500' : 'text-green-500'}`} />
            </div>
            <p className={`text-2xl sm:text-3xl font-bold truncate ${recursosSinTags > 0 ? 'text-red-600' : 'text-green-600'}`}>{recursosSinTags}</p>
          </CardContent>
        </Card>

        {/* TARJETA: COBERTURA CON BOTÓN INFO */}
        <Card className={`border-l-4 shadow-sm flex flex-col justify-between w-full ${isOptimal ? 'border-l-green-600' : isWarning ? 'border-l-yellow-500' : 'border-l-red-500'}`}>
          <CardContent className="p-4 sm:p-5 relative">
            <div className="flex justify-between items-start mb-3">
              <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                Cobertura
                <button onClick={() => setShowDetailsModal(true)} className="text-gray-400 hover:text-gray-700 transition-colors" title="Ver detalle Nube vs Local">
                  <Info className="h-4 w-4" />
                </button>
              </p>
              <PieChart className={`h-5 w-5 opacity-80 ${isOptimal ? 'text-green-600' : isWarning ? 'text-yellow-600' : 'text-red-600'}`} />
            </div>
            <p className={`text-2xl sm:text-3xl font-bold truncate ${isOptimal ? 'text-green-700' : isWarning ? 'text-yellow-700' : 'text-red-600'}`}>{porcentajeCobertura}%</p>
          </CardContent>
        </Card>
      </div>

      <div className="w-full mt-8">
        <TagsDataTableAzure data={gruposArray} />
      </div>

      {/* ======================
          MODAL DE DETALLES
      ====================== */}
      {showDetailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setShowDetailsModal(false)}>
          <div 
            className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden transform transition-all"
            onClick={(e) => e.stopPropagation()} // Evita que el click dentro cierre el modal
          >
            <div className="p-5 border-b flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <PieChart className="h-5 w-5 text-[#0078D4]" />
                Detalle de Origen de Etiquetas
              </h2>
              <button onClick={() => setShowDetailsModal(false)} className="text-slate-400 hover:text-slate-700 bg-slate-200/50 hover:bg-slate-200 p-1 rounded-md transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <p className="text-sm text-slate-600">
                Desglose de tu <strong>{porcentajeCobertura}%</strong> de cobertura total, evaluado sobre <strong>{totalRecursos}</strong> recursos en tu infraestructura:
              </p>

              <div className="space-y-3">
                {/* Etiquetado en Nube */}
                <div className="flex items-center justify-between p-3 border rounded-lg bg-blue-50/30 border-blue-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 text-[#0078D4] rounded-md"><Cloud className="h-5 w-5" /></div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Solo en Azure</p>
                      <p className="text-xs text-slate-500">Tags nativos de la nube</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-bold text-slate-800">{soloNube}</p>
                    <p className="text-xs text-slate-500">{calcPercent(soloNube)}%</p>
                  </div>
                </div>

                {/* Etiquetado Local */}
                <div className="flex items-center justify-between p-3 border rounded-lg bg-purple-50/30 border-purple-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 text-purple-600 rounded-md"><Laptop className="h-5 w-5" /></div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Solo Local</p>
                      <p className="text-xs text-slate-500">Tags aplicados en CloudPerformance</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-bold text-slate-800">{soloLocal}</p>
                    <p className="text-xs text-slate-500">{calcPercent(soloLocal)}%</p>
                  </div>
                </div>

                {/* Mixto */}
                <div className="flex items-center justify-between p-3 border rounded-lg bg-emerald-50/30 border-emerald-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 text-emerald-600 rounded-md"><Layers className="h-5 w-5" /></div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Mixtos</p>
                      <p className="text-xs text-slate-500">Tienen tags en Azure y Locales</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-bold text-slate-800">{mixtos}</p>
                    <p className="text-xs text-slate-500">{calcPercent(mixtos)}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}