export const BRIDGE_ALLOWED_PREFIXES = {
  aws: [
    'advisor', 'autoscaling', 'aws', 'bedrock', 'db', 'ebs', 'eks', 'eventos',
    'facturacion', 'finops_metrics', 'funcion', 'get-all-tags', 'loadbalancersv2',
    'mantenedor-tags', 'multitenant', 'nat_gateways', 'rds', 'recursos', 'route53',
    's3', 'saving-plans', 'unused', 'vm',
  ],
  azure: ['azure', 'mantenedor-tags'],
  gcp: ['gcp', 'mantenedor-tags'],
  alertas: ['configurar', 'proyectos', 'servicios', 'historial', 'anomalias', 'budget'],
  presupuesto: ['aws', 'azure', 'gcp'],
  comparisonCloud: ['intercloud', 'intracloud'],
  connector: ['connector'],
  openai: ['openai'],
} as const satisfies Record<string, readonly string[]>;

export function isAllowedBridgePath(
  segments: readonly string[],
  allowedPrefixes: readonly string[]
): boolean {
  if (segments.length === 0) return false;
  const safeSegments = segments.every(
    (segment) => segment !== '' && segment !== '.' && segment !== '..' && !/[\\/]/.test(segment)
  );
  return safeSegments && allowedPrefixes.includes(segments[0]);
}
