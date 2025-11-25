import { FiltersComponent } from "@/components/general_aws/filters/FiltersComponent";
import { InstanceEksInfrautilizadaComponent } from "@/components/aws/vista-recursos/infrautilizadas/eks/InstanceEksInfrautilizadaComponent";
import { Server } from "lucide-react";


export const MainViewInfrautilizadasEksComponent = () => {
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
                  Cluster EKS instancias EC2 infrautilizadas
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full min-w-0">
        {/* <FiltersComponent
          Component={InstanceEksInfrautilizadaComponent}
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
        /> */}

        <FiltersComponent
            Component={InstanceEksInfrautilizadaComponent}
            dateFilter
            regionFilter
            eksFilter
            isEksMultiSelect
            isEksAsgMultiSelect
            isEksAsgInstanceMultiSelect
            instancesService="infraUsed"
            tagsFilter
            collection='aws_eks_clusters_details'
            tagColumnName='tags'
        />
      </div>
    </div>
  );
};
