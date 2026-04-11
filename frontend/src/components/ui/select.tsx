import * as React from 'react';

import { cn } from '@/lib/utils';

type SelectContextType = {
  value?: string;
  onValueChange?: (value: string) => void;
};

const SelectContext = React.createContext<SelectContextType>({});

function Select({ value, onValueChange, children }: { value?: string; onValueChange?: (value: string) => void; children: React.ReactNode }) {
  return <SelectContext.Provider value={{ value, onValueChange }}>{children}</SelectContext.Provider>;
}

function SelectTrigger({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex h-10 items-center justify-between rounded-md border border-gray-200 px-3 text-sm dark:border-neutral-800', className)} {...props}>
      {children}
    </div>
  );
}

function SelectValue({ placeholder }: { placeholder?: string }) {
  const { value } = React.useContext(SelectContext);
  return <span>{value ?? placeholder ?? ''}</span>;
}

function SelectContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mt-1 rounded-md border border-gray-200 bg-white p-1 dark:border-neutral-800 dark:bg-neutral-900', className)} {...props}>
      {children}
    </div>
  );
}

function SelectItem({ value, className, children, ...props }: { value: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { onValueChange } = React.useContext(SelectContext);
  return (
    <button
      type="button"
      className={cn('flex w-full items-center rounded-sm px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-neutral-800', className)}
      onClick={() => onValueChange?.(value)}
      {...props}
    >
      {children}
    </button>
  );
}

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue };
