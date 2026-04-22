'use client'

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BadgeDollarSign, Cpu, HardDrive, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export type ServiceType = 'vms'

interface InterCloudServiceSelectionComponentProps {
    cloudType: string;
    onServiceSelected: (service: ServiceType) => void;
}

export const InterCloudServiceSelectionComponent = ({ cloudType, onServiceSelected }: InterCloudServiceSelectionComponentProps) => {
    const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const services = [
        { id: 'vms', label: 'Máquinas Virtuales', icon: Cpu, description: 'Máquinas virtuales (EC2, Virtual Machines, Compute Instances)' },
        // { id: 'storage', label: 'Storage y Discos', icon: HardDrive, description: 'Volúmenes, Buckets y retención.' }
    ];

    const handleGenerateClick = () => {
        if (!selectedService) return;
        setIsGenerating(true);
        onServiceSelected(selectedService as ServiceType);
    };

    return (
        <Card className="border-l-4 border-l-green-500 shadow-sm animate-in slide-in-from-top-4 fade-in duration-700 fill-mode-forwards">
            <CardHeader>
                <CardTitle className="text-lg text-gray-700 flex items-center gap-2">
                    <span className="bg-green-100 text-green-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
                    Selector de Servicio
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {services.map((service) => {
                        const Icon = service.icon;
                        const isSelected = selectedService === service.id;
                        return (
                            <div
                                key={service.id}
                                onClick={() => setSelectedService(service.id as ServiceType)}
                                className={cn(
                                    "cursor-pointer border rounded-lg p-4 transition-all duration-300 hover:shadow-md hover:border-green-400 group",
                                    isSelected ? "bg-green-50 border-green-500 ring-1 ring-green-500" : "bg-white"
                                )}
                            >
                                <div className="flex flex-col items-center text-center gap-2">
                                    <div className={cn("p-2 rounded-full", isSelected ? "bg-green-200 text-green-700" : "bg-gray-100 text-gray-500 group-hover:text-green-600")}>
                                        <Icon size={24} />
                                    </div>
                                    <h3 className="font-semibold text-sm">{service.label}</h3>
                                    <p className="text-xs text-gray-500">{service.description}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {selectedService && (
                    <div className="mt-6 flex justify-end animate-in fade-in">
                        <Button
                            onClick={handleGenerateClick}
                            disabled={isGenerating}
                            className="bg-slate-900 text-white px-6 py-2 rounded-md hover:bg-slate-800 transition-colors text-sm font-medium flex items-center gap-2 cursor-pointer"
                            variant='default'
                        >
                            {isGenerating && <Loader2 className="animate-spin h-4 w-4" />}
                            {isGenerating ? 'Generando Reporte...' : `Ir a comparación`}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}