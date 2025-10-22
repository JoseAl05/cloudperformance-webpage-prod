'use client';
import { Ec2InfoConsumeViewCardsComponent } from '@/components/aws/vista-consumos/ec2/info/Ec2InfoConsumeViewCardsComponent';


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
