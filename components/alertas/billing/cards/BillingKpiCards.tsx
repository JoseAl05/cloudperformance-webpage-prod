import React from 'react';
import { ShieldCheck, BellRing, DollarSign } from 'lucide-react';

interface BillingKpiCardsProps {
    totalReglas: number;
    reglasDisparadas: number;
    presupuestoProtegido: number;
}

export const BillingKpiCards = ({ totalReglas, reglasDisparadas, presupuestoProtegido }: BillingKpiCardsProps) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-semibold text-gray-500 mb-1">Reglas Activas</p>
                    <h3 className="text-3xl font-bold text-gray-800">{totalReglas}</h3>
                </div>
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg"><ShieldCheck className="w-6 h-6" /></div>
            </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500"></div>
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-semibold text-gray-500 mb-1">Alertas Disparadas</p>
                    <h3 className="text-3xl font-bold text-gray-800">{reglasDisparadas}</h3>
                </div>
                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg"><BellRing className="w-6 h-6" /></div>
            </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-semibold text-gray-500 mb-1">Límites Protegidos</p>
                    <h3 className="text-3xl font-bold text-gray-800">${presupuestoProtegido.toLocaleString()}</h3>
                </div>
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg"><DollarSign className="w-6 h-6" /></div>
            </div>
        </div>
    </div>
);