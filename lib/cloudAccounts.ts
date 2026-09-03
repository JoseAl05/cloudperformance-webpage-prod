import type { CloudAccount } from '@/types/db';

// =========================================================================
// AUTORIDAD ÚNICA DE CUENTAS CLOUD (`<cloud>_accounts`)
//
// Reglas del modelo:
//  - `<cloud>_accounts` SOLO existe cuando la nube está habilitada Y es
//    multi-tenant. En cualquier otro caso el campo NO debe existir en el
//    documento y la conexión se resuelve por `user_db_<cloud>`.
//  - El ID SIEMPRE lo genera el servidor con el formato `clp-<id>`.
//    El cliente nunca inventa IDs: si envía uno desconocido, se descarta.
//  - Los IDs de la empresa son la fuente de verdad y se propagan tal cual
//    a la colección `Users`.
// =========================================================================

export type CloudProvider = 'aws' | 'azure' | 'gcp';

export const CLOUD_PROVIDERS: readonly CloudProvider[] = [
  'aws',
  'azure',
  'gcp',
] as const;

/** Etiquetas para los mensajes de error, respetando la nomenclatura previa. */
export const CLOUD_LABELS: Record<
  CloudProvider,
  { label: string; account: string; accountPlural: string }
> = {
  aws: { label: 'AWS', account: 'cuenta AWS', accountPlural: 'cuentas AWS' },
  azure: {
    label: 'Azure',
    account: 'cuenta Azure',
    accountPlural: 'cuentas Azure',
  },
  gcp: {
    label: 'GCP',
    account: 'proyecto GCP',
    accountPlural: 'proyectos GCP',
  },
};

export const ACCOUNT_ID_PREFIX = 'clp-';

/** Acepta el formato actual (`clp-<uuid>`) y el heredado (`clp-<base36>`). */
const ACCOUNT_ID_REGEX = /^clp-[A-Za-z0-9_-]+$/;

/** Error de validación de cuentas: las rutas lo traducen a un HTTP 400. */
export class CloudAccountsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CloudAccountsError';
  }
}

/** Genera un ID único y estable con el formato `clp-<id>`. */
export function generateAccountId(): string {
  return `${ACCOUNT_ID_PREFIX}${crypto.randomUUID()}`;
}

export function isValidAccountId(id: unknown): id is string {
  return typeof id === 'string' && ACCOUNT_ID_REGEX.test(id);
}

function readString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

/**
 * Valida y normaliza el array de cuentas de una nube multi-tenant.
 *
 * Los IDs ya existentes en la empresa se conservan (para no romper las
 * referencias de los usuarios ya creados); cualquier otro caso — cuenta nueva,
 * ID con formato inválido o ID duplicado dentro del mismo envío — recibe un ID
 * nuevo generado por el servidor.
 *
 * @param cloud            Nube a la que pertenecen las cuentas.
 * @param rawAccounts      Array recibido en el body de la petición.
 * @param existingAccounts Cuentas actualmente persistidas en la empresa.
 * @throws {CloudAccountsError} si el array es inválido o está vacío.
 */
export function normalizeCloudAccounts(
  cloud: CloudProvider,
  rawAccounts: unknown,
  existingAccounts: CloudAccount[] = [],
): CloudAccount[] {
  const { account, accountPlural } = CLOUD_LABELS[cloud];

  if (!Array.isArray(rawAccounts) || rawAccounts.length === 0) {
    throw new CloudAccountsError(
      `Debe proporcionar al menos una ${account} en modo multi-tenant.`,
    );
  }

  const knownIds = new Set(
    existingAccounts
      .map((acc) => acc?.id)
      .filter((id): id is string => isValidAccountId(id)),
  );

  const usedIds = new Set<string>();

  return rawAccounts.map((raw) => {
    const source = (raw ?? {}) as Partial<CloudAccount>;

    const alias = readString(source.alias);
    const db = readString(source.db);

    if (!alias || !db) {
      throw new CloudAccountsError(
        `Todas las ${accountPlural} deben tener alias y db.`,
      );
    }

    // Se conserva el ID sólo si ya pertenecía a la empresa y no se repite.
    const candidateId = source.id;
    const canReuseId =
      isValidAccountId(candidateId) &&
      knownIds.has(candidateId) &&
      !usedIds.has(candidateId);

    const id = canReuseId ? (candidateId as string) : generateAccountId();
    usedIds.add(id);

    return { id, alias, db };
  });
}

/**
 * Copia las cuentas de la empresa hacia un usuario preservando los IDs.
 * Devuelve `undefined` cuando la empresa no tiene cuentas que propagar, para
 * que el campo simplemente no se escriba en el documento del usuario.
 */
export function cloneAccountsForUser(
  accounts: CloudAccount[] | null | undefined,
): CloudAccount[] | undefined {
  if (!Array.isArray(accounts) || accounts.length === 0) return undefined;

  return accounts.map((acc) => ({
    id: acc.id,
    alias: acc.alias,
    db: acc.db,
  }));
}
