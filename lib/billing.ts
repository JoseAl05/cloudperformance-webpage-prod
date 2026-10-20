import { toQueryString } from '@/lib/consumption';
import type { QueryParams } from '@/lib/consumption';
import type { BillingAction, BillingCloud } from '@/interfaces/billing';

export const billingUrl = (cloud: BillingCloud, action: BillingAction, params: QueryParams): string =>
    `/api/${cloud}/bridge/${cloud}/billing/${action}?${toQueryString(params)}`;

export const COST_METRICS: Record<string, { label: string; description: string }> = {
    netamortizedcost: {
        label: 'AWS · Net amortized cost',
        description: 'Costo neto amortizado de AWS Cost Explorer: descuenta créditos, reembolsos y descuentos, y reparte los pagos '
            + 'por adelantado de reservas y Savings Plans en el período en que se usan.',
    },
    cost_in_billing_currency: {
        label: 'Azure · Cost in billing currency',
        description: 'Costo de Azure Cost Management en la moneda de facturación del contrato: lo que se factura a la suscripción.',
    },
    cost_net_usd: {
        label: 'GCP · Costo neto (USD)',
        description: 'Costo neto de la exportación de facturación de GCP en USD: costo de uso descontados los créditos y descuentos.',
    },
    cost_net_clp: {
        label: 'GCP · Costo neto (CLP)',
        description: 'El mismo costo neto de GCP (descontados créditos y descuentos), expresado en pesos chilenos.',
    },
};

export const costMetricInfo = (metric: string | null | undefined) =>
    (metric && COST_METRICS[metric]) || { label: metric ?? 'Costo', description: 'Métrica de costo informada por la API.' };

export const monthOf = (date: string): string => date.slice(0, 7);

export const monthsRange = (months: string[]): { from: string; to: string } | null => {
    if (months.length === 0) return null;
    const sorted = [...months].sort();
    const [y, m] = sorted[sorted.length - 1].split('-').map(Number);
    const last = new Date(Date.UTC(y, m, 0)).getUTCDate();
    return { from: `${sorted[0]}-01T00:00:00`, to: `${sorted[sorted.length - 1]}-${String(last).padStart(2, '0')}T23:59:59` };
};
