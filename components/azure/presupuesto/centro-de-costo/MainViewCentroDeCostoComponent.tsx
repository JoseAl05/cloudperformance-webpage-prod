"use client";
import { CircleDollarSign } from "lucide-react";
import { SessionGate } from "@/components/general_presupuesto/session/SesionGate";
import { FiltersComponent } from "@/components/general_presupuesto/filters/FiltersComponent";
import { CentroDeCostoComponent } from "@/components/azure/presupuesto/centro-de-costo/CentroDeCostoComponent";

export const MainViewCentroDeCostoComponent = () => {
  return (
    <SessionGate>
      <div className="w-full min-w-0 space-y-4">
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <CircleDollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Gestión de Presupuesto
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                  Administración de centros de costo 🏷️
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full min-w-0">
          <FiltersComponent
            Component={CentroDeCostoComponent}
            cloudFilter
            dateFilter={false}
          />
        </div>
      </div>
    </SessionGate>
  );
};
