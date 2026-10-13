import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  className,
  variant = 'default',
  size = 'md',
  ...props
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50';
  
  const variants = {
    default: 'bg-black text-white hover:bg-gray-800',
    outline: 'border border-gray-300 hover:bg-gray-50',
    ghost: 'hover:bg-gray-100',
  };
  
  const sizes = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4',
    lg: 'h-12 px-6 text-lg',
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}