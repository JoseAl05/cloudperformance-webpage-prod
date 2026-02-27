'use client'

import { FiltersComponent } from "@/components/general_gcp/filters/FiltersComponent";
import { HardDrive } from "lucide-react";
import { FilestoreConsumeComponent } from '@/components/gcp/vista-consumos/filestore/FilestoreConsumeComponent';

export const MainViewFilestoreConsumeComponent = () => {
    return (
        <div className="w-full min-w-0 space-y-4">
            {/* Header de la Vista */}
            <div className="mb-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                <HardDrive className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                    Cloud Filestore - Consumo y Eficiencia
                                </h1>
                                <p className="text-gray-500 dark:text-gray-400">
                                    Análisis de capacidad, rendimiento y costos de almacenamiento NFS
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Barra de Filtros Globales */}
            <div className="w-full min-w-0">
                <FiltersComponent
                    Component={FilestoreConsumeComponent}
                    dateFilter
                    projectFilter={false}
                />
            </div>
        </div>
    );
};