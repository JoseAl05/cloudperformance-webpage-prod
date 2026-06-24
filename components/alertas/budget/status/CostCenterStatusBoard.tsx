'use client';
import React, { useEffect, useState } from 'react';
import { Activity, Search, Loader2, AlertTriangle, CheckCircle2, Edit2, Trash2, Clock, Bell, ChevronLeft, ChevronRight, Filter, Maximize2, X } from 'lucide-react';
import { budgetAlertsService, BudgetStatus } from '@/lib/alertasBudget';
import { AlertHistoryModal } from './AlertHistoryModal';

export interface CostCenterConfig {
    _id: string;
    cost_center_id: string;
    client_id?: string; 
}

export interface CentroCosto {
    id_centro_costo: string;
    nombre_centro?: string;
}

export interface CostCenterProps {
    provider: string;
    configuraciones: CostCenterConfig[];
    centrosCosto: CentroCosto[];
    presupuestosMap: Record<string, number>;
}

interface BudgetStatusResponse extends BudgetStatus {
    id_regla: string;
}

export type AlertHistoryData = Record<string, unknown> | unknown[];

export const CostCenterStatusBoard = ({ provider, configuraciones, centrosCosto, presupuestosMap }: CostCenterProps) => {
    const [estados, setEstados] = useState<Record<string, BudgetStatus>>({});
    const [loading, setLoading] = useState<boolean>(true);
    
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false); 
    const [selectedHistory, setSelectedHistory] = useState<AlertHistoryData | null>(null);
    const [fetchingId, setFetchingId] = useState<string | null>(null);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false); 
    
    const [isFullDashboardOpen, setIsFullDashboardOpen] = useState<boolean>(false);

    const [activeFilter, setActiveFilter] = useState<'ALL' | 'PROBLEMAS' | 'EXCEDIDO' | 'PRECAUCION' | 'OPTIMO'>('ALL');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 6;

    useEffect(() => {
        const loadEstados = async () => {
            try {
                const res = await budgetAlertsService.getStatus(provider);
                const mapa = res.data.reduce((acc: Record<string, BudgetStatus>, curr: BudgetStatusResponse) => {
                    acc[curr.id_regla] = curr;
                    return acc;
                }, {});
                setEstados(mapa);
            } catch (e) { 
                console.error("Error cargando estados:", e instanceof Error ? e.message : e); 
            } finally { 
                setLoading(false); 
            }
        };
        loadEstados();
    }, [provider]);

    useEffect(() => {
        setCurrentPage(1);
    }, [activeFilter]);

    const handleViewDetails = async (id_regla: string) => {
        setIsNotificationsOpen(false);
        setFetchingId(id_regla);
        try {
            const data = await budgetAlertsService.getHistory(id_regla, provider);
            setSelectedHistory(data as AlertHistoryData);
            setIsModalOpen(true);
        } catch (e) { 
            alert("No hay historial disponible."); 
        } finally { 
            setFetchingId(null); 
        }
    };

    const formatearFecha = (fechaIso: string | null | undefined) => {
        if (!fechaIso) return '';
        const fecha = new Date(fechaIso);
        return new Intl.DateTimeFormat('es-CL', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(fecha);
    };

    const metricas = { total: configuraciones.length, problemas: 0, excedido: 0, precaucion: 0, optimo: 0 };
    configuraciones.forEach((cfg: CostCenterConfig) => {
        const est = estados[cfg._id]?.tipo_alerta || 'OPTIMO';
        if (est === 'EXCEDIDO') { metricas.excedido++; metricas.problemas++; }
        else if (est === 'PRECAUCION') { metricas.precaucion++; metricas.problemas++; }
        else { metricas.optimo++; }
    });

    const configsFiltradas = configuraciones.filter((cfg: CostCenterConfig) => {
        const est = estados[cfg._id]?.tipo_alerta || 'OPTIMO';
        if (activeFilter === 'ALL') return true;
        if (activeFilter === 'PROBLEMAS') return est !== 'OPTIMO';
        return est === activeFilter;
    }).sort((a: CostCenterConfig, b: CostCenterConfig) => {
        const estA = estados[a._id]?.tipo_alerta || 'OPTIMO';
        const estB = estados[b._id]?.tipo_alerta || 'OPTIMO';
        const prioridades: Record<string, number> = { 'EXCEDIDO': 1, 'PRECAUCION': 2, 'OPTIMO': 3 };
        return (prioridades[estA] || 3) - (prioridades[estB] || 3);
    });

    const alertasActivas = configuraciones.filter((cfg: CostCenterConfig) => estados[cfg._id] && estados[cfg._id].tipo_alerta !== 'OPTIMO')
        .sort((a: CostCenterConfig, b: CostCenterConfig) => (estados[a._id]?.tipo_alerta === 'EXCEDIDO' ? -1 : 1));
    
    const MAX_DROPDOWN_ITEMS = 5;
    const alertasEnDropdown = alertasActivas.slice(0, MAX_DROPDOWN_ITEMS);
    const alertasOcultas = metricas.problemas - MAX_DROPDOWN_ITEMS;

    const totalPages = Math.ceil(configsFiltradas.length / itemsPerPage);
    const paginatedConfiguraciones = configsFiltradas.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const renderTarjeta = (cfg: CostCenterConfig) => {
        const est = estados[cfg._id] || { tipo_alerta: 'OPTIMO' };
        const nombreCC = centrosCosto.find((c: CentroCosto) => c.id_centro_costo === cfg.cost_center_id)?.nombre_centro || "Área Desconocida";
        const presupuesto = presupuestosMap[cfg.cost_center_id] || 0;
        
        const cardTheme = est.tipo_alerta === 'EXCEDIDO' ? 'border-red-300 bg-white shadow-red-100/50' :
                          est.tipo_alerta === 'PRECAUCION' ? 'border-amber-300 bg-white shadow-amber-100/50' :
                          'border-slate-200 bg-white shadow-slate-100/50';

        return (
            <div key={cfg._id} className={`flex flex-col border-2 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${cardTheme} w-full`}>
                <div className="p-4 border-b border-slate-100/50 flex justify-between items-start bg-slate-50/30 rounded-t-xl">
                    <div>
                        <h3 className="font-bold text-slate-800 text-sm truncate max-w-[150px]" title={nombreCC}>{nombreCC}</h3>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {cfg.cost_center_id}</p>
                        {cfg.client_id && (
                            <p className="text-[10px] text-slate-500 font-mono mt-0.5">Cliente: {cfg.client_id}</p>
                        )}
                    </div>
                    {est.tipo_alerta === 'EXCEDIDO' ? (
                        <span className="flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded-md text-[9px] font-extrabold uppercase tracking-wider shrink-0"><AlertTriangle size={10} /> Superado</span>
                    ) : est.tipo_alerta === 'PRECAUCION' ? (
                        <span className="flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-1 rounded-md text-[9px] font-extrabold uppercase tracking-wider shrink-0"><Activity size={10} /> Riesgo</span>
                    ) : (
                        <span className="flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md text-[9px] font-extrabold uppercase tracking-wider shrink-0"><CheckCircle2 size={10} /> Óptimo</span>
                    )}
                </div>
                <div className="p-4 flex-grow">
                    <div className="flex items-baseline gap-1 mb-3">
                        <span className="text-slate-400 font-medium text-xs">$</span>
                        <span className="font-extrabold text-slate-800 text-xl">{presupuesto.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                    {est.tipo_alerta !== 'OPTIMO' && (
                        <div className={`p-2.5 rounded-lg border ${est.tipo_alerta === 'EXCEDIDO' ? 'bg-red-50/50 border-red-200' : 'bg-amber-50/50 border-amber-200'}`}>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[11px] font-bold text-slate-700">Consumo:</span>
                                <span className={`text-[11px] font-black ${est.tipo_alerta === 'EXCEDIDO' ? 'text-red-600' : 'text-amber-600'}`}>
                                    {est.porcentaje_actual ? `${est.porcentaje_actual}%` : '+100%'}
                                </span>
                            </div>
                            {est.timestamp && (
                                <div className="flex items-center gap-1 text-[9px] text-slate-500 font-medium">
                                    <Clock size={10} /><span>{formatearFecha(est.timestamp)}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div className="p-3 border-t border-slate-100/50 bg-slate-50/50 rounded-b-2xl flex justify-between items-center">
                    <div className="flex gap-1">
                        <button className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-md transition-colors"><Edit2 size={14} /></button>
                        <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-100 rounded-md transition-colors"><Trash2 size={14} /></button>
                    </div>
                    <button onClick={() => handleViewDetails(cfg._id)} className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] font-bold transition-all shadow-sm ${est.tipo_alerta !== 'OPTIMO' ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                        {fetchingId === cfg._id ? <Loader2 className="animate-spin w-3.5 h-3.5"/> : <Search className="w-3.5 h-3.5"/>}
                        {est.tipo_alerta !== 'OPTIMO' ? 'Ver detalles' : 'Historial'}
                    </button>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="w-full mb-6 bg-white rounded-2xl border border-slate-200 p-8 flex flex-col items-center justify-center shadow-sm">
                <Loader2 className="w-8 h-8 text-teal-500 animate-spin mb-3" />
                <p className="text-sm font-bold text-slate-600">Cargando estados del presupuesto...</p>
            </div>
        );
    }

    return (
        <div className="w-full mb-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${metricas.problemas > 0 ? 'bg-amber-50 text-amber-500' : 'bg-teal-50 text-teal-500'}`}>
                        {metricas.problemas > 0 ? <AlertTriangle className="w-6 h-6" /> : <Activity className="w-6 h-6" />}
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-slate-800">Monitoreo de Presupuestos</h2>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-medium text-slate-500">{metricas.total} Reglas Activas</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                            <span className={`text-xs font-bold ${metricas.problemas > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                                {metricas.problemas > 0 ? `${metricas.problemas} Alertas detectadas` : 'Todo óptimo'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setIsFullDashboardOpen(true)}
                        className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-xl hover:bg-slate-700 transition-colors shadow-sm"
                    >
                        <Maximize2 size={14} />
                        Ver Tablero Detallado
                    </button>

                    <div className="relative">
                        <button 
                            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                            className={`relative p-2.5 rounded-xl border transition-all ${isNotificationsOpen ? 'bg-slate-100 border-slate-300' : 'bg-white border-slate-200 hover:bg-slate-50'} shadow-sm`}
                        >
                            <Bell size={18} className="text-slate-600" />
                            {metricas.problemas > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                                    {metricas.problemas > 99 ? '99+' : metricas.problemas}
                                </span>
                            )}
                        </button>

                        {isNotificationsOpen && (
                            <>
                                <div className="fixed inset-0 z-30" onClick={() => setIsNotificationsOpen(false)}></div>
                                <div className="absolute top-full right-0 mt-3 w-[340px] bg-white border border-slate-200 rounded-2xl shadow-xl z-40 overflow-hidden">
                                    <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex justify-between items-center shadow-sm z-10 relative">
                                        <h3 className="font-bold text-slate-800 text-sm">Alertas Recientes</h3>
                                    </div>
                                    <div className="max-h-[300px] overflow-y-auto">
                                        {metricas.problemas === 0 ? (
                                            <div className="text-center py-8">
                                                <CheckCircle2 size={24} className="text-emerald-400 mx-auto mb-2" />
                                                <p className="text-xs text-slate-500">No hay alertas activas.</p>
                                            </div>
                                        ) : (
                                            <div className="divide-y divide-slate-50">
                                                {alertasEnDropdown.map((cfg: CostCenterConfig) => {
                                                    const est = estados[cfg._id];
                                                    const isExcedido = est?.tipo_alerta === 'EXCEDIDO';
                                                    const nombreCC = centrosCosto.find((c: CentroCosto) => c.id_centro_costo === cfg.cost_center_id)?.nombre_centro || "Área Desconocida";
                                                    return (
                                                        <div key={cfg._id} onClick={() => handleViewDetails(cfg._id)} className="p-3 hover:bg-slate-50 cursor-pointer flex justify-between items-center group transition-colors">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-2 h-2 rounded-full shrink-0 ${isExcedido ? 'bg-red-500' : 'bg-amber-500'}`}></div>
                                                                <div>
                                                                    <p className="text-xs font-bold text-slate-800 truncate w-[180px]">{nombreCC}</p>
                                                                    <p className="text-[10px] text-slate-400">{formatearFecha(est?.timestamp)}</p>
                                                                </div>
                                                            </div>
                                                            <button className="text-[10px] font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">RCA &rarr;</button>
                                                        </div>
                                                    );
                                                })}
                                                {alertasOcultas > 0 && (
                                                    <div className="p-2 text-center bg-slate-50 border-t border-slate-100">
                                                        <span className="text-[10px] font-bold text-slate-500">+{alertasOcultas} alertas sin mostrar</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {metricas.problemas > 0 && (
                                            <div className="p-3 bg-slate-50 border-t border-slate-100">
                                                <button 
                                                    onClick={() => {
                                                        setActiveFilter('PROBLEMAS');
                                                        setIsNotificationsOpen(false);
                                                        setIsFullDashboardOpen(true);
                                                    }}
                                                    className="w-full text-xs font-bold text-slate-700 bg-white border border-slate-200 py-2 rounded-lg hover:bg-slate-100 transition-colors shadow-sm"
                                                >
                                                    Ver panel detallado
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {isFullDashboardOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6">
                    <div className="bg-white rounded-3xl w-full max-w-6xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        
                        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    <Activity className="text-teal-500 w-5 h-5" /> 
                                    Tablero Detallado de Presupuestos
                                </h2>
                                <p className="text-xs text-slate-500 mt-1">Estado de alertas para {provider.toUpperCase()}</p>
                            </div>
                            <button onClick={() => setIsFullDashboardOpen(false)} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto bg-slate-50/30 flex-grow">
                            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                                <div className="flex items-center justify-center p-2 bg-slate-100 text-slate-400 rounded-lg mr-2 shrink-0"><Filter size={16} /></div>
                                <button onClick={() => setActiveFilter('ALL')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${activeFilter === 'ALL' ? 'bg-slate-800 text-white border-slate-800 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
                                    Todas <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${activeFilter === 'ALL' ? 'bg-white/20' : 'bg-slate-100'}`}>{metricas.total}</span>
                                </button>
                                <button onClick={() => setActiveFilter('PROBLEMAS')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${activeFilter === 'PROBLEMAS' ? 'bg-slate-800 text-white border-slate-800 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
                                    Con Problemas <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${activeFilter === 'PROBLEMAS' ? 'bg-white/20' : 'bg-slate-100'}`}>{metricas.problemas}</span>
                                </button>
                                <button onClick={() => setActiveFilter('EXCEDIDO')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${activeFilter === 'EXCEDIDO' ? 'bg-red-600 text-white border-red-600 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:bg-red-50 hover:text-red-700'}`}>
                                    Superadas <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${activeFilter === 'EXCEDIDO' ? 'bg-white/20' : 'bg-slate-100'}`}>{metricas.excedido}</span>
                                </button>
                                <button onClick={() => setActiveFilter('OPTIMO')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${activeFilter === 'OPTIMO' ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700'}`}>
                                    Óptimas <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${activeFilter === 'OPTIMO' ? 'bg-white/20' : 'bg-slate-100'}`}>{metricas.optimo}</span>
                                </button>
                            </div>

                            {configsFiltradas.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 bg-white border border-slate-200 border-dashed rounded-2xl">
                                    <Search className="w-10 h-10 text-slate-300 mb-3" />
                                    <h3 className="text-sm font-bold text-slate-700">No hay reglas en este estado</h3>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {paginatedConfiguraciones.map((cfg: CostCenterConfig) => renderTarjeta(cfg))}
                                </div>
                            )}

                            {totalPages > 1 && (
                                <div className="mt-8 flex justify-between items-center border-t border-slate-200 pt-6">
                                    <span className="text-xs font-medium text-slate-500">Mostrando {(currentPage - 1) * itemsPerPage + 1} a {Math.min(currentPage * itemsPerPage, configsFiltradas.length)} de {configsFiltradas.length} reglas</span>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"><ChevronLeft size={16} /></button>
                                        <span className="text-xs font-bold text-slate-700 px-2">{currentPage} / {totalPages}</span>
                                        <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"><ChevronRight size={16} /></button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="relative z-[60]">
                <AlertHistoryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} data={selectedHistory} />
            </div>
        </div>
    );
};