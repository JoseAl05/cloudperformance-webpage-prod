import { ColumnDef } from "@tanstack/react-table";
import { AnomalyConfig } from "@/interfaces/anomalias";
import { Pencil, Trash2, Loader2 } from "lucide-react";

export const getAnomalyAlertsColumns = (
    handleEditClick: (alerta: AnomalyConfig) => void,
    handleDelete: (id: string) => void,
    isDeleting: string | null,
    onInspectAlert: (alertaId: string, cloudProvider: string) => void
): ColumnDef<AnomalyConfig>[] => [
    {
        accessorKey: "project_id",
        header: "Suscripción / Proyecto",
        cell: ({ row }) => {
            const val = row.original.project_id;
            if (val === 'all_projects') {
                return <span className="font-mono text-xs font-semibold text-gray-500">Todas las Suscripciones</span>;
            }
            return (
                <span className="font-mono text-[11px] font-semibold text-gray-600 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                    {val}
                </span>
            );
        }
    },
    {
        accessorKey: "service",
        header: "Servicio",
        cell: ({ row }) => (
            <span className="font-bold text-gray-800">
                {row.original.service === 'all_services' ? 'Todos los Servicios' : row.original.service}
            </span>
        )
    },
    {
        accessorKey: "sensitivity_percentage",
        header: () => <div className="text-center">Sensibilidad</div>,
        cell: ({ row }) => (
            <div className="flex justify-center">
                <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-100 font-bold text-gray-700 text-xs border border-gray-200">
                    &gt; {row.original.sensitivity_percentage}%
                </span>
            </div>
        )
    },
    {
        accessorKey: "comparison_period",
        header: () => <div className="text-center">Período Base</div>,
        cell: ({ row }) => {
            const period = row.original.comparison_period;
            const label = 
                period === '7d' ? 'Últimos 7 días' : 
                period === '15d' ? 'Últimos 15 días' : 
                period === '30d' ? 'Últimos 30 días' : 'Día Anterior';
                
            return <div className="text-center text-xs font-medium text-gray-500">{label}</div>;
        }
    },
    {
        id: "estado",
        header: () => <div className="text-center">Estado</div>,
        cell: ({ row }) => {
            const a = row.original;
            const isSpike = a.status === "spike_detected";

            return (
                <div className="flex flex-col items-center justify-center gap-1.5">
                    {isSpike ? (
                        <button 
                            onClick={() => {
                                if (a._id && a.cloud_provider) {
                                    onInspectAlert(a._id, a.cloud_provider);
                                }
                            }}
                            className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-[11px] font-bold border border-purple-200 shadow-sm hover:bg-purple-100 transition-colors flex items-center gap-1 cursor-pointer"
                            title="Ver Causa Raíz de la Anomalía"
                        >
                            📈 Variación Detectada <span className="text-[10px] opacity-70 underline ml-1">Ver detalle</span>
                        </button>
                    ) : (
                        <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[11px] font-bold border border-emerald-200 shadow-sm">
                            ✅ Normal
                        </span>
                    )}
                    
                    {a.last_triggered && isSpike && (
                        <span className="text-[10px] text-gray-500 font-medium">
                            Detectado: {new Date(a.last_triggered).toLocaleDateString('es-CL')}
                        </span>
                    )}
                </div>
            );
        }
    },
    {
        id: "acciones",
        header: () => <div className="text-center">Acciones</div>,
        cell: ({ row }) => (
            <div className="flex items-center justify-center gap-1">
                <button 
                    onClick={() => handleEditClick(row.original)} 
                    className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    title="Editar Regla"
                >
                    <Pencil className="w-4 h-4" />
                </button>
                <button 
                    onClick={() => {
                        if (row.original._id) handleDelete(row.original._id);
                    }} 
                    disabled={isDeleting === row.original._id} 
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Eliminar Regla"
                >
                    {isDeleting === row.original._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
            </div>
        )
    }
];