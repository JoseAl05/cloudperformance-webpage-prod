'use client';

import { ColumnDef } from '@tanstack/react-table';

export type DynamicColumn<T> = {
  header: string;
  accessorKey?: keyof T | string;
  accessorFn?: (row: T) => unknown;
  cell?: (value: unknown, row: T) => React.ReactNode;
};

export const createColumns = <T extends object>(cols: DynamicColumn<T>[]): ColumnDef<T>[] => {
  return cols.map((col) => ({
    header: col.header,
    accessorKey: col.accessorKey ? String(col.accessorKey) : undefined,
    accessorFn: col.accessorFn,
    cell: (info) => {
      const value = info.getValue();
      if (col.cell) {
        return col.cell(value, info.row.original);
      }
      return String(value ?? '');
    },
  }));
};