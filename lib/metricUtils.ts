export const formatMetric = (value: number) => {
  if (value === 0) return '0';

  const absValue = Math.abs(value);

  // Caso 1: Números "normales" (mayores o iguales a 1)
  // Ej: 15.234 -> "15.23"
  if (absValue >= 1) {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }

  // Caso 2: Números extremadamente pequeños (menores a 0.000001)
  // Ej: 0.000000045 -> "4.50e-8" (Notación científica para que quepa en la tarjeta)
  if (absValue < 0.000001) {
    return value.toExponential(2);
  }

  // Caso 3: Números pequeños (entre 0.000001 y 1)
  // Ej: 0.000023482 -> "0.00002348" (Muestra 4 dígitos significativos, ignorando ceros a la izquierda)
  return new Intl.NumberFormat('en-US', {
    maximumSignificantDigits: 4,
  }).format(value);
};
