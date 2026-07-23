import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return <div className={cn('card', className)} {...props} />;
}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export function CardHeader({ className, ...props }: CardHeaderProps) {
  return <div className={cn('card-header', className)} {...props} />;
}

export interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {}

export function CardBody({ className, ...props }: CardBodyProps) {
  return <div className={cn('card-body', className)} {...props} />;
}

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

export function CardFooter({ className, ...props }: CardFooterProps) {
  return <div className={cn('card-footer', className)} {...props} />;
}
