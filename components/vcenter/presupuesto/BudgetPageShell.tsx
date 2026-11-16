import { CircleDollarSign } from 'lucide-react';
import type { ReactNode } from 'react';

interface BudgetPageShellProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function BudgetPageShell({ title, description, children }: BudgetPageShellProps) {
  return (
    <div className="w-full min-w-0 space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
          <CircleDollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
          {description ? <p className="text-gray-500 dark:text-gray-400">{description}</p> : null}
        </div>
      </div>
      {children}
    </div>
  );
}
