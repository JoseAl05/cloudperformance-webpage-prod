export const bytesToMB = (bytes) => {
  if (typeof bytes !== 'number' || bytes < 0) {
    throw new Error('El valor debe ser un número mayor o igual a 0');
  }
  return (bytes / (1024 * 1024)).toFixed(2);
};

export const bytesToGB = (bytes: number): string => {
  if (typeof bytes !== 'number') {
    throw new Error('El valor debe ser un número');
  }
  return (bytes / (1024 * 1024 * 1024)).toFixed(2);
};
