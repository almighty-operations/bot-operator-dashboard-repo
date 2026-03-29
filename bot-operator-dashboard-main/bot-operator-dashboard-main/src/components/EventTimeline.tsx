import { cn } from '@/lib/utils';
import type { PositionEvent } from '@/types/trading';

const eventIcons: Record<string, string> = {
  signal_detected: '📡',
  risk_approved: '✅',
  order_submitted: '📤',
  order_filled: '💰',
  initial_stop_attached: '🛡️',
  trailing_activated: '📈',
  stop_updated: '🔄',
  exit_triggered: '🚨',
  position_closed: '🏁',
};

const eventColors: Record<string, string> = {
  signal_detected: 'border-info/50',
  risk_approved: 'border-success/50',
  order_submitted: 'border-primary/50',
  order_filled: 'border-success/50',
  initial_stop_attached: 'border-warning/50',
  trailing_activated: 'border-info/50',
  stop_updated: 'border-info/50',
  exit_triggered: 'border-critical/50',
  position_closed: 'border-muted-foreground/50',
};

interface EventTimelineProps {
  events: PositionEvent[];
  className?: string;
}

export function EventTimeline({ events, className }: EventTimelineProps) {
  return (
    <div className={cn('space-y-0', className)}>
      {events.map((event, i) => (
        <div key={event.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full border-2 bg-card text-sm',
              eventColors[event.type] || 'border-border'
            )}>
              {eventIcons[event.type] || '•'}
            </div>
            {i < events.length - 1 && <div className="w-px flex-1 bg-border min-h-[24px]" />}
          </div>
          <div className="pb-4">
            <p className="text-sm font-medium text-card-foreground capitalize">
              {event.type.replace(/_/g, ' ')}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{event.description}</p>
            <p className="text-xs text-muted-foreground/70 font-mono mt-0.5">
              {new Date(event.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
