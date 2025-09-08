'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Activity, ChevronDown, ChevronUp, Cpu, Network, Percent, TrendingUp, Zap } from 'lucide-react';
import { Ec2InfoConsumeViewCardsComponent } from './Ec2InfoConsumeViewCardsComponent';


interface Ec2InfoConsumeViewComponentProps {
    infoData: Ec2ConsumneViewInstance[] | null;
    cpuData: ConsumeViewEc2CpuMetrics[] | null;
    creditsData: ConsumeViewEc2CreditsMetrics[] | null;
    creditsGlobalEfficiency: unknown;

}


export const Ec2InfoConsumeViewComponent = ({ infoData, cpuData, creditsData, creditsGlobalEfficiency }: Ec2InfoConsumeViewComponentProps) => {
    if (!infoData || infoData.length === 0) {
        return <div className="text-center text-gray-500 py-6">No hay instancias para mostrar.</div>;
    }
    const hasCpu = Array.isArray(cpuData) && cpuData.length > 0;
    return (
        <>
            <Ec2InfoConsumeViewCardsComponent
                infoData={infoData}
                cpuData={hasCpu ? cpuData : null}
                creditsGlobalEfficiencyData={creditsGlobalEfficiency}
            />
        </>
    );
};
