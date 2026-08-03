"use client";
import { TopRecursosChart } from "@/components/aws/vista-funciones/top-facturaciones/top-recursos/grafico/topRecursosGroupBy";
import { MapPin, Layers, Grid } from "lucide-react";

export const MainViewTopRecursos = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="col-span-1">
        <TopRecursosChart
          groupBy="ResourceRegion"
          title="Top por Región"
          icon={<MapPin className="h-5 w-5 text-blue-600" />}
        />
      </div>

      <div className="col-span-1">
        <TopRecursosChart
          groupBy="ResourceType"
          title="Top por Tipo de Recurso"
          icon={<Layers className="h-5 w-5 text-green-600" />}
        />
      </div>

      <div className="col-span-1 md:col-span-2">
        <TopRecursosChart
          groupBy="ResourceService"
          title="Top por Servicio de AWS"
          icon={<Grid className="h-5 w-5 text-purple-600" />}
        />
      </div>
    </div>
  );
};