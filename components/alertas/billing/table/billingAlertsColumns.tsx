import { ColumnDef } from "@tanstack/react-table";
import { AlertConfig } from "@/interfaces/alertas";
import { Pencil, Trash2, Loader2 } from "lucide-react";

export const getBillingAlertsColumns = (
    handleEditClick: (alerta: AlertConfig) => void,
    handleDelete: (id: string) => void,
    isDeleting: string | null
): ColumnDef<AlertConfig>[] => [
    {
        accessorKey: "project_id",
        header: "Suscripción",
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
        cell: ({ row }) => <span className="font-bold text-gray-800">{row.original.service === 'all_services' ? 'Todos los Servicios' : row.original.service}</span>
    },
    {
        accessorKey: "threshold_amount",
        header: () => <div className="text-center">Límite</div>,
        cell: ({ row }) => (
            <div className="flex justify-end items-baseline gap-1">
                <span className="font-extrabold text-gray-900">
                    ${row.original.threshold_amount.toLocaleString()}
                </span>
                <span className="text-[10px] text-gray-400 font-bold uppercase">
                    {row.original.currency}
                </span>
            </div>
        )
    },
    {
        id: "estado",
        header: () => <div className="text-center">Estado del Mes</div>,
        cell: ({ row }) => {
            const a = row.original;
            const warnings = a.triggered_warnings_this_month || [];
            const isExceeded = warnings.includes(100);
            const hasWarnings = warnings.length > 0 && !isExceeded;

            return (
                <div className="flex flex-col items-center justify-center gap-1.5">
                    {isExceeded ? (
                        <span className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-[11px] font-bold border border-red-200 shadow-sm">
                            🚨 Límite Superado
                        </span>
                    ) : hasWarnings ? (
                        <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-[11px] font-bold border border-amber-200 shadow-sm">
                            ⚠️ Precaución {Math.max(...warnings.filter(w => w !== 100))}%
                        </span>
                    ) : (
                        <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[11px] font-bold border border-emerald-200 shadow-sm">
                            ✅ Óptimo
                        </span>
                    )}
                    {a.last_triggered && (isExceeded || hasWarnings) && (
                        <span className="text-[10px] text-gray-500 font-medium">
                            Notificado: {new Date(a.last_triggered).toLocaleDateString('es-CL')}
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
                <button onClick={() => handleEditClick(row.original)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(row.original._id!)} disabled={isDeleting === row.original._id} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    {isDeleting === row.original._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
            </div>
        )
    }
];