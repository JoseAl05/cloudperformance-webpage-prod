"use client";

import { CircleDollarSign, Search, TicketsIcon, AlertCircle, Trash2, CheckCircle } from "lucide-react";
import { SessionGate } from "@/components/general_presupuesto/session/SesionGate";

interface CentroDeCostoComponentProps {
  cloud: string;
}

export const CostosVsPresupuestoComponent = ({ cloud }: CentroDeCostoComponentProps) => {

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl py-16 text-center">
      <div className="flex flex-col items-center justify-center space-y-3">
        <Search className="w-12 h-12 text-gray-300 dark:text-gray-600" />
        <div>
          <p className="text-lg font-semibold">este es un return de prueba</p>
          <p className="text-sm text-gray-400 mt-1">
            Intenta con otros términos de búsqueda
          </p>
        </div>
      </div>
    </div>
  );


  const cloudTypeMap: Record<string, string> = {
    AWS: "aws",
    AZURE: "azure",
  };
  const cloudType = cloud ? cloudTypeMap[cloud] ?? undefined : undefined;



};