'use client';

import React, { useState } from 'react';
import { DollarSign, ArrowRight, ArrowLeft, TrendingUp, Wallet } from 'lucide-react';
import BillingAlertsView from './billing/BillingAlertsView';
import AnomalyAlertsView from './anomalies/AnomalyAlertsView';
import GlobalBudgetView from './budget/GlobalBudgetView';

interface AlertsManagerProps {
    provider: string; 
}

type ModuleType = 'billing' |  'anomalies' | 'budget' | null;

export default function AlertsManager({ provider }: AlertsManagerProps) {

    const [activeModule, setActiveModule] = useState<ModuleType>(null);

    if (activeModule === null) {
        return (
            <div className="flex flex-col gap-8 animate-in fade-in duration-500">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 capitalize">Centro de Monitoreo</h2>
                    <p className="text-gray-500 text-sm mt-1">
                        Selecciona el tipo de alertas que deseas configurar para tu infraestructura.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    <button 
                        onClick={() => setActiveModule('budget')}
                        className="group relative text-left p-6 rounded-2xl border border-gray-200 bg-white hover:border-teal-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-xl bg-teal-50 text-teal-600 group-hover:bg-teal-500 group-hover:text-white transition-colors duration-300">
                                <Wallet className="w-7 h-7" />
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-teal-500 transition-colors" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-teal-900 transition-colors">
                            Presupuesto Global
                        </h3>
                        <p className="text-sm mt-2 text-gray-500">
                            Activa el monitoreo total de la cuenta. El límite se sincroniza con lo configurado en el modulo de Presupuesto.
                        </p>
                    </button>

                    <button 
                        onClick={() => setActiveModule('billing')}
                        className="group relative text-left p-6 rounded-2xl border border-gray-200 bg-white hover:border-blue-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                                <DollarSign className="w-7 h-7" />
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-900 transition-colors">
                            Alertas por Servicio
                        </h3>
                        <p className="text-sm mt-2 text-gray-500">
                            Controla presupuestos específicos por suscripción o servicio y recibe avisos.
                        </p>
                    </button>

                    <button 
                        onClick={() => setActiveModule('anomalies')}
                        className="group relative text-left p-6 rounded-2xl border border-gray-200 bg-white hover:border-purple-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-500 group-hover:text-white transition-colors duration-300">
                                <TrendingUp className="w-7 h-7" />
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-purple-500 transition-colors" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-purple-900 transition-colors">
                            Alzas Inusuales
                        </h3>
                        <p className="text-sm mt-2 text-gray-500">
                            Detecta anomalías y saltos bruscos en tu consumo diario mediante algoritmos.
                        </p>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 animate-in slide-in-from-right-8 fade-in duration-500">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                <div>
                    <button 
                        onClick={() => setActiveModule(null)}
                        className="group flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors mb-2"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Volver a categorías
                    </button>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        {activeModule === 'budget' && <><Wallet className="w-6 h-6 text-teal-500"/> Presupuesto Global</>}
                        {activeModule === 'billing' && <><DollarSign className="w-6 h-6 text-blue-500"/> Alertas por Servicio</>}
                        {activeModule === 'anomalies' && <><TrendingUp className="w-6 h-6 text-purple-500"/> Detección de Anomalías</>}

                    </h2>
                </div>
            </div>

            <div className="mt-2">
                {activeModule === 'budget' && (
                    <GlobalBudgetView provider={provider} />
                )}

                {activeModule === 'billing' && (
                    <BillingAlertsView provider={provider} />
                )}

                {activeModule === 'anomalies' && (
                     <AnomalyAlertsView provider={provider} />
                )}
            </div>
        </div>
    );
}