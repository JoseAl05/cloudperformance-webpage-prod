import { FiltersComponent } from "@/components/general_gcp/filters/FiltersComponent";
import { Globe } from "lucide-react";
import { ZonasDNSComponent } from "./ZonasDNSComponent";

export const MainViewZonasDNSComponent = () => {
  return (
    <div className="w-full min-w-0 space-y-4">
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Zonas DNS: Consumo y Estado
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                  Análisis de zonas DNS activas vs zombies para optimización de costos
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full min-w-0">
        <FiltersComponent
          Component={ZonasDNSComponent}
          dateFilter
          projectFilter
          estadoUsoFilter
          tagsFilter
          tagCollection="gcp_dns_managed_zones"
          tagColumn="labels"
          localService="Cloud DNS"          
        />
      </div>
    </div>
  );
};