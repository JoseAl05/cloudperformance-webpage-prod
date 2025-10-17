"use client";
import React from "react";
import { TopRecursosChart } from "@/components/aws/vista-funciones/top-recursos/grafico/topRecursosGroupBy";
import { MapPin, Layers, Grid } from "lucide-react";

interface MainViewTopRecursosProps {
  startDate: Date;
  endDate: Date;
}

export const MainViewTopRecursos = ({ startDate, endDate }: MainViewTopRecursosProps) => {
  return (
    <div className="space-y-6 p-4">
      <div>
        <TopRecursosChart
          startDate={startDate}
          endDate={endDate}
          groupBy="ResourceRegion"
          title="Top Recursos por Región"
          icon={<MapPin className="h-5 w-5 text-blue-600" />}
        />
      </div>
      <div>
        <TopRecursosChart
          startDate={startDate}
          endDate={endDate}
          groupBy="ResourceType"
          title="Top Recursos por Tipo de Recurso"
          icon={<Layers className="h-5 w-5 text-green-600" />}
        />
      </div>
      <div>
        <TopRecursosChart
          startDate={startDate}
          endDate={endDate}
          groupBy="ResourceService"
          title="Top Recursos por Servicio"
          icon={<Grid className="h-5 w-5 text-purple-600" />}
        />
      </div>
    </div>
  );
};
