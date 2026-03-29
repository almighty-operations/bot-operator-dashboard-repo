import { cn } from '@/lib/utils';

interface ThresholdProgressProps {
  value: number;
  max?: number;
  warningThreshold?: number;
  emergencyThreshold?: number;
  label?: string;
  valueLabel?: string;
  className?: string;
}

export function ThresholdProgress({
  value,
  max = 100,
  warningThreshold,
  emergencyThreshold,
  label,
  valueLabel,
  className,
}: ThresholdProgressProps) {
  const pct = Math.min((value / max) * 100, 100);
  const isWarning = warningThreshold && value >= warningThreshold;
  const isEmergency = emergencyThreshold && value >= emergencyThreshold;
  const color = isEmergency ? 'bg-critical' : isWarning ? 'bg-warning' : 'bg-success';
  const glowColor = isEmergency
    ? 'shadow-[0_0_10px_-2px_hsl(0_72%_51%/0.6)]'
    : isWarning
    ? 'shadow-[0_0_10px_-2px_hsl(38_92%_50%/0.6)]'
    : 'shadow-[0_0_6px_-2px_hsl(152_69%_46%/0.4)]';

  return (
    <div className={cn('space-y-2', className)}>
      {(label || valueLabel) && (
        <div className="flex items-center justify-between">
          {label && <span className="text-[11px] text-muted-foreground font-medium">{label}</span>}
          {valueLabel && <span className="text-[11px] font-mono font-semibold text-card-foreground tabular-nums">{valueLabel}</span>}
        </div>
      )}
      <div className="relative h-2 w-full rounded-full bg-muted/80 overflow-visible">
        <div
          className={cn('h-full rounded-full transition-all duration-700 ease-out', color, glowColor)}
          style={{ width: `${pct}%` }}
        />
        {warningThreshold && (
          <div
            className="absolute -top-1 h-4 flex flex-col items-center group"
            style={{ left: `${(warningThreshold / max) * 100}%` }}
            title={`Warning: ${warningThreshold}%`}
          >
            <div className="w-px h-4 bg-warning/70" />
            <span className="absolute -top-4 text-[8px] font-mono text-warning/70 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {warningThreshold}%
            </span>
          </div>
        )}
        {emergencyThreshold && (
          <div
            className="absolute -top-1 h-4 flex flex-col items-center group"
            style={{ left: `${(emergencyThreshold / max) * 100}%` }}
            title={`Emergency: ${emergencyThreshold}%`}
          >
            <div className="w-px h-4 bg-critical/70" />
            <span className="absolute -top-4 text-[8px] font-mono text-critical/70 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {emergencyThreshold}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
