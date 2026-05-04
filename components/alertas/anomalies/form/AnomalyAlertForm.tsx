import React, { useState } from 'react';
import { Save, X, Mail, Percent, Clock, Activity, Sparkles, User, Users } from 'lucide-react';
import { AnomalyConfig } from '@/interfaces/anomalias';
import { CloudProject } from '../AnomalyAlertsView'; 

interface AnomalyAlertFormProps {
    formData: AnomalyConfig;
    setFormData: React.Dispatch<React.SetStateAction<AnomalyConfig>>;
    projectOptions: CloudProject[]; 
    serviceOptions: string[];       
    isLoadingProjects: boolean;
    isLoadingServices: boolean;
    alertEmails: string[];
    setAlertEmails: React.Dispatch<React.SetStateAction<string[]>>;
    handleSubmit: (e: React.FormEvent) => void;
    editingId: string | null;
    cancelEdit: () => void;
    loading: boolean;
    currentUserEmail?: string;
    companyEmails?: string[];
}

type ComparisonPeriodType = 'previous_day' | '7d' | '15d' | '30d';

export const AnomalyAlertForm: React.FC<AnomalyAlertFormProps> = ({
    formData, setFormData, projectOptions, serviceOptions,
    isLoadingProjects, isLoadingServices, alertEmails, setAlertEmails,
    handleSubmit, editingId, cancelEdit, loading, currentUserEmail, companyEmails = []
}) => {
    const [currentEmail, setCurrentEmail] = useState<string>('');

    const handleEmailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (['Enter', ',', ' '].includes(e.key)) {
            e.preventDefault();
            const newEmail = currentEmail.trim().toLowerCase();
            if (newEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail) && !alertEmails.includes(newEmail)) {
                setAlertEmails([...alertEmails, newEmail]);
            }
            setCurrentEmail('');
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
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-800">
                        {editingId ? 'Editar Detector de Anomalía' : 'Nuevo Detector de Anomalía'}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium mt-0.5">Configura la sensibilidad para detectar saltos atípicos en el consumo.</p>
                </div>
                <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl border border-purple-100">
                    <Activity size={24} strokeWidth={2.5} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-5">
                    <div className="group">
                        <label className="block text-[13px] font-bold text-gray-700 mb-2 group-focus-within:text-purple-600 transition-colors">
                            Proyecto / Suscripción
                        </label>
                        <select 
                            className="w-full h-11 border-gray-200 rounded-xl text-sm font-semibold text-gray-800 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-sm"
                            value={formData.project_id}
                            onChange={(e) => setFormData({ ...formData, project_id: e.target.value, service: 'all_services' })}
                            disabled={isLoadingProjects}
                        >
                            <option value="all_projects">{isLoadingProjects ? 'Cargando...' : 'Todas las suscripciones'}</option>
                            {!isLoadingProjects && projectOptions.map((proj: CloudProject) => (
                                <option key={proj.id} value={proj.id}>{proj.name || proj.id}</option>
                            ))}
                        </select>
                    </div>
                    <div className="group">
                        <label className="block text-[13px] font-bold text-gray-700 mb-2 group-focus-within:text-purple-600 transition-colors">
                            Servicio
                        </label>
                        <select 
                            className="w-full h-11 border-gray-200 rounded-xl text-sm font-semibold text-gray-800 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-sm"
                            value={formData.service}
                            onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                            disabled={isLoadingServices || formData.project_id === 'all_projects'}
                        >
                            <option value="all_services">
                                {isLoadingServices ? 'Cargando servicios...' : 
                                 formData.project_id === 'all_projects' ? 'Selecciona un proyecto para filtrar' : 'Todos los servicios'}
                            </option>
                            {!isLoadingServices && serviceOptions.map((serv: string) => (
                                <option key={serv} value={serv}>{serv}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex flex-col gap-5">
                    <div className="group">
                        <label className="flex items-center gap-2 text-[13px] font-bold text-gray-700 mb-2 group-focus-within:text-purple-600 transition-colors">
                            <Percent size={16} className="text-purple-500" /> Sensibilidad del Salto (%)
                        </label>
                        <input 
                            type="number" min="1" step="0.1" required
                            className="w-full h-11 px-4 border-gray-200 rounded-xl text-sm font-bold text-gray-800 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-sm"
                            value={formData.sensitivity_percentage}
                            onChange={(e) => setFormData({ ...formData, sensitivity_percentage: parseFloat(e.target.value) })}
                        />
                    </div>
                    <div className="group">
                        <label className="flex items-center gap-2 text-[13px] font-bold text-gray-700 mb-2 group-focus-within:text-purple-600 transition-colors">
                            <Clock size={16} className="text-purple-500" /> Período Base 
                        </label>
                        <select 
                            className="w-full h-11 border-gray-200 rounded-xl text-sm font-semibold text-gray-800 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-sm"
                            value={formData.comparison_period}
                            onChange={(e) => setFormData({ ...formData, comparison_period: e.target.value as ComparisonPeriodType })}
                        >
                                <option value="previous_day">Día anterior (Ayer vs Anteayer)</option>
                                <option value="7d">Promedio últimos 7 días</option>
                                <option value="15d">Promedio últimos 15 días</option>
                                <option value="30d">Promedio últimos 30 días</option>
                        </select>
                    </div>
                </div>

                <div className="md:col-span-2 bg-slate-50/80 p-6 rounded-2xl border border-slate-100 mt-2">
                    <div className="flex flex-col gap-2.5">
                        <label className="flex items-center gap-2 text-[13px] font-bold text-gray-700">
                            <Mail className="w-4 h-4" /> Destinatarios de la Alerta
                        </label>
                        
                        <div 
                            className="flex flex-wrap items-center gap-2 min-h-[44px] p-2 border border-gray-200 rounded-xl bg-white shadow-sm focus-within:ring-2 focus-within:ring-purple-500/20 focus-within:border-purple-500 transition-all cursor-text"
                            onClick={() => document.getElementById('anomaly-email-input')?.focus()}
                        >
                            {alertEmails.map((email: string) => (
                                <span key={email} className="flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-lg border border-purple-100 animate-in zoom-in-95 duration-200">
                                    {email}
                                    <X className="w-3 h-3 cursor-pointer hover:text-purple-900 transition-colors" onClick={() => removeEmail(email)} />
                                </span>
                            ))}
                            <input 
                                id="anomaly-email-input"
                                type="email" 
                                value={currentEmail} 
                                onChange={(e) => setCurrentEmail(e.target.value)}
                                onKeyDown={handleEmailKeyDown}
                                placeholder={alertEmails.length === 0 ? "Escribe un correo y presiona Enter..." : "Agregar otro..."} 
                                className="flex-1 min-w-[180px] h-7 bg-transparent outline-none text-sm font-medium text-gray-800 px-2"
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
                                    className="flex items-center gap-1 text-[11px] font-bold text-purple-600 hover:text-purple-800 hover:bg-purple-50 px-2 py-1 rounded-lg border border-transparent hover:border-purple-100 transition-all"
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
                </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-gray-100">
                {editingId && (
                    <button 
                        type="button" 
                        onClick={cancelEdit} 
                        className="h-11 px-6 rounded-xl font-bold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                        Cancelar
                    </button>
                )}
                <button 
                    type="submit" disabled={loading}
                    className="h-11 px-8 bg-purple-600 rounded-xl text-sm font-bold text-white hover:bg-purple-700 flex items-center gap-2 shadow-md shadow-purple-500/20 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
                >
                    <Save size={18} />
                    {loading ? 'Guardando...' : editingId ? 'Actualizar Regla' : 'Guardar Regla'}
                </button>
            </div>
        </form>
    );
};