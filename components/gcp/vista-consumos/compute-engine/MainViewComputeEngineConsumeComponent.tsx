import { FiltersComponent } from "@/components/general_gcp/filters/FiltersComponent";
import { Database } from "lucide-react";
import { CloudSQLComponent } from "./CloudSQLComponent";
import { ComputeEngineConsumeComponent } from '@/components/gcp/vista-consumos/compute-engine/ComputeEngineConsumeComponent';

export const MainViewComputeEngineConsumeComponent = () => {
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
                                    Compute Engine - Consumo y Eficiencia
                                </h1>
                                <p className="text-gray-500 dark:text-gray-400">
                                    Análisis de rendimiento y costos de instancias Compute Engine
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full min-w-0">
                <FiltersComponent
                    Component={ComputeEngineConsumeComponent}
                    dateFilter
                    projectFilter
                    regionFilter
                    tagsFilter
                    resourceFilter
                    isResourceMultiSelect
                    resourceService='instances'
                    tagCollection="gcp_compute_instances"
                    tagColumn="labels"
                />
            </div>
        </div>
    );
};