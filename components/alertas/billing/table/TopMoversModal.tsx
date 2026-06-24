import React from 'react';
import { X, AlertCircle, BarChart3, Loader2 } from 'lucide-react';

interface TopMover {
    recurso: string;
    sku: string;
    modelo_precio: string;
    gasto_usd: number;
    impacto_pct: number;
}

interface TopMoversModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: TopMover[];
    isLoading: boolean;
    gastoTotal?: number;
}

export const TopMoversModal = ({ isOpen, onClose, data, isLoading, gastoTotal }: TopMoversModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl border border-gray-200 overflow-hidden m-4 animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">Análisis de Causa Raíz</h3>
                            <p className="text-xs text-gray-500 font-medium">Recursos que generaron el exceso de presupuesto</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-3 text-gray-500">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                            <p className="text-sm font-medium">Extrayendo datos de facturación...</p>
                        </div>
                    ) : data && data.length > 0 ? (
                        <div className="overflow-x-auto rounded-xl border border-gray-200">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 py-3">Recurso</th>
                                        <th className="px-4 py-3">Servicio / SKU</th>
                                        <th className="px-4 py-3 text-right">Gasto ($)</th>
                                        <th className="px-4 py-3 text-right">Impacto</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {data.map((mover, idx) => (
                                        <tr key={idx} className="hover:bg-blue-50/50 transition-colors group">
                                            <td className="px-4 py-3 font-medium text-gray-800 max-w-[200px] truncate" title={mover.recurso}>
                                                {mover.recurso}
                                                <div className="text-[10px] text-gray-400 font-normal mt-0.5">{mover.modelo_precio}</div>
                                            </td>
                                            <td className="px-4 py-3 text-gray-600 text-xs">{mover.sku}</td>
                                            <td className="px-4 py-3 text-right font-semibold text-gray-800">
                                                ${mover.gasto_usd.toFixed(2)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-2">
                                                    <span className="font-bold text-red-600 text-xs w-10 text-right">
                                                        {mover.impacto_pct.toFixed(1)}%
                                                    </span>
                                                    <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                        <div 
                                                            className="h-full bg-red-500 rounded-full"
                                                            style={{ width: `${Math.min(mover.impacto_pct, 100)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-10 gap-2 text-gray-500">
                            <BarChart3 className="w-10 h-10 text-gray-300" />
                            <p className="text-sm font-medium">No se encontraron detalles de recursos para esta alerta.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};