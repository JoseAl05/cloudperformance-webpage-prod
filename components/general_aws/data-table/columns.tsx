'use client';

import { ColumnDef } from '@tanstack/react-table';

export type DynamicColumn<T> = {
  header: string;
  accessorKey?: keyof T | string;
  accessorFn?: (row: T) => unknown;
  cell?: (info: unknown) => React.ReactNode;
  desc?: boolean;
  isDefaultSort?: boolean;
};

export const createColumns = <T extends object>(cols: DynamicColumn<T>[]): ColumnDef<T>[] => {
  return cols.map((col) => ({
    header: col.header,
    accessorKey: col.accessorKey ? String(col.accessorKey) : undefined,
    accessorFn: col.accessorFn,
    cell: (info) => {
      if (col.cell) {
        return col.cell(info)
      }
      const value = info.getValue();
      return String(value ?? '');
    },
    sortDescFirst: col.desc,
    meta: {
      isDefaultSort: col.isDefaultSort,
      defaultSortDesc: col.desc
    }
  }));
};