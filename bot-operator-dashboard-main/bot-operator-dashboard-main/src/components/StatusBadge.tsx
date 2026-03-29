import { cn } from '@/lib/utils';

type BadgeVariant = 'success' | 'warning' | 'critical' | 'info' | 'neutral' | 'profit' | 'loss';

interface StatusBadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  pulse?: boolean;
  size?: 'sm' | 'default';
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  critical: 'bg-critical/10 text-critical border-critical/20',
  info: 'bg-info/10 text-info border-info/20',
  neutral: 'bg-muted/60 text-muted-foreground border-border/60',
  profit: 'bg-profit/10 text-profit border-profit/20',
  loss: 'bg-loss/10 text-loss border-loss/20',
};

const dotColors: Record<BadgeVariant, string> = {
  success: 'bg-success',
  warning: 'bg-warning',
  critical: 'bg-critical',
  info: 'bg-info',
  neutral: 'bg-muted-foreground',
  profit: 'bg-profit',
  loss: 'bg-loss',
};

export function StatusBadge({ variant, children, pulse, size = 'default', className }: StatusBadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 rounded-md border font-medium whitespace-nowrap select-none',
      size === 'sm' ? 'px-1.5 py-[1px] text-[10px]' : 'px-2.5 py-[2px] text-[11px]',
      variants[variant],
      className
    )}>
      <span className={cn(
        'rounded-full shrink-0',
        size === 'sm' ? 'h-1 w-1' : 'h-1.5 w-1.5',
        dotColors[variant],
        pulse && 'animate-pulse'
      )} />
      {children}
    </span>
  );
}

export function SeverityBadge({ severity }: { severity: 'INFO' | 'WARNING' | 'CRITICAL' }) {
  const map: Record<string, BadgeVariant> = { INFO: 'info', WARNING: 'warning', CRITICAL: 'critical' };
  return <StatusBadge variant={map[severity]} pulse={severity === 'CRITICAL'} size="sm">{severity}</StatusBadge>;
}
