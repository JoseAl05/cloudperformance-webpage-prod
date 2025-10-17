"use client";

import { useSession } from "@/hooks/useSession";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import { CircleDollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CentroDeCostoTableComponent } from "./table/CentroDeCostoTableComponent";
import { CentroDeCostoFormComponent, CentroCosto } from "./form/CentroDeCostoFormComponent";
import { SessionGate } from "@/components/general_presupuesto/session/SesionGate";
import { FiltersComponent } from "@/components/general_presupuesto/filters/FiltersComponent";
import { CostosVsPresupuestoComponent } from "./CostosVsPresupuestoComponent";

export const MainViewCostoVsPresupuestoComponent = () => {
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
                  Costos vs Presupuesto 📊
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full min-w-0">
          <FiltersComponent
            Component={CostosVsPresupuestoComponent}
            cloudFilter
          />
        </div>
      </div>
    </SessionGate>
  );
};
