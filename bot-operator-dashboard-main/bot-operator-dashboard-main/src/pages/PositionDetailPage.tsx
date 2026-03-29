import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { KpiCard } from '@/components/KpiCard';
import { StatusBadge } from '@/components/StatusBadge';
import { EventTimeline } from '@/components/EventTimeline';
import { useSimulationData } from '@/contexts/SimulationContext';
import { positionEvents } from '@/mocks/data';
import { ArrowLeft } from 'lucide-react';

export default function PositionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { positions } = useSimulationData();
  const pos = positions.find(p => p.id === id);
  const events = id ? positionEvents[id] || [] : [];

  if (!pos) {
    return (
      <AppLayout title="Position Not Found">
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
          <p className="text-[14px] mb-4">Position not found</p>
          <button onClick={() => navigate('/positions')} className="text-primary text-[12px] hover:underline">
            Back to Positions
          </button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title={`${pos.symbol} ${pos.side}`} subtitle={`Position ${pos.id}`}>
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-card-foreground mb-5 transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Positions
      </button>

      {/* Summary Header */}
      <div className="rounded-xl border border-border bg-card p-6 mb-6 gradient-card">
        <div className="flex items-center gap-3 mb-5">
          <h2 className="text-xl font-semibold font-mono text-card-foreground tracking-tight">{pos.symbol}</h2>
          <StatusBadge variant={pos.side === 'Long' ? 'profit' : 'loss'}>{pos.side}</StatusBadge>
          <StatusBadge variant={pos.protectionStatus === 'Protected' ? 'success' : 'warning'}>{pos.protectionStatus}</StatusBadge>
          {pos.trailingActive && <StatusBadge variant="info">Trailing Active</StatusBadge>}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <KpiCard title="Entry Price" value={pos.entryPrice.toString()} compact />
          <KpiCard title="Mark Price" value={pos.markPrice.toString()} compact />
          <KpiCard title="Unrealized PnL" value={`${pos.unrealizedPnl >= 0 ? '+' : ''}$${pos.unrealizedPnl.toFixed(2)}`} variant={pos.unrealizedPnl >= 0 ? 'success' : 'critical'} trend={pos.unrealizedPnl >= 0 ? 'up' : 'down'} trendValue={`${pos.unrealizedPnlPercent}%`} compact />
          <KpiCard title="Quantity" value={pos.quantity.toString()} compact />
          <KpiCard title="Leverage" value={`${pos.leverage}x`} compact />
          <KpiCard title="Required Margin" value={`$${pos.requiredMargin.toFixed(2)}`} compact />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Signal & Risk Details */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="section-header mb-5">Signal & Risk Details</h3>
          <div className="space-y-0">
            {[
              ['RSI at Entry', pos.rsi.toString()],
              ['Risk Amount', `$${pos.riskAmount}`],
              ['Pulse Size', `$${pos.pulseSize}`],
              ['Initial Stop', pos.initialStop.toString()],
              ['Current Stop', pos.currentStop.toString()],
              ['Trailing Active', pos.trailingActive ? 'Yes' : 'No'],
              ['Open Time', new Date(pos.openTime).toLocaleString()],
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between py-3 border-b border-border/30 last:border-0 text-[12px]">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-mono font-medium text-card-foreground">{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Event Timeline */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="section-header mb-5">Event Timeline</h3>
          {events.length > 0 ? (
            <EventTimeline events={events} />
          ) : (
            <p className="text-[12px] text-muted-foreground py-8 text-center">No events recorded</p>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
