import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  iconColor?: 'teal' | 'blue' | 'green' | 'orange' | 'purple' | 'red';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const iconColorMap = {
  teal: 'bg-teal-100 text-teal-600',
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  orange: 'bg-orange-100 text-orange-600',
  purple: 'bg-purple-100 text-purple-600',
  red: 'bg-red-100 text-red-600',
};

export function StatCard({
  label,
  value,
  icon,
  iconColor = 'teal',
  trend,
  className,
  ...props
}: StatCardProps) {
  return (
    <div className={cn('stat-card', className)} {...props}>
      <div className="flex items-start justify-between">
        <div>
          <p className="stat-label">{label}</p>
          <p className="stat-value">{value}</p>
          {trend && (
            <p className={cn('text-xs font-medium mt-1', trend.isPositive ? 'text-green-600' : 'text-red-600')}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        {icon && (
          <div className={cn('stat-icon', iconColorMap[iconColor])}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
