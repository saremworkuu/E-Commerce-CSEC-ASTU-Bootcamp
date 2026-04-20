import * as React from 'react';
import { cn } from '@/lib/utils';
import { useState, useRef, useEffect, useContext, createContext } from 'react';

type DropdownContextType = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const DropdownContext = createContext<DropdownContextType>({ isOpen: false, setIsOpen: () => {} });

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="relative inline-block text-left" ref={menuRef}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

type WithAsChild = {
  asChild?: boolean;
  children: React.ReactNode;
};

export function DropdownMenuTrigger({ asChild, children, ...props }: WithAsChild & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { isOpen, setIsOpen } = useContext(DropdownContext);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: (e: any) => {
        setIsOpen(!isOpen);
        if (children.props.onClick) children.props.onClick(e);
      },
      ...props
    });
  }

  return (
    <button type="button" onClick={() => setIsOpen(!isOpen)} {...props}>
      {children}
    </button>
  );
}

export function DropdownMenuContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { isOpen } = useContext(DropdownContext);

  if (!isOpen) return null;

  // We set absolute on the parent DropdownMenu relative wrapper,
  // but for robust popup handling, anchor to top right natively
  return (
    <div
      className={cn('absolute right-2 top-full mt-1 w-48 origin-top-right rounded-md border border-gray-200 bg-white p-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 dark:border-neutral-800 dark:bg-neutral-900', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function DropdownMenuLabel({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-2 py-1.5 text-xs font-semibold', className)} {...props} />;
}

export function DropdownMenuSeparator({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('my-1 h-px bg-gray-200 dark:bg-neutral-800', className)} {...props} />;
}

export function DropdownMenuItem({ className, onClick, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { setIsOpen } = useContext(DropdownContext);
  
  return (
    <button
      type="button"
      onClick={(e) => {
        setIsOpen(false);
        if (onClick) onClick(e);
      }}
      className={cn('flex w-full items-center rounded-sm px-2 py-1.5 text-sm cursor-pointer hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-neutral-800 dark:hover:text-white', className)}
      {...props}
    />
  );
}
