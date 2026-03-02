import { FiltersComponent } from "@/components/general_gcp/filters/FiltersComponent";
import { Share2 } from "lucide-react";
import { LoadBalancersComponent } from "./LoadBalancersComponent";

export const MainViewLoadBalancersComponent = () => {
  return (
    <div className="w-full min-w-0 space-y-4">
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                <Share2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Load Balancers: Consumo y Estado
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                  Análisis de tráfico y detección de load balancers sin uso
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full min-w-0">
        <FiltersComponent
          Component={LoadBalancersComponent}
          dateFilter
          projectFilter
          regionFilter
          esquemaFilter
          estadoUsoFilter
        />
      </div>
    </div>
  );
};