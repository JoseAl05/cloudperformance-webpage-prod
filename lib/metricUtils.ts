export const formatMetric = (value: number) => {
  if (value === 0) return '0';

  const absValue = Math.abs(value);

  if (absValue >= 1) {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }

  if (absValue < 0.000001) {
    return value.toExponential(2);
  }

  return new Intl.NumberFormat('en-US', {
    maximumSignificantDigits: 4,
  }).format(value);
};
