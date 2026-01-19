'use client'

import { LoaderComponent } from '@/components/general_gcp/LoaderComponent'
import { MessageCard } from '@/components/aws/cards/MessageCards' // Reutilizamos las cards de AWS por ahora o las de general_gcp si existen
import { AlertCircle, Info } from 'lucide-react'
import useSWR from 'swr'

// Interfaces temporales (las moveremos a un archivo de interfaces luego)
interface DiscosPersistentesProps {
    startDate: Date;
    endDate?: Date;
    projects: string;
    regions: string;
    resourceId?: string;
}

const fetcher = (url: string) =>
    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(r => r.json());

export const DiscosPersistentesComponent = ({ startDate, endDate, projects, regions, resourceId }: DiscosPersistentesProps) => {

    // 1. Formateo de fechas para API
    const startDateFormatted = startDate.toISOString().replace('Z', '').slice(0, -4);
    const endDateFormatted = endDate ? endDate.toISOString().replace('Z', '').slice(0, -4) : '';

    // 2. Construcción de URL con todos los filtros
    // Nota: El endpoint debe coincidir con tu backend.
    const url = projects 
        ? `/api/gcp/bridge/gcp/recursos_sin_uso/discos_persistentes_sin_uso?date_from=${startDateFormatted}&date_to=${endDateFormatted}&projects=${projects}&regions=${regions}&resource_id=${resourceId || ''}`
        : null;

    const { data, error, isLoading } = useSWR(url, fetcher)

    // 3. Manejo de Estados
    if (!projects) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="text-center text-gray-500 text-lg font-medium">
                    Selecciona un proyecto para comenzar.
                </div>
            </div>
        )
    }

    if (isLoading) return <LoaderComponent size='large' />

    if (error) {
        return (
            <div className="w-full min-w-0 px-4 py-10 flex flex-col items-center gap-4">
                <MessageCard
                    icon={AlertCircle}
                    title="Error al cargar datos"
                    description="Ocurrió un problema al conectar con el servidor."
                    tone="error"
                />
            </div>
        )
    }

    const hasData = data && (data.length > 0 || data.resumen);

    if (!hasData) {
        return (
            <div className="w-full min-w-0 px-4 py-6">
                <MessageCard
                    icon={Info}
                    title="Sin discos sin uso"
                    description="No se encontraron discos persistentes sin uso con los filtros seleccionados."
                    tone="warn"
                />
            </div>
        )
    }

    return (
        <div className='w-full min-w-0 px-4 py-6 space-y-6'>
            {/* AQUÍ IRÁN LOS COMPONENTES VISUALES */}
            
            <div className="p-4 border border-dashed border-gray-300 rounded bg-gray-50">
                <p className="text-sm text-gray-600 font-mono">
                    ✅ Conexión Exitosa. Datos recibidos: {Array.isArray(data) ? data.length : 'Objeto'} registros.
                    <br/>
                    (En el siguiente paso renderizaremos las Cards, Gráficos y Tabla aquí)
                </p>
            </div>

            {/* <DiscosPersistentesCardsComponent data={data} />
            <DiscosPersistentesTrendChart data={data} />
            <DiscosPersistentesTable data={data} /> 
            */}
        </div>
    )
}