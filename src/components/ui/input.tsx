import * as React from 'react';
import { cn } from '@/src/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className, type = 'text', ...props }: InputProps) {
  return (
    <input
      type={type}
      className={cn(
        'flex h-11 w-full rounded-xl border border-[#DFD9CE] bg-[#FAF8F4] px-3.5 py-2 text-sm text-[#18181B] placeholder:text-[#8E8980] transition-colors focus-visible:outline-none focus-visible:border-[#E8612C] focus-visible:bg-white disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}
