import React, { useState } from 'react';
import { Save, BellRing, Mail, Sparkles, User, Users, X, Loader2, CheckCircle2, Info, Settings, Building2, DollarSign, Database } from 'lucide-react';
import { BudgetAlertConfig, CostCenter } from '@/lib/alertasBudget';

interface CostCenterBudgetFormProps {
    config: BudgetAlertConfig;
    centrosCosto: CostCenter[];
    selectedCostCenterId: number;
    onCostCenterChange: (id: number) => void;
    setConfig: (config: BudgetAlertConfig) => void;
    handleSubmit: (e: React.FormEvent) => void;
    isSaving: boolean;
    currentUserEmail?: string;
    companyEmails: string[];
    feedbackMsg: { text: string; type: 'success' | 'info' | 'error' } | null;
    presupuestoActual: number;
}

export const CostCenterBudgetForm = ({
    config, 
    centrosCosto,
    selectedCostCenterId,
    onCostCenterChange,
    setConfig, 
    handleSubmit, 
    isSaving, 
    currentUserEmail, 
    companyEmails, 
    feedbackMsg,
    presupuestoActual
}: CostCenterBudgetFormProps) => {

    const [currentEmail, setCurrentEmail] = useState<string>('');
    const warningsDisponibles: number[] = [50, 60, 70, 80, 90, 100];

    const puedeActivar = selectedCostCenterId !== 0 && presupuestoActual > 0;

    const fechaActual = new Date();
    const mes = fechaActual.toLocaleString('es-CL', { month: 'long' });
    const anio = fechaActual.getFullYear();
    const periodoActual = `${mes} ${anio}`.toUpperCase();

    const handleEmailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (['Enter', ',', ' '].includes(e.key)) {
            e.preventDefault();
            const newEmail = currentEmail.trim().toLowerCase();
            if (newEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail) && !config.alert_emails.includes(newEmail)) {
                setConfig({ ...config, alert_emails: [...config.alert_emails, newEmail] });
            }
            setCurrentEmail('');
        } else if (e.key === 'Backspace' && currentEmail === '' && config.alert_emails.length > 0) {
            setConfig({ ...config, alert_emails: config.alert_emails.slice(0, -1) });
        }
    };

    const removeEmail = (emailToRemove: string) => {
        setConfig({ ...config, alert_emails: config.alert_emails.filter(e => e !== emailToRemove) });
    };

    const addQuickEmails = (emails: string[]) => {
        const newEmails = emails.filter(email => !config.alert_emails.includes(email));
        setConfig({ ...config, alert_emails: [...config.alert_emails, ...newEmails] });
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onCostCenterChange(Number(e.target.value));
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md">
            
            <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-8 py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="p-2.5 bg-teal-50 rounded-xl border border-teal-100 text-teal-600">
                        <Settings className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-extrabold text-gray-800">
                            Regla de Monitoreo por Área (CC)
                        </h3>
                        {!puedeActivar && selectedCostCenterId !== 0 ? (
                            <p className="text-[11px] text-amber-600 font-bold mt-0.5 flex items-center gap-1">
                                <Info size={12} /> Esta área requiere presupuesto asignado para activar alertas.
                            </p>
                        ) : (
                            <p className="text-xs text-gray-500 font-medium mt-0.5">
                                Configura notificaciones específicas para cada unidad de negocio.
                            </p>
                        )}
                    </div>
                </div>

                <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border transition-all ${
                    puedeActivar ? 'bg-white border-gray-200 shadow-sm' : 'bg-gray-50 border-gray-100 opacity-60'
                }`}>
                    <span className="text-sm font-bold text-gray-700">
                        {config.is_active ? 'Monitoreo Activo' : 'Monitoreo Desactivado'}
                    </span>
                    <label className={`relative inline-flex items-center ${puedeActivar ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
                        <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={config.is_active}
                            disabled={!puedeActivar}
                            onChange={(e) => setConfig({...config, is_active: e.target.checked})}
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                    </label>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
                
                <div className="mb-8 p-6 bg-slate-50/50 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex items-center gap-3 w-full">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                            <Building2 className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <label className="block text-[13px] font-bold text-gray-700 mb-1">
                                Centro de Costo
                            </label>
                            {centrosCosto.length === 0 ? (
                                <p className="text-sm font-medium text-red-500 bg-red-50 p-2 rounded-lg border border-red-100 w-fit">
                                    No hay Centros de Costo registrados para este cliente.
                                </p>
                            ) : (
                                <select 
                                    value={selectedCostCenterId}
                                    onChange={handleSelectChange}
                                    className="w-full md:w-96 h-10 px-3 bg-white border border-gray-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all shadow-sm"
                                >
                                    <option value={0} disabled>Seleccione un área de la organización...</option>
                                    {centrosCosto.map(cc => (
                                        <option key={cc.id_centro_costo} value={cc.id_centro_costo}>
                                            {cc.nombre_centro} (ID: {cc.id_centro_costo})
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                    </div>
                </div>

                {selectedCostCenterId !== 0 && (
                    <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <p className="text-sm font-semibold text-gray-500 flex items-center gap-2">
                                        Presupuesto asignado
                                        <span className="px-2 py-0.5 bg-gray-100 border border-gray-200 text-gray-600 rounded-md text-[10px] uppercase tracking-wider font-bold">
                                            {periodoActual}
                                        </span>
                                    </p>
                                    <h3 className="text-3xl font-bold text-gray-900 mt-2">
                                        ${presupuestoActual.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </h3>
                                    {presupuestoActual === 0 && (
                                        <p className="text-xs text-amber-600 font-bold mt-2 flex items-center gap-1">
                                            <Info size={14} /> Sin presupuesto asignado para el mes actual.
                                        </p>
                                    )}
                                </div>
                                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                                    <DollarSign className="w-6 h-6" />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-medium text-gray-500 bg-gray-50 p-2 rounded-lg mt-2 w-max">
                                <Database className="w-3 h-3" /> Sincronizado desde modulo de Presupuesto.
                            </div>
                        </div>
                    </div>
                )}

                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 transition-opacity duration-300 ${(!config.is_active || !puedeActivar) ? 'opacity-40 pointer-events-none' : ''}`}>
                    
                    <div className="flex flex-col gap-3">
                        <label className="flex items-center gap-2 text-[13px] font-bold text-gray-700">
                            <BellRing className="w-4 h-4 text-teal-500" /> Alertas Preventivas
                        </label>
                        <p className="text-[11px] text-gray-500 font-semibold mb-1">
                            Selecciona en qué porcentajes del límite de esta área deseas recibir notificaciones.
                        </p>
                        
                        <div className="flex flex-wrap gap-2">
                            {warningsDisponibles.map(pct => (
                                <button
                                    key={pct} 
                                    type="button"
                                    onClick={() => {
                                        const newPcts = config.warning_percentages.includes(pct)
                                            ? config.warning_percentages.filter(p => p !== pct)
                                            : [...config.warning_percentages, pct].sort((a,b) => a-b);
                                        setConfig({...config, warning_percentages: newPcts});
                                    }}
                                    className={`px-4 py-2 rounded-xl font-bold text-xs transition-all border ${
                                        config.warning_percentages.includes(pct) 
                                        ? 'bg-teal-50 border-teal-200 text-teal-700 shadow-sm scale-105 transform' 
                                        : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300'
                                    }`}
                                >
                                    {pct}%
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-100">
                        <div className="flex flex-col gap-2.5">
                            <label className="flex items-center gap-2 text-[13px] font-bold text-gray-700">
                                <Mail className="w-4 h-4 text-teal-500" /> Destinatarios de la Alerta
                            </label>
                            
                            <div 
                                className="flex flex-wrap items-center gap-2 min-h-[44px] p-2 border border-gray-200 rounded-xl bg-white shadow-sm focus-within:ring-2 focus-within:ring-teal-500/20 focus-within:border-teal-500 transition-all cursor-text"
                                onClick={() => document.getElementById('cc-budget-email-field')?.focus()}
                            >
                                {config.alert_emails.map(email => (
                                    <span key={email} className="flex items-center gap-1.5 px-3 py-1 bg-teal-50 text-teal-700 text-xs font-bold rounded-lg border border-teal-100 animate-in zoom-in-95 duration-200">
                                        {email}
                                        <X size={14} className="cursor-pointer hover:text-teal-900 transition-colors" onClick={() => removeEmail(email)} />
                                    </span>
                                ))}
                                <input 
                                    id="cc-budget-email-field"
                                    type="email" 
                                    value={currentEmail} 
                                    onChange={(e) => setCurrentEmail(e.target.value)}
                                    onKeyDown={handleEmailKeyDown}
                                    placeholder={config.alert_emails.length === 0 ? "Escribe un correo y presiona Enter..." : "Agregar otro..."} 
                                    className="flex-1 min-w-[180px] h-7 bg-transparent outline-none text-sm text-gray-800 px-2"
                                />
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 flex items-center gap-1 mr-1">
                                    <Sparkles className="w-3 h-3" /> Sugerencias:
                                </span>
                                
                                {currentUserEmail && !config.alert_emails.includes(currentUserEmail) && (
                                    <button 
                                        type="button" 
                                        onClick={() => addQuickEmails([currentUserEmail])}
                                        className="flex items-center gap-1 text-[11px] font-bold text-teal-600 hover:text-teal-800 hover:bg-teal-50 px-2 py-1 rounded-lg border border-transparent hover:border-teal-100 transition-all"
                                    >
                                        <User className="w-3 h-3" /> Mi Correo
                                    </button>
                                )}

                                {companyEmails && companyEmails.length > 0 && (
                                    <button 
                                        type="button" 
                                        onClick={() => addQuickEmails(companyEmails)}
                                        className="flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 px-2 py-1 rounded-lg border border-transparent hover:border-slate-200 transition-all"
                                    >
                                        <Users className="w-3 h-3" /> Equipo
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-end gap-4">
                    
                    {feedbackMsg && (
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold animate-in fade-in slide-in-from-right-4 duration-300 ${
                            feedbackMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 
                            feedbackMsg.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
                            'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}>
                            {feedbackMsg.type === 'success' ? <CheckCircle2 size={16} /> : <Info size={16} />}
                            {feedbackMsg.text}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={isSaving || !puedeActivar} 
                        className="h-11 px-8 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-md shadow-teal-500/20 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isSaving ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
                        {isSaving ? "Guardando..." : "Guardar Regla"}
                    </button>
                </div>
            </form>
        </div>
    );
};