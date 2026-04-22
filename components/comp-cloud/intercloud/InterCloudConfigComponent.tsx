'use client'

import { useState } from 'react';
import { InterCloudServiceSelectionComponent, ServiceType } from '@/components/comp-cloud/intercloud/InterCloudServiceSelectionComponent';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { CloudAccount } from '@/types/db';
import { Eraser, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export interface InterCloudReqPayload {
    tenant_id: string;
    cloud_provider: string;
    service_type: ServiceType;
}

interface InterCloudConfigComponentProps {
    cloudType: string;
    accounts: CloudAccount[];
    onReqReady: (payload: InterCloudReqPayload) => void;
}

export const InterCloudConfigComponent = ({ cloudType, accounts, onReqReady }: InterCloudConfigComponentProps) => {
    const [selectedId, setSelectedId] = useState<string>('');

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
    const isStepComplete = !!selectedId;

    const handleSelectAccount = (id: string) => {
        setSelectedId(prev => (prev === id ? '' : id));
    };

    const handleLocalReset = () => {
        setSelectedId('');
    };

    const handleServiceSelected = (service: ServiceType) => {
        const finalPayload: InterCloudReqPayload = {
            tenant_id: selectedId,
            cloud_provider: cloudType,
            service_type: service
        };

        onReqReady(finalPayload);
    };

    const selectedAccount = accounts.find(a => a.id === selectedId);

    return (
        <div className="space-y-6">
            <Card className="border-l-4 border-l-green-500 shadow-sm animate-in slide-in-from-top-4 fade-in duration-700">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg text-gray-700 flex items-center gap-2">
                        <span className="bg-green-100 text-green-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                        Selección de {unitLabel}
                    </CardTitle>
                    {selectedId && (
                        <Button
                            variant="ghost" size="sm" onClick={handleLocalReset}
                            className="text-gray-400 hover:text-green-600 transition-colors flex gap-2 text-xs"
                        >
                            <Eraser size={14} /> Limpiar Selección
                        </Button>
                    )}
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {accounts.map((acc) => {
                            const isSelected = selectedId === acc.id;
                            return (
                                <div
                                    key={acc.id}
                                    onClick={() => handleSelectAccount(acc.id)}
                                    className={cn(
                                        "flex items-center space-x-3 p-3 border rounded-md cursor-pointer transition-all",
                                        isSelected ? "border-green-500 bg-green-50" : "hover:border-gray-300 bg-white"
                                    )}
                                >
                                    <Checkbox checked={isSelected} onCheckedChange={() => handleSelectAccount(acc.id)} />
                                    <span className={cn("text-sm truncate", isSelected ? "font-medium text-green-900" : "text-zinc-600")}>
                                        {acc.alias}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {selectedId && (
                        <div className="pt-4 border-t border-dashed">
                            <p className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-2">
                                <User size={14} /> {unitLabel} seleccionado:
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                                    {selectedAccount?.alias}
                                </Badge>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {isStepComplete && (
                <InterCloudServiceSelectionComponent
                    key={selectedId}
                    cloudType={cloudType}
                    onServiceSelected={handleServiceSelected}
                />
            )}
        </div>
    );
};