import React, { useState } from 'react';
import { PlusCircle, Pencil, X, Loader2, LayoutTemplate, Server, DollarSign, Mail, Sparkles, Users, User, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchableSelect } from '@/components/general_alertas/SearchableSelect';
import { AlertConfig } from '@/interfaces/alertas';


interface SelectOption {
    label: string;
    value: string;
}

interface BillingAlertFormProps {
    formData: AlertConfig;
    setFormData: React.Dispatch<React.SetStateAction<AlertConfig>>;
    projectOptions: SelectOption[];
    serviceOptions: SelectOption[];
    isLoadingProjects: boolean;
    isLoadingServices: boolean;
    alertEmails: string[];
    setAlertEmails: React.Dispatch<React.SetStateAction<string[]>>;
    quiereAdvertencias: boolean;
    setQuiereAdvertencias: (val: boolean) => void;
    porcentajes: number[];
    togglePorcentaje: (val: number) => void;
    handleSubmit: (e: React.FormEvent) => void;
    editingId: string | null;
    cancelEdit: () => void;
    loading: boolean;
    currentUserEmail?: string;
    companyEmails?: string[];
}



export const BillingAlertForm = ({
    formData, setFormData, projectOptions, serviceOptions, isLoadingProjects, isLoadingServices,
    alertEmails, setAlertEmails, quiereAdvertencias, setQuiereAdvertencias, porcentajes, togglePorcentaje,
    handleSubmit, editingId, cancelEdit, loading, currentUserEmail, companyEmails
}: BillingAlertFormProps) => {

    const [currentEmail, setCurrentEmail] = useState('');

    const handleEmailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (['Enter', ',', ' '].includes(e.key)) {
            e.preventDefault();
            const newEmail = currentEmail.trim().toLowerCase();
            if (newEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail) && !alertEmails.includes(newEmail)) {
                setAlertEmails([...alertEmails, newEmail]);
            }
            setCurrentEmail('');
        } else if (e.key === 'Backspace' && currentEmail === '' && alertEmails.length > 0) {
            setAlertEmails(alertEmails.slice(0, -1));
        }
    };

    const removeEmail = (emailToRemove: string) => {
        setAlertEmails(alertEmails.filter(e => e !== emailToRemove));
    };

    const addQuickEmails = (emails: string[]) => {
        const newEmails = emails.filter(email => !alertEmails.includes(email));
        setAlertEmails([...alertEmails, ...newEmails]);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md">
            <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-8 py-5 flex items-center gap-4">
                <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-100 text-blue-600">
                    {editingId ? <Pencil className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
                </div>
                <div>
                    <h3 className="text-lg font-extrabold text-gray-800">
                        {editingId ? "Editar Regla de Monitoreo" : "Nueva Regla de Monitoreo"}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">
                        Configura el umbral de gasto y los canales de notificación.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex flex-col gap-2.5 group">
                        <label className="flex items-center gap-2 text-[13px] font-bold text-gray-700 group-focus-within:text-blue-600 transition-colors">
                            <LayoutTemplate className="w-4 h-4" /> Suscripción
                        </label>
                        <SearchableSelect 
                            value={formData.project_id} 
                            onChange={(val) => setFormData({...formData, project_id: val})} 
                            options={projectOptions} 
                            disabled={isLoadingProjects} 
                        />
                    </div>
                    <div className="flex flex-col gap-2.5 group">
                        <label className="flex items-center gap-2 text-[13px] font-bold text-gray-700 group-focus-within:text-blue-600 transition-colors">
                            <Server className="w-4 h-4" /> Servicio
                        </label>
                        <SearchableSelect 
                            value={formData.service} 
                            onChange={(val) => setFormData({...formData, service: val})} 
                            options={serviceOptions} 
                            disabled={isLoadingServices} 
                        />
                    </div>
                    <div className="flex flex-col gap-2.5 group">
                        <label className="flex items-center gap-2 text-[13px] font-bold text-gray-700 group-focus-within:text-blue-600 transition-colors">
                            <DollarSign className="w-4 h-4" /> Límite Mensual (USD)
                        </label>
                        <div className="relative transform transition-all duration-300 group-focus-within:scale-[1.02]">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                            <input 
                                type="number" 
                                required 
                                min="0" 
                                step="0.01" 
                                value={formData.threshold_amount > 0 ? formData.threshold_amount : ''} 
                                onChange={(e) => setFormData({...formData, threshold_amount: parseFloat(e.target.value) || 0})} 
                                placeholder="0.00" 
                                className="w-full h-11 pl-8 pr-4 border border-gray-200 rounded-xl bg-gray-50/50 hover:bg-white focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm font-extrabold text-gray-800 transition-all shadow-sm" 
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-100">
                    <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-100">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="flex flex-col gap-2.5">
                                <label className="flex items-center gap-2 text-[13px] font-bold text-gray-700">
                                    <Mail className="w-4 h-4" /> Destinatarios de la Alerta
                                </label>
                                
                                <div 
                                    className="flex flex-wrap items-center gap-2 min-h-[44px] p-2 border border-gray-200 rounded-xl bg-white shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all cursor-text"
                                    onClick={() => document.getElementById('email-input-field')?.focus()}
                                >
                                    {alertEmails.map((email) => (
                                        <span key={email} className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-100 animate-in zoom-in-95 duration-200">
                                            {email}
                                            <X className="w-3 h-3 cursor-pointer hover:text-indigo-900 transition-colors" onClick={() => removeEmail(email)} />
                                        </span>
                                    ))}
                                    <input 
                                        id="email-input-field"
                                        type="email" 
                                        value={currentEmail} 
                                        onChange={(e) => setCurrentEmail(e.target.value)}
                                        onKeyDown={handleEmailKeyDown}
                                        placeholder={alertEmails.length === 0 ? "Escribe un correo y presiona Enter..." : "Agregar otro..."} 
                                        className="flex-1 min-w-[180px] h-7 bg-transparent outline-none text-sm text-gray-800 px-2"
                                    />
                                </div>
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                    <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 flex items-center gap-1 mr-1">
                                        <Sparkles className="w-3 h-3" /> Sugerencias:
                                    </span>
                                    
                                    {currentUserEmail && (
                                        <button 
                                            type="button" 
                                            onClick={() => addQuickEmails([currentUserEmail])}
                                            className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-2 py-1 rounded-lg border border-transparent hover:border-indigo-100 transition-all"
                                        >
                                            <User className="w-3 h-3" /> Mi Correo
                                        </button>
                                    )}

                                    {companyEmails && companyEmails.length > 0 && (
                                        <button 
                                            type="button" 
                                            onClick={() => addQuickEmails(companyEmails)}
                                            className="flex items-center gap-1 text-[11px] font-bold text-teal-600 hover:text-teal-800 hover:bg-teal-50 px-2 py-1 rounded-lg border border-transparent hover:border-teal-100 transition-all"
                                        >
                                            <Users className="w-3 h-3" /> Equipo Empresa
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <label className="flex items-center gap-3 cursor-pointer group mt-1">
                                    <div className="relative flex items-center justify-center">
                                        <input 
                                            type="checkbox" 
                                            checked={quiereAdvertencias} 
                                            onChange={(e) => setQuiereAdvertencias(e.target.checked)} 
                                            className="peer sr-only" 
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </div>
                                    <span className="text-[13px] font-bold text-gray-700 group-hover:text-blue-600 transition-colors">
                                        Warnings (Notificaciones Proactivas)
                                    </span>
                                </label>

                                {quiereAdvertencias && (
                                    <div className="flex flex-col gap-2.5 animate-in slide-in-from-top-2 fade-in duration-300 pl-14">
                                        <span className="text-[11px] text-gray-500 font-semibold flex items-center gap-1.5">
                                            <Sparkles className="w-3 h-3 text-amber-500"/> Notificar cuando el consumo alcance:
                                        </span>
                                        <div className="flex flex-wrap gap-2">
                                            {[50, 60, 70, 80, 90].map((v) => (
                                                <button 
                                                    key={v} 
                                                    type="button" 
                                                    onClick={() => togglePorcentaje(v)} 
                                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                                                        porcentajes.includes(v) 
                                                        ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm scale-105 transform' 
                                                        : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300'
                                                    }`}
                                                >
                                                    {v}%
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-8 flex justify-end gap-3">
                    {editingId && (
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={cancelEdit} 
                            disabled={loading} 
                            className="h-11 px-6 rounded-xl font-bold text-gray-600 border-gray-200 hover:bg-gray-50"
                        >
                            <X className="w-4 h-4 mr-2" /> Cancelar
                        </Button>
                    )}
                    <Button 
                        type="submit" 
                        disabled={loading} 
                        className="h-11 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin h-4 w-4 mr-2" />
                        ) : editingId ? (
                            <Save className="h-4 w-4 mr-2" />
                        ) : (
                            <Save className="h-4 w-4 mr-2" />
                        )}
                        {editingId ? "Actualizar Regla" : "Guardar Regla"}
                    </Button>
                </div>
            </form>
        </div>
    );
};