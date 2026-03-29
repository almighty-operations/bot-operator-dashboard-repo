import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { StatusBadge } from '@/components/StatusBadge';
import { useSimulationData } from '@/contexts/SimulationContext';
import { closedTrades, rejectedTrades } from '@/mocks/data';
import { Search, Download, Filter } from 'lucide-react';

type Tab = 'open' | 'closed' | 'rejected';

export default function PositionsPage() {
  const navigate = useNavigate();
  const { positions: openPositions } = useSimulationData();
  const [tab, setTab] = useState<Tab>('open');
  const [search, setSearch] = useState('');

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'open', label: 'Open Positions', count: openPositions.length },
    { key: 'closed', label: 'Closed Positions', count: closedTrades.length },
    { key: 'rejected', label: 'Rejected Trades', count: rejectedTrades.length },
  ];

  const filteredOpen = openPositions.filter(p => p.symbol.toLowerCase().includes(search.toLowerCase()));
  const filteredClosed = closedTrades.filter(p => p.symbol.toLowerCase().includes(search.toLowerCase()));
  const filteredRejected = rejectedTrades.filter(p => p.symbol.toLowerCase().includes(search.toLowerCase()));

  return (
    <AppLayout title="Positions" subtitle="Manage and review all trades">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex gap-1 bg-muted/50 rounded-lg p-1 border border-border overflow-x-auto">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-3 sm:px-4 py-[7px] rounded-md text-[11px] font-medium transition-all duration-150 whitespace-nowrap ${
                tab === t.key
                  ? 'bg-card text-card-foreground shadow-sm border border-border'
                  : 'text-muted-foreground hover:text-card-foreground border border-transparent'
              }`}
            >
              {t.label}
              <span className={`ml-1.5 text-[10px] ${tab === t.key ? 'text-primary' : 'text-muted-foreground'}`}>
                {t.count}
              </span>
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search symbol..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="h-8 w-full sm:w-44 rounded-lg border border-input bg-card pl-8 pr-3 text-[11px] text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-shadow"
            />
          </div>
          <button className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-secondary/60 text-secondary-foreground text-[11px] font-medium hover:bg-secondary border border-transparent hover:border-border transition-all">
            <Download className="h-3.5 w-3.5" /> Export
          </button>
        </div>
      </div>

      {tab === 'open' && (
        <div className="rounded-xl border border-border/60 bg-card overflow-hidden overflow-x-auto gradient-card">
          <table className="w-full text-[11px] min-w-[900px] table-premium">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Symbol</th>
                <th className="text-left py-3 px-3 font-medium text-muted-foreground">Side</th>
                <th className="text-right py-3 px-3 font-medium text-muted-foreground">Entry</th>
                <th className="text-right py-3 px-3 font-medium text-muted-foreground">Mark</th>
                <th className="text-right py-3 px-3 font-medium text-muted-foreground">Qty</th>
                <th className="text-right py-3 px-3 font-medium text-muted-foreground">Lev</th>
                <th className="text-right py-3 px-3 font-medium text-muted-foreground">Margin</th>
                <th className="text-right py-3 px-3 font-medium text-muted-foreground">PnL</th>
                <th className="text-right py-3 px-3 font-medium text-muted-foreground">RSI</th>
                <th className="text-right py-3 px-3 font-medium text-muted-foreground">Stop</th>
                <th className="text-center py-3 px-3 font-medium text-muted-foreground">Trail</th>
                <th className="text-center py-3 px-3 font-medium text-muted-foreground">Protection</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Opened</th>
              </tr>
            </thead>
            <tbody>
              {filteredOpen.map(pos => (
                <tr key={pos.id} onClick={() => navigate(`/positions/${pos.id}`)} className="border-b border-border/40 hover:bg-accent/40 cursor-pointer transition-colors group">
                  <td className="py-3 px-4 font-mono font-medium text-card-foreground group-hover:text-primary transition-colors">{pos.symbol}</td>
                  <td className="py-3 px-3"><StatusBadge variant={pos.side === 'Long' ? 'profit' : 'loss'} size="sm">{pos.side}</StatusBadge></td>
                  <td className="py-3 px-3 text-right font-mono text-card-foreground tabular-nums">{pos.entryPrice}</td>
                  <td className="py-3 px-3 text-right font-mono text-card-foreground tabular-nums">{pos.markPrice}</td>
                  <td className="py-3 px-3 text-right font-mono text-muted-foreground tabular-nums">{pos.quantity}</td>
                  <td className="py-3 px-3 text-right font-mono text-muted-foreground">{pos.leverage}x</td>
                  <td className="py-3 px-3 text-right font-mono text-muted-foreground">${pos.requiredMargin.toFixed(0)}</td>
                  <td className={`py-3 px-3 text-right font-mono font-semibold tabular-nums ${pos.unrealizedPnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                    {pos.unrealizedPnl >= 0 ? '+' : ''}${pos.unrealizedPnl.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-muted-foreground">{pos.rsi}</td>
                  <td className="py-3 px-3 text-right font-mono text-muted-foreground">{pos.currentStop}</td>
                  <td className="py-3 px-3 text-center"><StatusBadge variant={pos.trailingActive ? 'success' : 'neutral'} size="sm">{pos.trailingActive ? 'Active' : 'Off'}</StatusBadge></td>
                  <td className="py-3 px-3 text-center"><StatusBadge variant={pos.protectionStatus === 'Protected' ? 'success' : 'warning'} size="sm">{pos.protectionStatus}</StatusBadge></td>
                  <td className="py-3 px-4 text-muted-foreground font-mono tabular-nums">{new Date(pos.openTime).toLocaleDateString()}</td>
                </tr>
              ))}
              {filteredOpen.length === 0 && (
                <tr><td colSpan={13} className="py-16 text-center text-muted-foreground">
                  <Filter className="h-6 w-6 mx-auto mb-2 opacity-30" />
                  <p className="text-[12px]">No open positions match your search</p>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'closed' && (
        <div className="rounded-xl border border-border/60 bg-card overflow-hidden overflow-x-auto gradient-card">
          <table className="w-full text-[11px] min-w-[800px] table-premium">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Symbol</th>
                <th className="text-left py-3 px-3 font-medium text-muted-foreground">Side</th>
                <th className="text-right py-3 px-3 font-medium text-muted-foreground">Entry</th>
                <th className="text-right py-3 px-3 font-medium text-muted-foreground">Exit</th>
                <th className="text-right py-3 px-3 font-medium text-muted-foreground">PnL</th>
                <th className="text-right py-3 px-3 font-medium text-muted-foreground">PnL %</th>
                <th className="text-left py-3 px-3 font-medium text-muted-foreground">Exit Reason</th>
                <th className="text-left py-3 px-3 font-medium text-muted-foreground">Duration</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredClosed.slice(0, 30).map(t => (
                <tr key={t.id} className="border-b border-border/40 hover:bg-accent/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-card-foreground">{t.symbol}</td>
                  <td className="py-3 px-3"><StatusBadge variant={t.side === 'Long' ? 'profit' : 'loss'} size="sm">{t.side}</StatusBadge></td>
                  <td className="py-3 px-3 text-right font-mono text-card-foreground tabular-nums">{t.entryPrice.toFixed(4)}</td>
                  <td className="py-3 px-3 text-right font-mono text-card-foreground tabular-nums">{t.exitPrice.toFixed(4)}</td>
                  <td className={`py-3 px-3 text-right font-mono font-semibold tabular-nums ${t.realizedPnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                    {t.realizedPnl >= 0 ? '+' : ''}${t.realizedPnl.toFixed(2)}
                  </td>
                  <td className={`py-3 px-3 text-right font-mono tabular-nums ${t.realizedPnlPercent >= 0 ? 'text-profit' : 'text-loss'}`}>
                    {t.realizedPnlPercent >= 0 ? '+' : ''}{t.realizedPnlPercent.toFixed(2)}%
                  </td>
                  <td className="py-3 px-3 text-muted-foreground">{t.exitReason}</td>
                  <td className="py-3 px-3 text-muted-foreground font-mono">{t.holdDuration}</td>
                  <td className="py-3 px-4 text-muted-foreground font-mono tabular-nums">{new Date(t.exitTime).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'rejected' && (
        <div className="rounded-xl border border-border/60 bg-card overflow-hidden overflow-x-auto gradient-card">
          <table className="w-full text-[11px] min-w-[700px] table-premium">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Symbol</th>
                <th className="text-left py-3 px-3 font-medium text-muted-foreground">Side</th>
                <th className="text-left py-3 px-3 font-medium text-muted-foreground">Rejection Reason</th>
                <th className="text-left py-3 px-3 font-medium text-muted-foreground">Related Threshold</th>
                <th className="text-right py-3 px-3 font-medium text-muted-foreground">Size</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredRejected.map(r => (
                <tr key={r.id} className="border-b border-border/40 hover:bg-accent/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-card-foreground">{r.symbol}</td>
                  <td className="py-3 px-3"><StatusBadge variant={r.side === 'Long' ? 'profit' : 'loss'} size="sm">{r.side}</StatusBadge></td>
                  <td className="py-3 px-3 text-card-foreground">{r.rejectionReason}</td>
                  <td className="py-3 px-3 text-muted-foreground font-mono">{r.relatedThreshold}</td>
                  <td className="py-3 px-3 text-right font-mono text-card-foreground">${r.requestedSize}</td>
                  <td className="py-3 px-4 text-muted-foreground font-mono tabular-nums">{new Date(r.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppLayout>
  );
}
