import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/src/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0 rounded-full text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8612C] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-45 cursor-pointer select-none',
  {
    variants: {
      variant: {
        default: 'bg-[#18181B] text-white hover:bg-[#27272A] active:scale-[0.99]',
        orange: 'bg-[#E8612C] text-white hover:bg-[#D45220] active:scale-[0.99] shadow-sm',
        outline:
          'border border-[#DED8CC] bg-white text-[#18181B] hover:bg-[#F5F1E8] hover:border-[#CBC3B4]',
        secondary: 'bg-[#EFECE4] text-[#18181B] hover:bg-[#E4DFD3]',
        ghost: 'text-[#52504C] hover:bg-[#EFECE4] hover:text-[#18181B]',
      },
      size: {
        default: 'h-10 px-5 py-2.5',
        sm: 'h-8 px-3.5 text-xs',
        lg: 'h-12 px-6 text-sm',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({
  className,
  variant,
  size,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
