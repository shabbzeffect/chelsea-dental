import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'btn',
          variant === 'primary' && 'btn-primary',
          variant === 'secondary' && 'btn-secondary',
          variant === 'danger' && 'btn-danger',
          variant === 'ghost' && 'btn-ghost',
          size === 'sm' && 'btn-sm',
          size === 'lg' && 'btn-lg',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <span className="spinner" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
