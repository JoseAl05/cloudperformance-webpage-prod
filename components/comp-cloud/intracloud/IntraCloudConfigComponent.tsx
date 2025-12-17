'use client'

import { useState } from 'react';
import { ServiceSelectionComponent, ServiceType } from '@/components/comp-cloud/intracloud/ServiceSelectionComponent';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CloudAccount } from '@/types/db';
import { ArrowRightLeft, Eraser } from 'lucide-react';

export interface AuditPayload {
    db_tenant_a: string;
    db_tenant_b: string;
    cloud_provider: string;
    service_type: ServiceType;
}

interface IntraCloudConfigComponentProps {
    cloudType: string;
    accounts: CloudAccount[];
    onAuditReady: (payload: AuditPayload) => void;
}

export const IntraCloudConfigComponent = ({ cloudType, accounts, onAuditReady }: IntraCloudConfigComponentProps) => {
    const [sourceId, setSourceId] = useState<string>('');
    const [targetId, setTargetId] = useState<string>('');

    const unitLabel = cloudType === 'Azure' ? 'Tenant' : 'Cuenta';
    const isStepComplete = sourceId !== '' && targetId !== '';

    const handleLocalReset = () => {
        setSourceId('');
        setTargetId('');
    };

    const handleServiceSelected = (service: ServiceType) => {
        const finalPayload: AuditPayload = {
            db_tenant_a: sourceId,
            db_tenant_b: targetId,
            cloud_provider: cloudType,
            service_type: service
        };

        onAuditReady(finalPayload);
    };

    return (
        <div className="space-y-6">
            <Card className="border-l-4 border-l-purple-500 shadow-sm animate-in slide-in-from-top-4 fade-in duration-700 fill-mode-forwards">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg text-gray-700 flex items-center gap-2">
                        <span className="bg-purple-100 text-purple-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                        Comparación de {unitLabel}s
                    </CardTitle>
                    {(sourceId || targetId) && (
                        <Button
                            variant="ghost" size="sm" onClick={handleLocalReset}
                            className="text-gray-400 hover:text-purple-600 transition-colors flex gap-2 text-xs"
                        >
                            <Eraser size={14} /> Limpiar Selección
                        </Button>
                    )}
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="w-full">
                            <label className="text-xs text-gray-500 mb-1 block">Origen A</label>
                            <Select onValueChange={setSourceId} value={sourceId}>
                                <SelectTrigger><SelectValue placeholder={`Seleccionar ${unitLabel} A`} /></SelectTrigger>
                                <SelectContent>
                                    {accounts.map(acc => <SelectItem key={acc.id} value={acc.id} disabled={acc.id === targetId}>{acc.alias}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="text-gray-400 pt-4"><ArrowRightLeft size={20} /></div>
                        <div className="w-full">
                            <label className="text-xs text-gray-500 mb-1 block">Origen B</label>
                            <Select onValueChange={setTargetId} value={targetId}>
                                <SelectTrigger><SelectValue placeholder={`Seleccionar ${unitLabel} B`} /></SelectTrigger>
                                <SelectContent>
                                    {accounts.map(acc => <SelectItem key={acc.id} value={acc.id} disabled={acc.id === sourceId}>{acc.alias}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {isStepComplete && (
                <ServiceSelectionComponent
                    key={`${sourceId}-${targetId}`}
                    cloudType={cloudType}
                    onServiceSelected={handleServiceSelected}
                />
            )}
        </div>
    )
}