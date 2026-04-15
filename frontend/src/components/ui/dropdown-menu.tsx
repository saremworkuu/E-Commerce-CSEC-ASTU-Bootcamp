import * as React from 'react';

import { cn } from '@/lib/utils';

type WithAsChild = {
  asChild?: boolean;
  children: React.ReactNode;
};

function DropdownMenu({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function DropdownMenuTrigger({ asChild, children, ...props }: WithAsChild & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  if (asChild) return <>{children}</>;
  return <button type="button" {...props}>{children}</button>;
}

function DropdownMenuContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('min-w-40 rounded-md border border-gray-200 bg-white p-1 shadow-md dark:border-neutral-800 dark:bg-neutral-900', className)}
      {...props}
    >
      {children}
    </div>
  );
}

function DropdownMenuLabel({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-2 py-1.5 text-xs font-semibold', className)} {...props} />;
}

function DropdownMenuSeparator({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('my-1 h-px bg-gray-200 dark:bg-neutral-800', className)} {...props} />;
}

function DropdownMenuItem({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn('flex w-full items-center rounded-sm px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-neutral-800', className)}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
};
