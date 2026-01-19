"use client";

import { CircleDollarSign } from "lucide-react";
import { SessionGate } from "@/components/general_presupuesto/session/SesionGate";
import { FiltersComponent } from "@/components/general_presupuesto/filters/FiltersComponent";
import { Card, CardContent } from '@/components/ui/card';
import { PresupuestoMensualComponent } from "@/components/azure/presupuesto/presupuesto-mensual/PresupuestoMensualComponent";
import { PresupuestoMensualComponentV2 } from "@/components/azure/presupuesto/presupuesto-mensual/PresupuestoMensualComponentV2";

export const MainViewPresupuestoMensualComponent = () => {
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
                  Administración de presupuesto Mensual 💰
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full min-w-0">
          {/* <FiltersComponent
            Component={PresupuestoMensualComponentV2}
            cloudFilter
            dateFilter={false}
          /> */}
          <div className='space-y-6'>
            <Card className="w-full min-w-0 overflow-hidden">
              <CardContent className='space-y-6'>
                <PresupuestoMensualComponentV2 />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SessionGate>
  );
};
