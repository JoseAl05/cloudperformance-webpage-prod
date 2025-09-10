import { ConsumeViewRdsPgCpuMetrics, ConsumeViewRdsPgCreditsMetrics, ConsumeViewRdsPgDbConnectionsMetrics, RdsConsumeViewInstance } from '@/interfaces/vista-consumos/rdsPgConsumeViewInterfaces';
import { RdsInfoConsumeViewCardsComponent } from './RdsInfoConsumeViewCardsComponent';

interface RdsInfoConsumeViewComponentProps {
    infoData: RdsConsumeViewInstance[] | null;
    cpuData: ConsumeViewRdsPgCpuMetrics[] | null;
    creditsData: ConsumeViewRdsPgCreditsMetrics[] | null;
    dbConnectionsData: ConsumeViewRdsPgDbConnectionsMetrics[] | null;
    creditsGlobalEfficiency: unknown;

}

export const RdsInfoConsumeViewComponent = ({ infoData, cpuData, creditsData, dbConnectionsData, creditsGlobalEfficiency }: RdsInfoConsumeViewComponentProps) => {

    if (!infoData || infoData.length === 0) {
        return <div className="text-center text-gray-500 py-6">No hay instancias para mostrar.</div>;
    }
    const hasCpu = Array.isArray(cpuData) && cpuData.length > 0;
    const hasDbConnections = Array.isArray(dbConnectionsData) && dbConnectionsData.length > 0;
    return (
        <>
            <RdsInfoConsumeViewCardsComponent
                infoData={infoData}
                cpuData={hasCpu ? cpuData : null}
                dbConnectionsData={hasDbConnections ? dbConnectionsData : null}
                creditsGlobalEfficiencyData={creditsGlobalEfficiency}
            />
        </>
    )
}