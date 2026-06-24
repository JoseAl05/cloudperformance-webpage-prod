import React, { useState } from 'react';
import { Activity } from 'lucide-react';
import { DataTableSingle } from "@/components/data-table/data-table-single";
import { LoaderComponent } from '@/components/general_alertas/LoaderComponent';
import { getAnomalyAlertsColumns } from './anomalyAlertsColumns';
import { AnomalyConfig } from '@/interfaces/anomalias';
import { AnomalyTopMoversModal } from './AnomalyTopMoversModal'; 
import { alertasAnomaliasService } from '@/lib/alertasAnomaliasService';

export interface AnomalyAlertsTableProps {
    alertas: AnomalyConfig[];
    isFetching: boolean;
    handleEditClick: (alerta: AnomalyConfig) => void;
    handleDelete: (id: string) => void;
    isDeleting: string | null;
}

export interface AnomalyHistoryResponse {
    top_movers?: Record<string, unknown>[];
    [key: string]: unknown;
}

export const AnomalyAlertsTable = ({
    alertas,
    isFetching,
    handleEditClick,
    handleDelete,
    isDeleting
}: AnomalyAlertsTableProps) => {
    
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isLoadingDetails, setIsLoadingDetails] = useState<boolean>(false);
    const [topMoversData, setTopMoversData] = useState<Record<string, unknown>[]>([]);

    const handleInspectAlert = async (alertaId: string, cloudProvider: string) => {
        setIsModalOpen(true);
        setIsLoadingDetails(true);
        setTopMoversData([]); 

        try {
            const response = await alertasAnomaliasService.getHistorialAnomalia(alertaId, cloudProvider);
            const data = response as AnomalyHistoryResponse;
            
            setTopMoversData(data.top_movers || []);
        } catch (error) {
            console.error("Error obteniendo el detalle de varianza de la anomalía:", error instanceof Error ? error.message : String(error));
        } finally {
            setIsLoadingDetails(false);
        }
    };

    const columns = getAnomalyAlertsColumns(handleEditClick, handleDelete, isDeleting, handleInspectAlert);

    return (
        <>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 min-h-[300px]">
                <div className="mb-6">
                    <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800">
                        <Activity className="h-5 w-5 text-purple-500" />
                        Historial de Detectores Activos
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Reglas de monitoreo de alzas inusuales (peaks) para este entorno.
                    </p>
                </div>

                {isFetching ? (
                    <div className="flex items-center justify-center py-12 bg-slate-50/50 rounded-xl border border-slate-100 border-dashed">
                        <LoaderComponent />
                    </div>
                ) : (
                    <DataTableSingle 
                        columns={columns} 
                        data={alertas} 
                        filterColumn="service" 
                        filterPlaceholder="Buscar por servicio evaluado..."
                        initialPageSize={10}    
                    />
                )}
            </div>

            <AnomalyTopMoversModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                data={topMoversData}
                isLoading={isLoadingDetails}
            />
        </>
    );
};