'use client'

import { useState } from 'react';
import { IntraCloudServiceSelectionComponent, ServiceType } from '@/components/comp-cloud/intracloud/IntraCloudServiceSelectionComponent';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { CloudAccount } from '@/types/db';
import { Eraser, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export interface ReqPayload {
    tenants: string[];
    cloud_provider: string;
    service_type: ServiceType;
}

interface IntraCloudConfigComponentProps {
    cloudType: string;
    accounts: CloudAccount[];
    onReqReady: (payload: ReqPayload) => void;
}

export const IntraCloudConfigComponent = ({ cloudType, accounts, onReqReady }: IntraCloudConfigComponentProps) => {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    let unitLabel = '';
    switch (cloudType) {
        case 'Azure':
            unitLabel = 'Tenant';
            break;
        case 'AWS':
            unitLabel = 'Cuenta';
            break;
        case 'GCP':
            unitLabel = 'Proyecto';
            break;
        default:
            break;
    }
    const isStepComplete = selectedIds.length >= 2;

    const handleToggleAccount = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id)
                ? prev.filter(i => i !== id)
                : [...prev, id]
        );
    };

    const handleLocalReset = () => {
        setSelectedIds([]);
    };

    const handleServiceSelected = (service: ServiceType) => {
        const finalPayload: ReqPayload = {
            tenants: selectedIds,
            cloud_provider: cloudType,
            service_type: service
        };

        onReqReady(finalPayload);
    };

    return (
        <div className="space-y-6">
            <Card className="border-l-4 border-l-blue-500 shadow-sm animate-in slide-in-from-top-4 fade-in duration-700">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg text-gray-700 flex items-center gap-2">
                        <span className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                        Selección de {unitLabel}s
                    </CardTitle>
                    {selectedIds.length > 0 && (
                        <Button
                            variant="ghost" size="sm" onClick={handleLocalReset}
                            className="text-gray-400 hover:text-blue-600 transition-colors flex gap-2 text-xs"
                        >
                            <Eraser size={14} /> Limpiar Selección ({selectedIds.length})
                        </Button>
                    )}
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {accounts.map((acc) => {
                            const isSelected = selectedIds.includes(acc.id);
                            return (
                                <div
                                    key={acc.id}
                                    onClick={() => handleToggleAccount(acc.id)}
                                    className={cn(
                                        "flex items-center space-x-3 p-3 border rounded-md cursor-pointer transition-all",
                                        isSelected ? "border-blue-500 bg-blue-50" : "hover:border-gray-300 bg-white"
                                    )}
                                >
                                    <Checkbox checked={isSelected} onCheckedChange={() => handleToggleAccount(acc.id)} />
                                    <span className={cn("text-sm truncate", isSelected ? "font-medium text-blue-900" : "text-zinc-600")}>
                                        {acc.alias}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {selectedIds.length > 0 && (
                        <div className="pt-4 border-t border-dashed">
                            <p className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-2">
                                <Users size={14} /> {unitLabel}s seleccionados:
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {selectedIds.map(id => {
                                    const account = accounts.find(a => a.id === id);
                                    return (
                                        <Badge key={id} variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                                            {account?.alias}
                                        </Badge>
                                    );
                                })}
                            </div>
                            {selectedIds.length < 2 && (
                                <p className="text-[10px] text-amber-600 mt-2 italic">
                                    * Selecciona al menos dos para habilitar los servicios
                                </p>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {isStepComplete && (
                <IntraCloudServiceSelectionComponent
                    key={selectedIds.join('-')}
                    cloudType={cloudType}
                    onServiceSelected={handleServiceSelected}
                />
            )}
        </div>
    )
}