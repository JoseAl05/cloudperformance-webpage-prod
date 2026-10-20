import type { TopBillingUiTuning } from './TopBillingChart';

export interface TopBillingDimension {
    value: string;
    label: string;
    icon: string;
    uiTuning?: TopBillingUiTuning;
}

const legend = { type: 'scroll', orient: 'horizontal', bottom: 8, left: 'center' } as const;
const tuning = (gridMinLeft: number, gridMaxLeft: number): TopBillingUiTuning => ({
    yLabelStrategy: 'truncate',
    gridMinLeft,
    gridMaxLeft,
    axisLabelInterval: 'auto',
    legend,
});

export const AWS_TOP_DIMENSIONS = {
    region: { value: 'region', label: 'Región', icon: '🌍', uiTuning: tuning(30, 100) },
    operatingSystem: { value: 'operating-system', label: 'Sistema Operativo', icon: '💻', uiTuning: tuning(10, 10) },
    instanceType: { value: 'instance-type', label: 'Tipo de Instancia', icon: '📊', uiTuning: tuning(30, 100) },
    instanceTypeFamily: { value: 'instance-type-family', label: 'Familia de Instancia', icon: '💻', uiTuning: tuning(30, 20) },
    purchaseType: { value: 'purchase-type', label: 'Tipo de Compra', icon: '🛒', uiTuning: tuning(10, 10) },
    recordType: { value: 'record-type', label: 'Tipo de Cobro', icon: '💳', uiTuning: tuning(30, 20) },
    resourceId: { value: 'resource-id', label: 'Recurso', icon: '🆔', uiTuning: tuning(30, 20) },
} satisfies Record<string, TopBillingDimension>;

export const AZURE_TOP_DIMENSIONS: TopBillingDimension[] = [
    { value: 'subscription', label: 'Suscripción', icon: '🔑', uiTuning: tuning(30, 100) },
    { value: 'resource-group', label: 'Grupo de Recursos', icon: '📁', uiTuning: tuning(30, 100) },
    { value: 'service', label: 'Servicio', icon: '🧩', uiTuning: tuning(30, 100) },
    { value: 'location', label: 'Ubicación', icon: '🌍', uiTuning: tuning(30, 100) },
];

export const GCP_TOP_DIMENSIONS = {
    region: { value: 'region', label: 'Región', icon: '🌍', uiTuning: tuning(30, 100) },
} satisfies Record<string, TopBillingDimension>;
