'use client'

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Search, BarChart3 } from 'lucide-react';


export interface MysqlBillingRecord {
    usage_start_time: string;
    sku: string;
    cost_gross_usd: number;
    cost_net_usd: number;
    discount_usd: number;
}

interface Props {
    data: MysqlBillingRecord[];
}

export const AzureMysqlBillingTableComponent = ({ data }: Props) => {
    const [searchTerm, setSearchTerm] = useState('');

    const totalNetUsd = useMemo(() => {
        return data.reduce((acc, curr) => acc + (curr.cost_net_usd || 0), 0);
    }, [data]);

    const filteredData = useMemo(() => {
        if (!searchTerm) return data;
        return data.filter(item => 
            item.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.usage_start_time?.includes(searchTerm)
        );
    }, [data, searchTerm]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 4,
        }).format(value);
    };

    if (!data || data.length === 0) {
        return null; 
    }

    return (
        <Card className="w-full shadow-sm">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between border-b bg-gray-50/50 dark:bg-gray-900/50 gap-4">
                <div>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <BarChart3 className="h-5 w-5 text-green-600" />
                        Facturación de la Base de Datos
                    </CardTitle>
                    <CardDescription>
                        Desglose de costos diarios por SKU (USD).
                    </CardDescription>
                </div>
                
                <div className="flex flex-col items-end bg-white dark:bg-gray-800 border rounded-lg px-4 py-2 shadow-sm">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                        Total Neto USD
                    </span>
                    <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {formatCurrency(totalNetUsd)}
                    </span>
                </div>
            </CardHeader>
            
            <CardContent className="p-0">
                <div className="p-4 border-b">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por SKU o fecha..."
                            className="w-full pl-9 pr-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-950 dark:border-gray-800"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-900/50 border-b">
                            <tr>
                                <th className="px-6 py-4 font-medium">Fecha</th>
                                <th className="px-6 py-4 font-medium">SKU</th>
                                <th className="px-6 py-4 font-medium text-right">Bruto (USD)</th>
                                <th className="px-6 py-4 font-medium text-right">Desc. (USD)</th>
                                <th className="px-6 py-4 font-medium text-right">Neto (USD)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {filteredData.length > 0 ? (
                                filteredData.map((row, index) => (
                                    <tr key={index} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">
                                            {row.usage_start_time}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-200">
                                            {row.sku}
                                        </td>
                                        <td className="px-6 py-4 text-right text-gray-600 dark:text-gray-400">
                                            {formatCurrency(row.cost_gross_usd)}
                                        </td>
                                        <td className="px-6 py-4 text-right text-green-600">
                                            {row.discount_usd > 0 ? `-${formatCurrency(row.discount_usd)}` : '$0.00'}
                                        </td>
                                        <td className="px-6 py-4 text-right font-semibold text-gray-900 dark:text-gray-200">
                                            {formatCurrency(row.cost_net_usd)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        No se encontraron registros que coincidan con la búsqueda.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                <div className="p-4 border-t text-xs text-gray-500 flex justify-between items-center">
                    <span>Mostrando {filteredData.length} registros</span>
                </div>
            </CardContent>
        </Card>
    );
};