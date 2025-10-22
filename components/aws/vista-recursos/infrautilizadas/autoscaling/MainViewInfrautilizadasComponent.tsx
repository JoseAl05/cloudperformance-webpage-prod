import { FiltersComponent } from "@/components/general/filters/FiltersComponent";
import { InstanceEc2InfrautilizadaComponent } from "@/components/aws/vista-recursos/infrautilizadas/autoscaling/InstanceEc2InfrautilizadaComponent";
import { Server } from "lucide-react";


export const MainViewInfrautilizadasComponent = () => {
  return (
    <div className="w-full min-w-0 space-y-4">
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Server className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Instancias autoscaling infrautilizadas
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full min-w-0">
        <FiltersComponent
          Component={InstanceEc2InfrautilizadaComponent}
          dateFilter
          // regionFilter
          // isRegionMultiSelect
          // instancesFilter
          // instancesService="infraUsed"
          // isInstanceMultiSelect
          instancesService='infraUsed'
          regionFilter
          asgFilter
          isAsgMultiSelect
          isAsgInstanceMultiSelect

        />
      </div>
    </div>
  );
};
