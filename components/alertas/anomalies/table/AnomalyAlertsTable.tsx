import React from 'react';
import { Activity } from 'lucide-react';
import { DataTableSingle } from "@/components/data-table/data-table-single";
import { LoaderComponent } from '@/components/general_alertas/LoaderComponent';
import { getAnomalyAlertsColumns } from './anomalyAlertsColumns';
import { AnomalyConfig } from '@/interfaces/anomalias';

interface AnomalyAlertsTableProps {
    alertas: AnomalyConfig[];
    isFetching: boolean;
    handleEditClick: (alerta: AnomalyConfig) => void;
    handleDelete: (id: string) => void;
    isDeleting: string | null;
}

export const AnomalyAlertsTable = ({
    alertas,
    isFetching,
    handleEditClick,
    handleDelete,
    isDeleting
}: AnomalyAlertsTableProps) => {
    
    const columns = getAnomalyAlertsColumns(handleEditClick, handleDelete, isDeleting);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 min-h-[300px]">
            <div className="mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                    <Activity className="h-5 w-5 text-purple-500" />
                    Historial de Detectores Activos
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    Reglas de monitoreo de alzas inusuales para este entorno.
                </p>
            </div>

            {isFetching ? (
                <div className="flex items-center justify-center py-12">
                    <LoaderComponent />
                </div>
            ) : (
                <DataTableSingle 
                    columns={columns} 
                    data={alertas} 
                    filterColumn="service" 
                    filterPlaceholder="Buscar por servicio..."
                    initialPageSize={10}    
                />
            )}
        </div>
    );
};