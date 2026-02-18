import { FiltersComponent } from "@/components/general_gcp/filters/FiltersComponent";
import { Split } from "lucide-react";
import { SubnetsSinRecursosComponent } from "./SubnetsSinRecursosComponent";

export const MainViewSubnetsSinRecursosComponent = () => {
  return (
    <div className="w-full min-w-0 space-y-4">
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Split className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Subnets sin Recursos Asociados
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                  Higiene de red y reducción de superficie de ataque innecesaria
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full min-w-0">
        <FiltersComponent
          Component={SubnetsSinRecursosComponent}
          dateFilter
          projectFilter
          regionFilter
          tagsFilter
          tagCollection="gcp_compute_subnetworks"
          tagColumn="labels"
        />
      </div>
    </div>
  );
};