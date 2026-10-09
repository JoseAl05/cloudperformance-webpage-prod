'use client'

import { ConsumptionView } from '@/components/shared/consumption/ConsumptionView';
import { AZURE_APP_GATEWAY } from '@/components/shared/consumption/consumptionConfigs';
import { toApiDate } from '@/lib/consumption';

interface ConsumoAppGwComponentProps {
    startDate: Date;
    endDate?: Date;
    selectedAppg: string;
}

/** Consumo Application Gateway: adapta los filtros de la vista al contrato canónico (/api/azure/consumption/app-gateways/*). */
export const ConsumoAppGwComponent = ({ startDate, endDate, selectedAppg }: ConsumoAppGwComponentProps) => (
    <ConsumptionView
        config={AZURE_APP_GATEWAY}
        enabled={!!selectedAppg}
        disabledText="No se ha seleccionado ningún Application Gateway."
        params={{
            date_from: toApiDate(startDate),
            date_to: endDate ? toApiDate(endDate) : undefined,
            appg: selectedAppg,
        }}
    />
);
