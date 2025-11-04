'use client'
import React from 'react';
import { Bot, AlertTriangle, AlertCircle, Info, Download } from 'lucide-react';
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
        width="100%"
        height="600px"
        style={{ border: '1px solid #ccc', borderRadius: '8px' }}
        title="Preview de HTML"
      />
    </div>
  );
}