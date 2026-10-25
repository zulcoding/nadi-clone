import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  maxWidthClass?: string;
  ariaLabel: string;
}

export function Dialog({
  open,
  onOpenChange,
  children,
  maxWidthClass = 'max-w-4xl',
  ariaLabel,
}: DialogProps) {
  React.useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#18181B]/60"
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      onClick={(e) => {
        if (e.target === e.currentTarget) onOpenChange(false);
      }}
    >
      <div
        className={cn(
          'relative w-full overflow-hidden rounded-3xl border border-[#E5DFD3] bg-[#FAF8F4] shadow-2xl',
          maxWidthClass
        )}
      >
        {children}
      </div>
    </div>
  );
}

export interface DialogCloseButtonProps {
  onClick: () => void;
  className?: string;
}

export function DialogCloseButton({
  onClick,
  className,
}: DialogCloseButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Tutup dialog"
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#E5DFD3] bg-white text-[#52504C] hover:bg-[#F3EFE6] hover:text-[#18181B] transition-colors cursor-pointer',
        className
      )}
    >
      <X className="h-4 w-4" />
    </button>
  );
}
