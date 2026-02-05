import { FiltersComponent } from "@/components/general_gcp/filters/FiltersComponent";
import { MapPin } from "lucide-react";
import { UsedCostLocationComponent } from "./UsedCostLocationComponent";

export const MainViewUsedCostLocationComponent = () => {
  return (
    <div className="w-full min-w-0 space-y-4">
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Uso Promedio por Localización
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                  Análisis del consumo promedio de recursos según región en GCP
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full min-w-0">
        <FiltersComponent
          Component={UsedCostLocationComponent}
          dateFilter
          projectsFilter
          regionFilter
          serviceFilter
        />
      </div>
    </div>
  );
};