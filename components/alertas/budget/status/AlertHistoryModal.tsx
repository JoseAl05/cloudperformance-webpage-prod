import React from 'react';
import { X, AlertTriangle, Activity, CheckCircle2, Clock, MapPin, FolderTree, Layers, CreditCard } from 'lucide-react';

export interface TopMover {
    recurso: string;
    sku: string;
    modelo_precio?: string;
    categoria_servicio?: string;
    grupo_recurso?: string;
    ubicacion?: string;
    suscripcion?: string;
    gasto_usd?: number;
    impacto_pct?: number;
}

export interface HistoryEventData {
    tipo_alerta?: 'EXCEDIDO' | 'PRECAUCION' | 'OPTIMO' | string;
    porcentaje_alcanzado?: number;
    gasto_real_mes?: number;
    threshold_amount?: number;
    timestamp?: string | Date;
    top_movers?: TopMover[];
}


export interface AlertHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: HistoryEventData | HistoryEventData[] | null;
}

export const AlertHistoryModal = ({ isOpen, onClose, data }: AlertHistoryModalProps) => {
    if (!isOpen || !data) return null;


    const historyEvent = Array.isArray(data) ? data[0] : data;


    if (!historyEvent || Object.keys(historyEvent).length === 0) {
        return (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                <div className="bg-white rounded-2xl p-6 w-full max-w-md text-center shadow-2xl">
                    <p className="text-slate-500">No hay detalles disponibles para esta alerta.</p>
                    <button onClick={onClose} className="mt-4 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold">Cerrar</button>
                </div>
            </div>
        );
    }

    const { tipo_alerta, porcentaje_alcanzado, gasto_real_mes, threshold_amount, top_movers, timestamp } = historyEvent;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white z-10">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Causa Raíz de Alerta</h2>
                        {timestamp && (
                            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                <Clock size={12} /> Detectado el {new Date(timestamp).toLocaleString('es-CL')}
                            </p>
                        )}
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto bg-slate-50/50 flex-grow">
                    
                    <div className={`mb-6 p-4 rounded-xl border flex justify-between items-center bg-white shadow-sm
                        ${tipo_alerta === 'EXCEDIDO' ? 'border-red-200' : 'border-amber-200'}`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${tipo_alerta === 'EXCEDIDO' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                                {tipo_alerta === 'EXCEDIDO' ? <AlertTriangle size={24} /> : <Activity size={24} />}
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Límite {tipo_alerta === 'EXCEDIDO' ? 'Superado' : 'en Riesgo'}</p>
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-xl font-black text-slate-800">${(gasto_real_mes ?? 0).toFixed(2)}</span>
                                    <span className="text-xs text-slate-400 font-medium">de ${(threshold_amount ?? 0).toFixed(2)} USD</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className={`text-2xl font-black ${tipo_alerta === 'EXCEDIDO' ? 'text-red-600' : 'text-amber-600'}`}>
                                {porcentaje_alcanzado ?? 0}%
                            </span>
                            <p className="text-[10px] font-bold text-slate-400">DEL PRESUPUESTO</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-slate-800 mb-3 px-1">Principales Generadores de Gasto</h3>
                        
                        {(!top_movers || top_movers.length === 0) ? (
                            <div className="text-center py-8 bg-white rounded-xl border border-slate-200 border-dashed">
                                <CheckCircle2 size={32} className="text-emerald-400 mx-auto mb-2" />
                                <p className="text-sm font-bold text-slate-700">No se detectaron recursos específicos.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {top_movers.map((mover: TopMover, idx: number) => (
                                    <div key={idx} className="flex justify-between items-start p-4 border border-slate-200 rounded-xl bg-white shadow-sm hover:border-slate-300 transition-colors">
                                        
                                        <div className="flex-1 pr-4">
                                            <h4 className="font-bold text-slate-800 text-sm">{mover.recurso}</h4>
                                            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1" title={mover.sku}>
                                                {mover.sku} {mover.modelo_precio && <span className="text-[10px] bg-slate-100 px-1.5 rounded ml-1">{mover.modelo_precio}</span>}
                                            </p>

                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {mover.categoria_servicio && mover.categoria_servicio !== "N/A" && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-100/50" title="Categoría del Servicio">
                                                        <Layers size={10} /> {mover.categoria_servicio}
                                                    </span>
                                                )}
                                                {mover.grupo_recurso && mover.grupo_recurso !== "N/A" && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium border border-slate-200/50" title="Grupo de Recursos">
                                                        <FolderTree size={10} /> {mover.grupo_recurso}
                                                    </span>
                                                )}
                                                {mover.ubicacion && mover.ubicacion !== "N/A" && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium border border-slate-200/50" title="Región">
                                                        <MapPin size={10} /> {mover.ubicacion}
                                                    </span>
                                                )}
                                                {mover.suscripcion && mover.suscripcion !== "N/A" && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium border border-slate-200/50" title="Suscripción">
                                                        <CreditCard size={10} /> {mover.suscripcion}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="text-right shrink-0 min-w-[80px]">
                                            <p className="text-sm font-black text-emerald-600">
                                                ${(mover.gasto_usd ?? 0).toFixed(2)}
                                            </p>
                                            <div className="mt-1.5 flex items-center justify-end gap-1.5" title={`${(mover.impacto_pct ?? 0).toFixed(1)}% del gasto total de esta área`}>
                                                <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div 
                                                        className="h-full bg-slate-400 rounded-full" 
                                                        style={{ width: `${Math.min(mover.impacto_pct ?? 0, 100)}%` }} 
                                                    />
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-500">
                                                    {(mover.impacto_pct ?? 0).toFixed(0)}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};