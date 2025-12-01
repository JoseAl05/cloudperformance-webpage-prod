"use client";
import { TopRecursosChart } from "@/components/aws/vista-funciones/top-facturaciones/top-recursos/grafico/topRecursosGroupBy";
import { MapPin, Layers, Grid } from "lucide-react";


export const MainViewTopRecursos = () => {
  return (
    <div className="space-y-6 p-4">
      <div>
        <TopRecursosChart
          groupBy="ResourceRegion"
          title="Top Recursos por Región"
          icon={<MapPin className="h-5 w-5 text-blue-600" />}
        />
      </div>
      <div>
        <TopRecursosChart
          groupBy="ResourceType"
          title="Top Recursos por Tipo de Recurso"
          icon={<Layers className="h-5 w-5 text-green-600" />}
        />
      </div>
      <div>
        <TopRecursosChart
          groupBy="ResourceService"
          title="Top Recursos por Servicio"
          icon={<Grid className="h-5 w-5 text-purple-600" />}
        />
      </div>
    </div>
  );
};
