import { ConsumeViewRdsPgCpuMetrics, ConsumeViewRdsPgCreditsMetrics, ConsumeViewRdsPgDbConnectionsMetrics, RdsConsumeViewInstance } from '@/interfaces/vista-consumos/rdsPgConsumeViewInterfaces';

interface RdsInfoConsumeViewComponentProps {
    infoData: RdsConsumeViewInstance[] | null;
    cpuData: ConsumeViewRdsPgCpuMetrics[] | null;
    creditsData: ConsumeViewRdsPgCreditsMetrics[] | null;
    dbConnectionsData: ConsumeViewRdsPgDbConnectionsMetrics[] | null;
    creditsGlobalEfficiency: unknown;

}

export const RdsInfoConsumeViewComponent = ({ infoData, cpuData, creditsData, dbConnectionsData, creditsGlobalEfficiency }: RdsInfoConsumeViewComponentProps) => {
    return (
        <></>
    )
}