'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Server, HardDrive, Activity, MapPin } from "lucide-react";

export interface AzurePostgresData {
    instance_name: string;
    instance_id: string;
    history_data: Array<{
        location: string;
        version: string;
        minor_version?: string;
        state: string;
        administrator_login: string;
        sku: {
            name: string;
            tier: string;
        };
        storage: {
            storage_size_gb: number;
            tier?: string;
        };
    }>;
}

interface Props {
    data: AzurePostgresData[] | null;
}

export const AzurePostgresInfoComponent = ({ data }: Props) => {
    if (!data || data.length === 0) return null;

    const instance = data[0];
    const latestHistory = instance.history_data[0];

    return (
        <Card className="w-full shadow-sm">
            <CardHeader className="bg-gray-50/50 dark:bg-gray-900/50 border-b">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Database className="h-5 w-5 text-blue-500" />
                    Información de la Instancia
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                    <div className="flex items-start gap-3">
                        <Server className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-gray-500">Nombre</p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{instance.instance_name}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Activity className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-gray-500">Estado & Versión</p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                {latestHistory.state} • PostgreSQL {latestHistory.version}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Database className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-gray-500">SKU / Nivel</p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                {latestHistory.sku?.name} ({latestHistory.sku?.tier})
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <HardDrive className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-gray-500">Almacenamiento</p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                {latestHistory.storage?.storage_size_gb} GB {latestHistory.storage?.tier ? `(${latestHistory.storage.tier})` : ''}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-gray-500">Región</p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 capitalize">
                                {latestHistory.location}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};