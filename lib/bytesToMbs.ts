export const bytesToMB = (bytes:number) => {
  if (typeof bytes !== 'number' || bytes < 0) {
    throw new Error('El valor debe ser un número mayor o igual a 0');
  }
  return (bytes / (1024 * 1024)).toLocaleString('es-CL', { maximumFractionDigits: 2 });
};

export const bytesToGB = (bytes: number): string => {
  if (typeof bytes !== 'number') {
    throw new Error('El valor debe ser un número');
  }
  return (bytes / (1024 * 1024 * 1024)).toLocaleString('es-CL', { maximumFractionDigits: 2 });
};

export const formatGeneric = (value: number) => {
    if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B`;
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toFixed(2);
};

export const formatBytes = (value: number) => {
    if (value === 0) return '0 B/s';
    const k = 1024;
    const sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s', 'TB/s'];
    const i = Math.max(0, Math.floor(Math.log(value) / Math.log(k)));
    return parseFloat((value / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export const formatUsd = (value: number) => {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
