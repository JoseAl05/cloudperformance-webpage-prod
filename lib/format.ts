/**
 * Formateadores de texto y moneda compartidos por las vistas de AWS, Azure y GCP.
 */

/** `storage_account` / `blobService` / `file-service` → `Storage Account` / `Blob Service` / `File Service`. */
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
    /** Código ISO 4217. Por defecto `USD`. */
    currency?: string
    locale?: string
}

/**
 * Formatea un monto con `Intl.NumberFormat` (p. ej. `$1.234,56`).
 * Montos menores a una centésima se muestran con 2 cifras significativas en vez de `$0,00`.
 */
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
