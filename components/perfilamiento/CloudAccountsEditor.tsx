import React, { memo } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { CloudAccount } from '@/types/db';
import { cn } from '@/lib/utils';

export type CloudProvider = 'azure' | 'aws' | 'gcp';

/**
 * Fila del editor. `_key` es sólo para React y para los handlers locales:
 * NO se envía al backend. El `id` (`clp-<id>`) lo genera y lo devuelve el
 * servidor, que es la única fuente de verdad — ver `lib/cloudAccounts.ts`.
 */
export type CloudAccountRow = {
  _key: string;
  id?: string;
  alias: string;
  db: string;
};

let rowCounter = 0;

function nextRowKey(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  rowCounter += 1;
  return `row-${Date.now()}-${rowCounter}`;
}

/** Convierte las cuentas persistidas en filas editables. */
export function toAccountRows(
  accounts: CloudAccount[] | undefined
): CloudAccountRow[] {
  return (accounts || []).map((acc) => ({
    _key: nextRowKey(),
    id: acc.id,
    alias: acc.alias,
    db: acc.db,
  }));
}

/** Fila nueva, todavía sin ID: lo asignará el servidor al guardar. */
export function newAccountRow(cloud: CloudProvider): CloudAccountRow {
  return {
    _key: nextRowKey(),
    alias: `Nueva Cuenta ${cloud.toUpperCase()}`,
    db: '',
  };
}

/** Payload para la API: se descarta `_key` y el `id` de las filas nuevas. */
export function toAccountsPayload(rows: CloudAccountRow[]) {
  return rows.map((row) => ({
    ...(row.id ? { id: row.id } : {}),
    alias: row.alias,
    db: row.db,
  }));
}

const THEME: Record<CloudProvider, { field: string; accent: string }> = {
  azure: {
    field: 'text-blue-700 border-blue-300',
    accent: 'text-blue-600 hover:text-blue-800',
  },
  aws: {
    field: 'text-amber-700 border-amber-300',
    accent: 'text-amber-600 hover:text-amber-800',
  },
  gcp: {
    field: 'text-emerald-700 border-emerald-300',
    accent: 'text-emerald-600 hover:text-emerald-800',
  },
};

interface AccountRowProps {
  account: CloudAccountRow;
  cloud: CloudProvider;
  onUpdate: (
    cloud: CloudProvider,
    rowKey: string,
    field: 'alias' | 'db',
    value: string
  ) => void;
  onRemove: (cloud: CloudProvider, rowKey: string) => void;
}

const AccountRow = memo(
  ({ account, cloud, onUpdate, onRemove }: AccountRowProps) => {
    const themeColor = THEME[cloud].field;

    return (
      <div className="grid grid-cols-6 gap-2 items-center py-2 border-b border-gray-200">
        <input
          type="text"
          value={account.id ?? 'Se asignará al guardar'}
          disabled
          title={
            account.id
              ? 'ID asignado por el servidor'
              : 'El servidor asignará un ID clp-… al guardar'
          }
          className={cn(
            'col-span-1 flex h-8 rounded-md border border-gray-100 bg-gray-50 px-2 text-xs cursor-not-allowed',
            account.id ? 'text-gray-500' : 'text-gray-400 italic'
          )}
        />
        <input
          type="text"
          value={account.alias}
          onChange={(e) =>
            onUpdate(cloud, account._key, 'alias', e.target.value)
          }
          required
          placeholder="Alias (Ej: Producción)"
          className={cn(
            'col-span-2 flex h-8 rounded-md border px-2 text-sm',
            themeColor
          )}
        />
        <input
          type="text"
          value={account.db}
          onChange={(e) => onUpdate(cloud, account._key, 'db', e.target.value)}
          required
          placeholder="Cadena de Conexión DB"
          className={cn(
            'col-span-2 flex h-8 rounded-md border px-2 text-xs',
            themeColor
          )}
        />
        <button
          type="button"
          onClick={() => onRemove(cloud, account._key)}
          className="col-span-1 text-red-500 hover:text-red-700 transition flex justify-center"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    );
  }
);

AccountRow.displayName = 'AccountRow';

interface AccountListEditorProps {
  cloud: CloudProvider;
  accounts: CloudAccountRow[];
  onUpdate: (
    cloud: CloudProvider,
    rowKey: string,
    field: 'alias' | 'db',
    value: string
  ) => void;
  onRemove: (cloud: CloudProvider, rowKey: string) => void;
  onAdd: (cloud: CloudProvider) => void;
}

export const AccountListEditor = memo(
  ({ cloud, accounts, onUpdate, onRemove, onAdd }: AccountListEditorProps) => (
    <div className="space-y-2 pt-1 border-t mt-2">
      <button
        type="button"
        onClick={() => onAdd(cloud)}
        className={cn(
          'flex items-center text-sm font-medium transition',
          THEME[cloud].accent
        )}
      >
        <Plus className="h-4 w-4 mr-1" /> Añadir Cuenta {cloud.toUpperCase()}
      </button>
      {accounts.map((acc) => (
        <AccountRow
          key={acc._key}
          account={acc}
          cloud={cloud}
          onUpdate={onUpdate}
          onRemove={onRemove}
        />
      ))}
    </div>
  )
);

AccountListEditor.displayName = 'AccountListEditor';
