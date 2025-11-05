'use client'
import React from 'react';
import { Bot, AlertTriangle, AlertCircle, Info, Download, MessageCircleWarning, Square } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useSWR from 'swr';
import { LoaderComponent } from '@/components/general/LoaderComponent';
import { MessageCard } from '@/components/aws/cards/MessageCards';

const fetcher = (url: string) =>
  fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
    .then(r => r.json());

export const AIComponentAzure = () => {
  const documentName = "report_styled_azure.html";

  const { data, error, isLoading } = useSWR(
    `/api/blob?file=${documentName}`,
    fetcher,
  )

  if (isLoading) return <LoaderComponent />

  if (error) {
    return (
      <div className="w-full min-w-0 px-4 py-10 flex flex-col items-center gap-4">
        <MessageCard
          icon={AlertCircle}
          title="Error al cargar datos"
          description="Ocurrió un problema al obtener la información desde la API. Intenta nuevamente o ajusta el rango de fechas."
          tone="error"
        />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="w-full min-w-0 px-4 py-6">
        <MessageCard
          icon={Info}
          title="Sin datos para mostrar"
          description="No encontramos información del advisor en el rango seleccionado."
          tone="warn"
        />
      </div>
    )
  }


  return (
    <div className="flex flex-col gap-5">
      <div className='flex gap-5 border rounded-lg p-2 bg-blue-400/10'>
        <Info className='text-yellow-500 w-10 h-10 lg:w-10 lg:h-10' />
        <ul className='list-disc list-inside text-sm'>
          <li className='my-2'>El documento fue generado a partir de la información de recomendaciones presentes en esta vista.</li>
          <li className='my-2'>
            Un recurso solo puede tener <strong>un modelo de precios aplicado a la vez</strong>:
            <ol className='list-inside list-decimal pl-2 marker:font-bold'>
              <li>On-Demand (Pago por uso)</li>
              <li>Reservado</li>
              <li>Saving Plan</li>
            </ol>
          </li>
          <li>
            La jeraquia con la que se aplican estos modelos de precios a los recursos es la siguiente:
          </li>
          <ol className='list-inside list-decimal pl-2 marker:font-bold'>
            <li>El sistema busca todos los recursos que coincidan exactamente con las <strong>Reservas</strong> que se compran. Esos recursos quedan <strong>cubiertos por las Reservas</strong> o dicho de otra forma, ya están pagados.</li>
            <li>Luego el sistema mira todo el gasto restante que se está pagando como <strong>On-Demand (pago por uso) </strong> y aplica el descuento del Savings Plan sobre ese gasto, <strong>hasta agotar el compromiso por hora</strong>.</li>
            <li>Finalmente el sistema cataloga como On-Demand el resto de recursos que no aplican a los 2 puntos anteriores.</li>
          </ol>
          <li className='my-2'><strong>[NE]</strong> significa `No excluyente`</li>
          <li className='my-2'><strong>[E]</strong> significa `Excluyente`</li>
        </ul>
      </div>
      <div className="flex justify-start">
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center space-x-2 px-4 py-2 border border-transparent text-sm font-semibold rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition duration-200"
          download
        >
          <Download className="h-5 w-5" />
          <span>Descargar Archivo</span>
        </a>
      </div>
      <iframe
        src={data.url}
        // width="100%"
        // height="600px"
        style={{ border: '1px solid #ccc', borderRadius: '8px' }}
        title="Preview de HTML"
        className='w-full h-screen'
      />
    </div>
  );
}