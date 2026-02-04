import { FiltersComponent } from "@/components/general_gcp/filters/FiltersComponent";
import { Database } from "lucide-react";
import { InstanceGroupConsumeComponent } from '@/components/gcp/vista-consumos/instance-groups/InstanceGroupConsumeComponent';
import { ClusterGkeConsumeComponent } from '@/components/gcp/vista-consumos/clusters-gke/ClusterGkeConsumeComponent';

export const MainViewClusterGkeConsumeComponent = () => {
    return (
        <div className="w-full min-w-0 space-y-4">
            <div className="mb-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Database className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                    Nodos Clusters GKE - Consumo y Eficiencia
                                </h1>
                                <p className="text-gray-500 dark:text-gray-400">
                                    Análisis de rendimiento y costos de nodos de Clusters GKE
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full min-w-0">
                <FiltersComponent
                    Component={ClusterGkeConsumeComponent}
                    dateFilter
                    projectFilter
                    regionFilter
                    // tagsFilter
                    resourceFilter
                    isResourceMultiSelect
                    resourceService='clusters-gke'
                    // tagCollection="gcp_compute_instances"
                    // tagColumn="labels"
                />
            </div>
        </div>
    );
};