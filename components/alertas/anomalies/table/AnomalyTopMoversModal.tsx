import React from 'react';
import { X, TrendingUp, BarChart3, Loader2 } from 'lucide-react';

export interface AnomalyTopMover {
    recurso?: string;
    sku?: string;
    modelo_precio?: string;
    gasto_promedio_historico?: number;
    gasto_ayer?: number;
    variacion_usd?: number;
    impacto_pct?: number;
}

export interface AnomalyTopMoversModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: AnomalyTopMover[] | Record<string, unknown>[];
    isLoading: boolean;
}

export const AnomalyTopMoversModal = ({ isOpen, onClose, data, isLoading }: AnomalyTopMoversModalProps) => {
    if (!isOpen) return null;

    const moversData = data as AnomalyTopMover[];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl shadow-sm">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Causa Raíz del Peak de Consumo</h3>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">Recursos con mayor variación respecto a su promedio histórico</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto bg-white flex-grow">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-500">
                            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                            <p className="text-sm font-bold">Calculando varianza de recursos...</p>
                        </div>
                    ) : moversData && moversData.length > 0 ? (
                        <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="px-5 py-4">Recurso y Servicio</th>
                                        <th className="px-5 py-4 text-right">Promedio Diario</th>
                                        <th className="px-5 py-4 text-right">Consumo Ayer</th>
                                        <th className="px-5 py-4 text-right">Salto (Delta)</th>
                                        <th className="px-5 py-4 text-right">Impacto</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {moversData.map((mover, idx) => (
                                        <tr key={idx} className="hover:bg-purple-50/30 transition-colors group">
                                            <td className="px-5 py-4">
                                                <div className="font-bold text-slate-800 max-w-[250px] truncate" title={mover.recurso || "Recurso Desconocido"}>
                                                    {mover.recurso || "N/A"}
                                                </div>
                                                <div className="text-[11px] text-slate-500 font-medium mt-1 flex items-center gap-1.5">
                                                    <span className="truncate max-w-[150px]" title={mover.sku || "SKU Desconocido"}>
                                                        {mover.sku || "N/A"}
                                                    </span>
                                                    {mover.modelo_precio && (
                                                        <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider">
                                                            {mover.modelo_precio}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            
                                            <td className="px-5 py-4 text-right font-medium text-slate-500">
                                                ${(mover.gasto_promedio_historico ?? 0).toFixed(2)}
                                            </td>
                                            
                                            <td className="px-5 py-4 text-right font-bold text-slate-800">
                                                ${(mover.gasto_ayer ?? 0).toFixed(2)}
                                            </td>
                                            
                                            <td className="px-5 py-4 text-right">
                                                <span className="inline-flex items-center gap-1 font-black text-purple-600 bg-purple-50 px-2 py-1 rounded-lg text-xs">
                                                    +${(mover.variacion_usd ?? 0).toFixed(2)}
                                                </span>
                                            </td>
                                            
                                            <td className="px-5 py-4">
                                                <div className="flex items-center justify-end gap-2.5">
                                                    <span className="font-bold text-slate-600 text-xs w-10 text-right">
                                                        {(mover.impacto_pct ?? 0).toFixed(1)}%
                                                    </span>
                                                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                        <div 
                                                            className="h-full bg-purple-500 rounded-full"
                                                            style={{ width: `${Math.min(mover.impacto_pct ?? 0, 100)}%` }}
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
                        <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-500 bg-slate-50/50 rounded-xl border border-slate-200 border-dashed">
                            <BarChart3 className="w-12 h-12 text-slate-300" />
                            <p className="text-sm font-bold text-slate-600">El detalle de recursos no está disponible para este evento.</p>
                            <p className="text-xs text-slate-400">Es posible que este registro sea antiguo y no cuente con RCA profundo.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};