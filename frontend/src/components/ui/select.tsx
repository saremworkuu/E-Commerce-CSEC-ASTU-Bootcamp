import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

type SelectContextType = {
  value?: string;
  onValueChange?: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const SelectContext = React.createContext<SelectContextType>({
  open: false,
  setOpen: () => {},
});

function Select({ value, onValueChange, children }: { value?: string; onValueChange?: (value: string) => void; children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  
  // Close dropdown when value changes
  const handleValueChange = (val: string) => {
    onValueChange?.(val);
    setOpen(false);
  };

  return (
    <SelectContext.Provider value={{ value, onValueChange: handleValueChange, open, setOpen }}>
      <div className="relative w-full">{children}</div>
    </SelectContext.Provider>
  );
}

function SelectTrigger({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { open, setOpen } = React.useContext(SelectContext);
  
  return (
    <div 
      className={cn(
        'flex h-10 items-center justify-between rounded-md border border-gray-200 px-3 text-sm dark:border-neutral-800 cursor-pointer select-none bg-white dark:bg-neutral-900', 
        className
      )} 
      onClick={() => setOpen(!open)}
      {...props}
    >
      {children}
      <ChevronDown className={cn('h-4 w-4 opacity-50 transition-transform duration-200', open && 'rotate-180')} />
    </div>
  );
}

function SelectValue({ placeholder }: { placeholder?: string }) {
  const { value } = React.useContext(SelectContext);
  return <span className="block truncate">{value || placeholder || ''}</span>;
}

function SelectContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { open, setOpen } = React.useContext(SelectContext);
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(event.target as Node) && !contentRef.current.previousElementSibling?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div 
      ref={contentRef}
      className={cn(
        'absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-gray-100 bg-white p-1 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 animate-in fade-in zoom-in-95 duration-100', 
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
}

function SelectItem({ value, className, children, ...props }: { value: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { onValueChange, value: selectedValue } = React.useContext(SelectContext);
  const isSelected = selectedValue === value;

  return (
    <button
      type="button"
      className={cn(
        'flex w-full items-center rounded-lg px-3 py-2.5 text-sm transition-colors',
        isSelected ? 'bg-gray-100 dark:bg-neutral-800 font-bold' : 'hover:bg-gray-50 dark:hover:bg-neutral-800/50',
        className
      )}
      onClick={() => onValueChange?.(value)}
      {...props}
    >
      {children}
    </button>
  );
}

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue };
