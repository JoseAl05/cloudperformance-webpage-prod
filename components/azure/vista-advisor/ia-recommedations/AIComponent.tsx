import React from 'react';
import { Bot, Download, AlertTriangle } from 'lucide-react'; 
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';



export const AIComponent = () => {
  const documentPath = "/report_azure.pdf";

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
          {/* Botón Ver Reporte */}
          <a
            href={documentPath}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-transparent text-sm font-semibold rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition duration-200"
          >
            <Bot className="h-5 w-5" />
            <span>Ver Reporte de Recomendaciones</span>
          </a>

          {/* Botón Descargar Informe */}
          <a
            href={documentPath}
            download
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-semibold rounded-md text-gray-700 bg-white hover:bg-gray-50 transition duration-200"
          >
            <Download className="h-5 w-5" />
            <span>Descargar Informe IA</span>
          </a>
        </div>
      </CardContent>
    </Card>
  );
}