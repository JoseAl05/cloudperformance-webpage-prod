import React from 'react';
import { Activity, AlertTriangle } from 'lucide-react';

interface AnomalyKpiCardsProps {
    totalReglas: number;
    anomaliasDetectadas: number;
}

export const AnomalyKpiCards: React.FC<AnomalyKpiCardsProps> = ({ totalReglas, anomaliasDetectadas }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Detectores Activos</p>
                    <h4 className="text-2xl font-bold text-gray-800">{totalReglas}</h4>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                    <Activity size={24} />
                </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Anomalías Detectadas (Últ. 24h)</p>
                    <h4 className="text-2xl font-bold text-gray-800">{anomaliasDetectadas}</h4>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${anomaliasDetectadas > 0 ? 'bg-purple-50 text-purple-600' : 'bg-gray-50 text-gray-400'}`}>
                    <AlertTriangle size={24} />
                </div>
            </div>
        </div>
    );
};