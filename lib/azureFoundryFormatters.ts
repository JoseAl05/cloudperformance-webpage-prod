const currencyFormatter = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

const preciseCurrencyFormatter = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 4
});

const percentFormatter = new Intl.NumberFormat('es-CL', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
});

const tokenFormatter = new Intl.NumberFormat('es-CL', {
    notation: 'compact',
    maximumFractionDigits: 2
});

const integerFormatter = new Intl.NumberFormat('es-CL', {
    maximumFractionDigits: 0
});

const dateFormatter = new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC'
});

export const formatCurrency = (value: number | null | undefined): string => {
    if (value === null || value === undefined || Number.isNaN(value)) return '—';
    if (value !== 0 && Math.abs(value) < 0.01) return preciseCurrencyFormatter.format(value);
    return currencyFormatter.format(value);
};

export const formatPercent = (value: number | null | undefined): string => {
    if (value === null || value === undefined || Number.isNaN(value)) return '—';
    return `${percentFormatter.format(value)}%`;
};

export const formatSignedPercent = (value: number | null | undefined): string => {
    if (value === null || value === undefined || Number.isNaN(value)) return '—';
    const sign = value > 0 ? '+' : '';
    return `${sign}${percentFormatter.format(value)}%`;
};

export const formatTokens = (value: number | null | undefined): string => {
    if (value === null || value === undefined || Number.isNaN(value)) return '—';
    return tokenFormatter.format(value);
};

export const formatInteger = (value: number | null | undefined): string => {
    if (value === null || value === undefined || Number.isNaN(value)) return '—';
    return integerFormatter.format(value);
};

export const formatScore = (value: number | null | undefined): string => {
    if (value === null || value === undefined || Number.isNaN(value)) return '—';
    return percentFormatter.format(value * 100);
};

export const formatDate = (value: string | null | undefined): string => {
    if (!value) return '—';
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? '—' : dateFormatter.format(parsed);
};

export const formatPricePerMillion = (value: number | null | undefined): string => {
    if (value === null || value === undefined || Number.isNaN(value)) return '—';
    return `${preciseCurrencyFormatter.format(value)}/1M`;
};

export const confidenceLabels: Record<string, string> = {
    HIGH: 'Alta',
    MEDIUM: 'Media',
    LOW: 'Baja'
};

export const confidenceClasses: Record<string, string> = {
    HIGH: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400',
    MEDIUM: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
    LOW: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
};

export const deltaClass = (value: number): string => {
    if (value < 0) return 'text-emerald-600 dark:text-emerald-400';
    if (value > 0) return 'text-red-600 dark:text-red-400';
    return 'text-slate-600 dark:text-slate-400';
};

export const providerShortLabels: Record<'bedrock' | 'vertex', string> = {
    bedrock: 'AWS',
    vertex: 'GCP'
};

export const providerFullLabels: Record<'bedrock' | 'vertex', string> = {
    bedrock: 'AWS Bedrock',
    vertex: 'GCP Vertex'
};