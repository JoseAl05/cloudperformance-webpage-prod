import React from 'react';
import { Server } from 'lucide-react';
import { DataTableSingle } from "@/components/data-table/data-table-single";
import { LoaderComponent } from '@/components/general_alertas/LoaderComponent';
import { getBillingAlertsColumns } from './billingAlertsColumns';
import { AlertConfig } from '@/interfaces/alertas';

interface BillingAlertsTableProps {
    alertas: AlertConfig[];
    isFetching: boolean;
    handleEditClick: (alerta: AlertConfig) => void;
    handleDelete: (id: string) => void;
    isDeleting: string | null;
}

export const BillingAlertsTable = ({
    alertas,
    isFetching,
    handleEditClick,
    handleDelete,
    isDeleting
}: BillingAlertsTableProps) => {
    
    const columns = getBillingAlertsColumns(handleEditClick, handleDelete, isDeleting);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 min-h-[300px]">
            <div className="mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                    <Server className="h-5 w-5 text-blue-500" />
                    Historial de Alertas Configuradas
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    Reglas de monitoreo financiero activas para este entorno.
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