import type { CloudAccount } from '@/types/db';

export type CloudProvider = 'aws' | 'azure' | 'gcp' | 'openai';

export const CLOUD_PROVIDERS: readonly CloudProvider[] = [
  'aws',
  'azure',
  'gcp',
  'openai',
] as const;

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
  openai: {
    label: 'Open IA',
    account: 'cuenta Open IA',
    accountPlural: 'cuentas Open IA',
  },
};

export const ACCOUNT_ID_PREFIX = 'clp-';

const ACCOUNT_ID_REGEX = /^clp-[A-Za-z0-9_-]+$/;

export class CloudAccountsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CloudAccountsError';
  }
}

export function generateAccountId(): string {
  return `${ACCOUNT_ID_PREFIX}${crypto.randomUUID()}`;
}

export function isValidAccountId(id: unknown): id is string {
  return typeof id === 'string' && ACCOUNT_ID_REGEX.test(id);
}

function readString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

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
