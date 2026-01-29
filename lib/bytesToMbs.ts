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
