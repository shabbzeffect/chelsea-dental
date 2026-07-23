import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
}

export function Badge({ className, variant = 'neutral', children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'badge',
        variant === 'success' && 'badge-success',
        variant === 'warning' && 'badge-warning',
        variant === 'danger' && 'badge-danger',
        variant === 'info' && 'badge-info',
        variant === 'neutral' && 'badge-neutral',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

// Status badge mapper
const statusVariantMap: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
  // Appointment statuses
  scheduled: 'info',
  confirmed: 'success',
  in_progress: 'warning',
  completed: 'success',
  canceled: 'danger',
  no_show: 'warning',

  // Patient statuses
  active: 'success',
  inactive: 'neutral',
  transferred: 'info',

  // Invoice statuses
  pending: 'warning',
  paid: 'success',
  partial: 'warning',
  overdue: 'danger',

  // Payment statuses
  refunded: 'neutral',
  failed: 'danger',

  // Insurance claim statuses
  submitted: 'info',
  processing: 'warning',
  approved: 'success',
  denied: 'danger',
  appealed: 'warning',

  // Staff statuses
  on_leave: 'warning',
};

const statusLabelMap: Record<string, string> = {
  scheduled: 'Scheduled',
  confirmed: 'Confirmed',
  in_progress: 'In Progress',
  completed: 'Completed',
  canceled: 'Cancelled',
  no_show: 'No Show',
  active: 'Active',
  inactive: 'Inactive',
  transferred: 'Transferred',
  pending: 'Pending',
  paid: 'Paid',
  partial: 'Partial',
  overdue: 'Overdue',
  refunded: 'Refunded',
  failed: 'Failed',
  submitted: 'Submitted',
  processing: 'Processing',
  approved: 'Approved',
  denied: 'Denied',
  appealed: 'Appealed',
  on_leave: 'On Leave',
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant={statusVariantMap[status] || 'neutral'}>
      {statusLabelMap[status] || status}
    </Badge>
  );
}
