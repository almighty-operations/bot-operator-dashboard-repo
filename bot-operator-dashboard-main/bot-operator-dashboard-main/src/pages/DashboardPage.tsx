import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { KpiCard } from '@/components/KpiCard';
import { StatusBadge, SeverityBadge } from '@/components/StatusBadge';
import { ThresholdProgress } from '@/components/ThresholdProgress';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useSimulationData } from '@/contexts/SimulationContext';
import { activeUniverse, systemHealth, performanceData } from '@/mocks/data';
import { toast } from 'sonner';
import {
  DollarSign, TrendingUp, Percent, Shield,
  Pause, Play, Ban, Check, RefreshCw, Globe, Bell, OctagonX, XCircle, ArrowRight,
} from 'lucide-react';
import {
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart,
} from 'recharts';
import { Link } from 'react-router-dom';

// Theme-aware chart styling via CSS variables
const getChartStyle = () => ({
  gridColor: 'hsl(var(--chart-grid))',
  tickColor: 'hsl(var(--chart-tick))',
  tooltip: {
    backgroundColor: 'hsl(var(--card))',
    border: '1px solid hsl(var(--border))',
    borderRadius: 10,
    fontSize: 11,
    padding: '8px 14px',
    boxShadow: '0 8px 32px -8px hsl(0 0% 0% / 0.4)',
    color: 'hsl(var(--card-foreground))',
  },
});

export default function DashboardPage() {
  const navigate = useNavigate();
  const { positions: openPositions, account: accountSummary, risk: riskSnapshot, alerts: alertsFeed } = useSimulationData();
  const [confirmAction, setConfirmAction] = useState<{ title: string; desc: string; action: () => void } | null>(null);

  const quickActions = [
    { label: 'Pause Bot', icon: Pause, danger: false, action: () => toast.success('Bot paused') },
    { label: 'Resume Bot', icon: Play, danger: false, action: () => toast.success('Bot resumed') },
    { label: 'Disable Entries', icon: Ban, danger: false, action: () => toast.success('New entries disabled') },
    { label: 'Enable Entries', icon: Check, danger: false, action: () => toast.success('New entries enabled') },
    { label: 'Reconcile Now', icon: RefreshCw, danger: false, action: () => toast.success('Reconciliation started') },
    { label: 'Refresh Universe', icon: Globe, danger: false, action: () => toast.success('Universe refresh triggered') },
    { label: 'Test Alert', icon: Bell, danger: false, action: () => toast.success('Test alert sent') },
    { label: 'Emergency Stop', icon: OctagonX, danger: true, action: () => {
      setConfirmAction({
        title: 'Emergency Stop',
        desc: 'This will immediately pause the bot and prevent all new entries. Existing positions will NOT be closed. Are you absolutely sure?',
        action: () => toast.error('Emergency stop activated'),
      });
    }},
    { label: 'Close All', icon: XCircle, danger: true, action: () => {
      setConfirmAction({
        title: 'Close All Positions',
        desc: 'This will submit market close orders for ALL open positions immediately. This action cannot be undone. Slippage may occur in volatile conditions.',
        action: () => toast.error('All positions closed'),
      });
    }},
  ];

  return (
    <AppLayout title="Dashboard" subtitle="Operator overview — real-time account status">
      {/* Risk Banner */}
      <div className="rounded-xl border border-border/60 bg-card p-4 md:p-6 mb-4 md:mb-6 gradient-card gradient-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 md:mb-5">
          <h2 className="text-[13px] font-semibold text-card-foreground flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" /> Account Risk Overview
          </h2>
          <div className="flex items-center gap-2">
            <StatusBadge variant={riskSnapshot.protectionStatus === 'Protected' ? 'success' : 'warning'}>{riskSnapshot.protectionStatus}</StatusBadge>
            <StatusBadge variant={riskSnapshot.newEntriesEnabled ? 'success' : 'critical'}>{riskSnapshot.newEntriesEnabled ? 'Entries Enabled' : 'Entries Disabled'}</StatusBadge>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-5">
          <ThresholdProgress value={riskSnapshot.usedMarginPercent} label="Used Margin" valueLabel={`${riskSnapshot.usedMarginPercent}%`} warningThreshold={riskSnapshot.warningThreshold} emergencyThreshold={riskSnapshot.emergencyThreshold} />
          <ThresholdProgress value={riskSnapshot.dailyLossPercent} max={riskSnapshot.maxDailyLossPercent} label="Daily Loss" valueLabel={`${riskSnapshot.dailyLossPercent}% / ${riskSnapshot.maxDailyLossPercent}%`} warningThreshold={riskSnapshot.maxDailyLossPercent * 0.7} emergencyThreshold={riskSnapshot.maxDailyLossPercent} />
          <ThresholdProgress value={riskSnapshot.weeklyDrawdownPercent} max={riskSnapshot.maxWeeklyDrawdownPercent} label="Weekly Drawdown" valueLabel={`${riskSnapshot.weeklyDrawdownPercent}% / ${riskSnapshot.maxWeeklyDrawdownPercent}%`} warningThreshold={riskSnapshot.maxWeeklyDrawdownPercent * 0.7} emergencyThreshold={riskSnapshot.maxWeeklyDrawdownPercent} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 pt-4 border-t border-border/50">
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Consec. Losses</p>
            <p className="text-lg font-mono font-semibold text-card-foreground">{riskSnapshot.consecutiveLosses}<span className="text-muted-foreground text-sm">/{riskSnapshot.maxConsecutiveLosses}</span></p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Eff. Leverage</p>
            <p className="text-lg font-mono font-semibold text-card-foreground">{riskSnapshot.effectiveLeverage}x</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Risk Mode</p>
            <p className="text-lg font-mono font-semibold text-card-foreground">{riskSnapshot.riskMode}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Open Positions</p>
            <p className="text-lg font-mono font-semibold text-card-foreground">{accountSummary.openPositionsCount}</p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-4 md:mb-6">
        <KpiCard title="Total Equity" value={`$${accountSummary.totalEquity.toLocaleString()}`} icon={<DollarSign className="h-3.5 w-3.5" />} />
        <KpiCard title="Daily PnL" value={`$${accountSummary.dailyPnl.toFixed(2)}`} trend={accountSummary.dailyPnl >= 0 ? 'up' : 'down'} trendValue={`${accountSummary.dailyPnlPercent}%`} variant={accountSummary.dailyPnl >= 0 ? 'success' : 'critical'} icon={<TrendingUp className="h-3.5 w-3.5" />} />
        <KpiCard title="Weekly PnL" value={`$${accountSummary.weeklyPnl.toFixed(2)}`} trend="up" trendValue={`${accountSummary.weeklyPnlPercent}%`} variant="success" icon={<TrendingUp className="h-3.5 w-3.5" />} />
        <KpiCard title="Monthly PnL" value={`$${accountSummary.monthlyPnl.toFixed(2)}`} trend="up" trendValue={`${accountSummary.monthlyPnlPercent}%`} variant="success" icon={<TrendingUp className="h-3.5 w-3.5" />} />
        <KpiCard title="Used Margin" value={`${accountSummary.usedMarginPercent}%`} subtitle={`$${accountSummary.usedMargin.toLocaleString()} of $${accountSummary.totalEquity.toLocaleString()}`} icon={<Percent className="h-3.5 w-3.5" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* Equity Chart */}
          <div className="rounded-xl border border-border bg-card p-4 md:p-6">
            <div className="flex items-center justify-between mb-4 md:mb-5">
              <h2 className="text-[13px] font-semibold text-card-foreground">Equity Curve</h2>
              <Link to="/analytics" className="text-[11px] text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
                Full Analytics <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            {(() => { const cs = getChartStyle(); return (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={cs.gridColor} vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: cs.tickColor }} tickFormatter={(v) => v.slice(5)} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: cs.tickColor }} domain={['dataMin - 500', 'dataMax + 500']} axisLine={false} tickLine={false} width={55} />
                <Tooltip contentStyle={cs.tooltip} />
                <Area type="monotone" dataKey="equity" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#equityGradient)" />
              </AreaChart>
            </ResponsiveContainer>
            ); })()}
          </div>

          {/* Open Positions Table */}
          <div className="rounded-xl border border-border/60 bg-card gradient-card">
            <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-border">
              <h2 className="text-[13px] font-semibold text-card-foreground">Open Positions</h2>
              <Link to="/positions" className="text-[11px] text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
                View All <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            {/* Mobile: stacked cards */}
            <div className="md:hidden divide-y divide-border/40">
              {openPositions.map((pos) => (
                <div
                  key={pos.id}
                  onClick={() => navigate(`/positions/${pos.id}`)}
                  className="p-4 hover:bg-accent/40 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-medium text-card-foreground text-[13px]">{pos.symbol}</span>
                      <StatusBadge variant={pos.side === 'Long' ? 'profit' : 'loss'} size="sm">{pos.side}</StatusBadge>
                    </div>
                    <span className={`font-mono font-semibold text-[12px] tabular-nums ${pos.unrealizedPnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                      {pos.unrealizedPnl >= 0 ? '+' : ''}${pos.unrealizedPnl.toFixed(2)}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[10px]">
                    <div>
                      <span className="text-muted-foreground">Entry</span>
                      <p className="font-mono text-card-foreground">{pos.entryPrice}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Mark</span>
                      <p className="font-mono text-card-foreground">{pos.markPrice}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Lev</span>
                      <p className="font-mono text-card-foreground">{pos.leverage}x</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <StatusBadge variant={pos.trailingActive ? 'success' : 'neutral'} size="sm">{pos.trailingActive ? 'Trail' : 'No Trail'}</StatusBadge>
                    <StatusBadge variant={pos.protectionStatus === 'Protected' ? 'success' : 'warning'} size="sm">{pos.protectionStatus}</StatusBadge>
                  </div>
                </div>
              ))}
            </div>
            {/* Desktop: table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-[11px] table-premium">
                <thead>
                  <tr className="border-b border-border bg-muted/20">
                    <th className="text-left py-2.5 px-4 font-medium text-muted-foreground">Symbol</th>
                    <th className="text-left py-2.5 px-3 font-medium text-muted-foreground">Side</th>
                    <th className="text-right py-2.5 px-3 font-medium text-muted-foreground">Entry</th>
                    <th className="text-right py-2.5 px-3 font-medium text-muted-foreground">Mark</th>
                    <th className="text-right py-2.5 px-3 font-medium text-muted-foreground">Lev</th>
                    <th className="text-right py-2.5 px-3 font-medium text-muted-foreground">Margin</th>
                    <th className="text-right py-2.5 px-3 font-medium text-muted-foreground">PnL</th>
                    <th className="text-right py-2.5 px-3 font-medium text-muted-foreground">RSI</th>
                    <th className="text-right py-2.5 px-3 font-medium text-muted-foreground">Stop</th>
                    <th className="text-center py-2.5 px-3 font-medium text-muted-foreground">Trail</th>
                    <th className="text-center py-2.5 px-4 font-medium text-muted-foreground">Protection</th>
                  </tr>
                </thead>
                <tbody>
                  {openPositions.map((pos) => (
                    <tr
                      key={pos.id}
                      onClick={() => navigate(`/positions/${pos.id}`)}
                      className="border-b border-border/40 hover:bg-accent/40 cursor-pointer transition-colors group"
                    >
                      <td className="py-3 px-4 font-medium font-mono text-card-foreground group-hover:text-primary transition-colors">{pos.symbol}</td>
                      <td className="py-3 px-3">
                        <StatusBadge variant={pos.side === 'Long' ? 'profit' : 'loss'} size="sm">{pos.side}</StatusBadge>
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-card-foreground tabular-nums">{pos.entryPrice}</td>
                      <td className="py-3 px-3 text-right font-mono text-card-foreground tabular-nums">{pos.markPrice}</td>
                      <td className="py-3 px-3 text-right font-mono text-muted-foreground">{pos.leverage}x</td>
                      <td className="py-3 px-3 text-right font-mono text-muted-foreground">${pos.requiredMargin.toFixed(0)}</td>
                      <td className={`py-3 px-3 text-right font-mono font-semibold tabular-nums ${pos.unrealizedPnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                        {pos.unrealizedPnl >= 0 ? '+' : ''}${pos.unrealizedPnl.toFixed(2)}
                        <span className="text-[10px] font-normal ml-1 opacity-70">({pos.unrealizedPnlPercent}%)</span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-muted-foreground">{pos.rsi}</td>
                      <td className="py-3 px-3 text-right font-mono text-muted-foreground">{pos.currentStop}</td>
                      <td className="py-3 px-3 text-center">
                        <StatusBadge variant={pos.trailingActive ? 'success' : 'neutral'} size="sm">{pos.trailingActive ? 'Active' : 'Off'}</StatusBadge>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <StatusBadge variant={pos.protectionStatus === 'Protected' ? 'success' : 'warning'} size="sm">{pos.protectionStatus}</StatusBadge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4 md:space-y-6">
          {/* Quick Actions */}
          <div className="rounded-xl border border-border/60 bg-card p-4 md:p-5 gradient-card">
            <h2 className="section-header mb-3">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-1.5">
              {quickActions.map((qa) => (
                <button
                  key={qa.label}
                  onClick={qa.action}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-[11px] font-medium transition-all duration-150 ${
                    qa.danger
                      ? 'bg-destructive/8 text-destructive border border-destructive/20 hover:bg-destructive/15 hover:border-destructive/30'
                      : 'bg-secondary/60 text-secondary-foreground hover:bg-secondary border border-transparent hover:border-border'
                  }`}
                >
                  <qa.icon className="h-3.5 w-3.5 shrink-0" />
                  {qa.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active Universe */}
          <div className="rounded-xl border border-border/60 bg-card p-4 md:p-5 gradient-card">
            <div className="flex items-center justify-between mb-3">
              <h2 className="section-header">Active Universe</h2>
              <Link to="/universe" className="text-[10px] text-primary hover:text-primary/80 flex items-center gap-0.5 transition-colors">
                Details <ArrowRight className="h-2.5 w-2.5" />
              </Link>
            </div>
            <div className="space-y-1">
              {activeUniverse.filter(a => a.eligible).map((asset) => (
                <div key={asset.symbol} className="flex items-center justify-between py-2 px-2.5 rounded-lg hover:bg-muted/40 transition-colors text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground font-mono w-5 text-right">{asset.rank}</span>
                    <span className="font-mono font-medium text-card-foreground">{asset.symbol}</span>
                  </div>
                  <span className="text-muted-foreground font-mono">${(asset.weeklyVolume / 1e9).toFixed(1)}B</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground mt-3 pt-2 border-t border-border/50">BTC and ETH excluded by policy</p>
          </div>

          {/* Alerts Feed */}
          <div className="rounded-xl border border-border/60 bg-card p-4 md:p-5 gradient-card">
            <div className="flex items-center justify-between mb-3">
              <h2 className="section-header">Recent Alerts</h2>
              <Link to="/alerts" className="text-[10px] text-primary hover:text-primary/80 flex items-center gap-0.5 transition-colors">
                View All <ArrowRight className="h-2.5 w-2.5" />
              </Link>
            </div>
            <div className="space-y-0 max-h-72 overflow-y-auto scrollbar-thin">
              {alertsFeed.slice(0, 8).map((alert) => (
                <div key={alert.id} className="flex gap-2.5 py-2.5 border-b border-border/30 last:border-0">
                  <SeverityBadge severity={alert.severity} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] text-card-foreground leading-snug">{alert.message}</p>
                    <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                      {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {alert.module}
                      {alert.symbol && <> · <span className="text-card-foreground">{alert.symbol}</span></>}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Health */}
          <div className="rounded-xl border border-border/60 bg-card p-4 md:p-5 gradient-card">
            <div className="flex items-center justify-between mb-3">
              <h2 className="section-header">System Health</h2>
              <Link to="/system" className="text-[10px] text-primary hover:text-primary/80 flex items-center gap-0.5 transition-colors">
                Details <ArrowRight className="h-2.5 w-2.5" />
              </Link>
            </div>
            <div className="space-y-0">
              {systemHealth.map((check) => (
                <div key={check.name} className="flex items-center justify-between py-2 text-[11px]">
                  <div className="flex items-center gap-2.5">
                    <div className={`h-[6px] w-[6px] rounded-full ${
                      check.status === 'Healthy' ? 'bg-success' : check.status === 'Degraded' ? 'bg-warning' : 'bg-critical'
                    }`} />
                    <span className="text-card-foreground">{check.name}</span>
                  </div>
                  <span className="text-muted-foreground font-mono tabular-nums">{check.latency}ms</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={!!confirmAction}
        onOpenChange={(open) => !open && setConfirmAction(null)}
        title={confirmAction?.title || ''}
        description={confirmAction?.desc || ''}
        confirmLabel="Yes, proceed"
        variant="destructive"
        onConfirm={() => {
          confirmAction?.action();
          setConfirmAction(null);
        }}
      />
    </AppLayout>
  );
}
