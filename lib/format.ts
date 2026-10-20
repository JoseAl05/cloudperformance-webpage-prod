export const titleCase = (value: string): string =>
    value
        .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
        .replace(/[_-]+/g, ' ')
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

interface FormatCurrencyOptions {
    currency?: string
    locale?: string
}

export const formatCurrency = (
    value: number | null | undefined,
    { currency = 'USD', locale = 'es-CL' }: FormatCurrencyOptions = {}
): string => {
    if (typeof value !== 'number' || !Number.isFinite(value)) return '—';

    const tiny = value !== 0 && Math.abs(value) < 0.01;
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        currencyDisplay: 'narrowSymbol',
        ...(tiny ? { maximumSignificantDigits: 2 } : {}),
    }).format(value);
};
