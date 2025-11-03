'use client'
import React from 'react';
import { Bot, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useSWR from 'swr';
import { LoaderComponent } from '@/components/general/LoaderComponent';
import { MessageCard } from '@/components/aws/cards/MessageCards';

const fetcher = (url: string) =>
  fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
    .then(r => r.json());

export const AIComponentAzure = () => {
  const documentName = "report_azure.pdf";

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
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <Bot className="h-8 w-8 text-indigo-600" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold text-gray-900">
              Recomendaciones de Inteligencia Artificial
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Informe generado por IA basado en las recomendaciones de Azure Advisor.
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-md">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-blue-700 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800 leading-relaxed">
              IMPORTANTE: La IA puede cometer errores. Recomendamos encarecidamente validar y revisar la información y las acciones propuestas antes de aplicar cualquier cambio en sus recursos de la nube.
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <a
            href={data.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-transparent text-sm font-semibold rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition duration-200"
          >
            <Bot className="h-5 w-5" />
            <span>Ver Reporte de Recomendaciones</span>
          </a>
        </div>
      </CardContent>
    </Card>
  );
}