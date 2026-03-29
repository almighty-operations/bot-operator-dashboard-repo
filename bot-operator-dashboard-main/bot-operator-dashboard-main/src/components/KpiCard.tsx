import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  variant?: 'default' | 'success' | 'warning' | 'critical';
  compact?: boolean;
  className?: string;
}

const variantStyles = {
  default: 'border-border/60 hover:border-border',
  success: 'border-success/20 glow-success hover:border-success/30',
  warning: 'border-warning/20 glow-warning hover:border-warning/30',
  critical: 'border-critical/20 glow-critical hover:border-critical/30',
};

const variantAccents = {
  default: 'bg-muted-foreground/8',
  success: 'bg-success/10',
  warning: 'bg-warning/10',
  critical: 'bg-critical/10',
};

const variantIconColors = {
  default: 'text-muted-foreground',
  success: 'text-success',
  warning: 'text-warning',
  critical: 'text-critical',
};

export function KpiCard({ title, value, subtitle, icon, trend, trendValue, variant = 'default', compact, className }: KpiCardProps) {
  return (
    <div className={cn(
      'group relative rounded-xl border bg-card transition-all duration-200 gradient-card',
      compact ? 'p-3.5' : 'p-4',
      variantStyles[variant],
      className
    )}>
      <div className="flex items-center justify-between mb-2.5">
        <span className="section-header">{title}</span>
        {icon && (
          <span className={cn(
            'flex h-7 w-7 items-center justify-center rounded-lg transition-colors',
            variantAccents[variant],
            variantIconColors[variant]
          )}>
            {icon}
          </span>
        )}
      </div>
      <div className="flex items-baseline gap-2">
        <span className={cn(
          'font-semibold font-mono text-card-foreground tracking-tight',
          compact ? 'text-lg' : 'text-[22px]'
        )}>{value}</span>
        {trend && trendValue && (
          <span className={cn(
            'text-[11px] font-medium tracking-tight tabular-nums',
            trend === 'up' ? 'text-profit' : trend === 'down' ? 'text-loss' : 'text-muted-foreground'
          )}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '—'} {trendValue}
          </span>
        )}
      </div>
      {subtitle && <p className="text-[11px] text-muted-foreground mt-1.5 leading-snug">{subtitle}</p>}
    </div>
  );
}
