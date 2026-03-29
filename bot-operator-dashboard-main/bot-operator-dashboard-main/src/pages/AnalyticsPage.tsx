import { AppLayout } from '@/components/AppLayout';
import { performanceData, symbolPerformance, exitReasonBreakdown, closedTrades } from '@/mocks/data';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, PieChart, Pie, Cell, Area, AreaChart, Legend,
} from 'recharts';

const CHART_COLORS = {
  primary: 'hsl(var(--primary))',
  profit: 'hsl(var(--profit))',
  loss: 'hsl(var(--loss))',
  warning: 'hsl(var(--warning))',
  purple: 'hsl(280 60% 55%)',
  cyan: 'hsl(180 60% 45%)',
};

const cs = () => ({
  grid: 'hsl(var(--chart-grid))',
  tick: 'hsl(var(--chart-tick))',
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

export default function AnalyticsPage() {
  const wins = closedTrades.filter(t => t.realizedPnl > 0).length;
  const losses = closedTrades.filter(t => t.realizedPnl <= 0).length;
  const winLossData = [
    { name: 'Wins', value: wins },
    { name: 'Losses', value: losses },
  ];
  const dailyPnlData = performanceData.map(p => ({ date: p.date, pnl: p.pnl }));
  const s = cs();

  const ChartCard = ({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) => (
    <div className={`rounded-xl border border-border/60 bg-card p-5 md:p-6 gradient-card hover:border-border/80 transition-all ${className}`}>
      <h3 className="section-header mb-5">{title}</h3>
      {children}
    </div>
  );

  return (
    <AppLayout title="Analytics" subtitle="Performance analysis and historical insights">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <ChartCard title="Equity Curve">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="eqGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_COLORS.primary} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={s.grid} vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: s.tick }} tickFormatter={v => v.slice(5)} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: s.tick }} axisLine={false} tickLine={false} width={55} />
              <Tooltip contentStyle={s.tooltip} />
              <Area type="monotone" dataKey="equity" stroke={CHART_COLORS.primary} strokeWidth={2} fill="url(#eqGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Daily PnL">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={dailyPnlData} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke={s.grid} vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: s.tick }} tickFormatter={v => v.slice(5)} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: s.tick }} axisLine={false} tickLine={false} width={50} />
              <Tooltip contentStyle={s.tooltip} />
              <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
                {dailyPnlData.map((entry, i) => (
                  <Cell key={i} fill={entry.pnl >= 0 ? CHART_COLORS.profit : CHART_COLORS.loss} opacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Drawdown">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="ddGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_COLORS.loss} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={CHART_COLORS.loss} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={s.grid} vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: s.tick }} tickFormatter={v => v.slice(5)} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: s.tick }} axisLine={false} tickLine={false} width={45} />
              <Tooltip contentStyle={s.tooltip} />
              <Area type="monotone" dataKey="drawdown" stroke={CHART_COLORS.loss} strokeWidth={2} fill="url(#ddGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Win / Loss Breakdown">
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={winLossData} cx="50%" cy="50%" innerRadius={65} outerRadius={95} paddingAngle={4} dataKey="value" strokeWidth={0}>
                  <Cell fill={CHART_COLORS.profit} />
                  <Cell fill={CHART_COLORS.loss} />
                </Pie>
                <Tooltip contentStyle={s.tooltip} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-8 mt-2 text-[11px]">
            <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm bg-success" /> Wins: {wins} ({((wins / (wins + losses)) * 100).toFixed(1)}%)</span>
            <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm bg-critical" /> Losses: {losses} ({((losses / (wins + losses)) * 100).toFixed(1)}%)</span>
          </div>
        </ChartCard>

        <ChartCard title="Used Margin Over Time">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="mgGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_COLORS.warning} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={CHART_COLORS.warning} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={s.grid} vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: s.tick }} tickFormatter={v => v.slice(5)} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: s.tick }} unit="%" axisLine={false} tickLine={false} width={40} />
              <Tooltip contentStyle={s.tooltip} />
              <Area type="monotone" dataKey="usedMargin" stroke={CHART_COLORS.warning} strokeWidth={2} fill="url(#mgGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Pulse Size Over Time">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="psGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_COLORS.purple} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={CHART_COLORS.purple} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={s.grid} vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: s.tick }} tickFormatter={v => v.slice(5)} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: s.tick }} unit="$" axisLine={false} tickLine={false} width={45} />
              <Tooltip contentStyle={s.tooltip} />
              <Area type="stepAfter" dataKey="pulseSize" stroke={CHART_COLORS.purple} strokeWidth={2} fill="url(#psGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Symbol Performance */}
      <div className="rounded-xl border border-border/60 bg-card p-5 md:p-6 mb-4 gradient-card">
        <h3 className="section-header mb-5">Performance by Symbol</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={symbolPerformance} layout="vertical" barSize={18}>
            <CartesianGrid strokeDasharray="3 3" stroke={s.grid} horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 10, fill: s.tick }} axisLine={false} tickLine={false} />
            <YAxis dataKey="symbol" type="category" tick={{ fontSize: 10, fill: s.tick }} width={75} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={s.tooltip} />
            <Bar dataKey="totalPnl" name="Total PnL" radius={[0, 5, 5, 0]}>
              {symbolPerformance.map((entry, i) => (
                <Cell key={i} fill={entry.totalPnl >= 0 ? CHART_COLORS.profit : CHART_COLORS.loss} opacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border/60 bg-card overflow-hidden gradient-card">
          <div className="px-5 py-4 border-b border-border/60">
            <h3 className="section-header">Exit Reason Breakdown</h3>
          </div>
          <table className="w-full text-[11px] table-premium">
            <thead>
              <tr className="border-b border-border/60">
                <th className="text-left py-3 px-5">Reason</th>
                <th className="text-right py-3 px-4">Count</th>
                <th className="text-right py-3 px-5">Total PnL</th>
              </tr>
            </thead>
            <tbody>
              {exitReasonBreakdown.map(er => (
                <tr key={er.reason}>
                  <td className="py-3 px-5 text-card-foreground">{er.reason}</td>
                  <td className="py-3 px-4 text-right font-mono text-muted-foreground tabular-nums">{er.count}</td>
                  <td className={`py-3 px-5 text-right font-mono font-semibold tabular-nums ${er.pnl >= 0 ? 'text-profit' : 'text-loss'}`}>{er.pnl >= 0 ? '+' : ''}${er.pnl.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-xl border border-border/60 bg-card overflow-hidden gradient-card">
          <div className="px-5 py-4 border-b border-border/60">
            <h3 className="section-header">Symbol Stats</h3>
          </div>
          <table className="w-full text-[11px] table-premium">
            <thead>
              <tr className="border-b border-border/60">
                <th className="text-left py-3 px-5">Symbol</th>
                <th className="text-right py-3 px-3">Trades</th>
                <th className="text-right py-3 px-3">Win Rate</th>
                <th className="text-right py-3 px-3">Avg Hold</th>
                <th className="text-right py-3 px-5">PnL</th>
              </tr>
            </thead>
            <tbody>
              {symbolPerformance.map(sp => (
                <tr key={sp.symbol}>
                  <td className="py-3 px-5 font-mono font-medium text-card-foreground">{sp.symbol}</td>
                  <td className="py-3 px-3 text-right font-mono text-muted-foreground tabular-nums">{sp.trades}</td>
                  <td className="py-3 px-3 text-right font-mono text-card-foreground tabular-nums">{sp.winRate}%</td>
                  <td className="py-3 px-3 text-right font-mono text-muted-foreground">{sp.avgHold}</td>
                  <td className={`py-3 px-5 text-right font-mono font-semibold tabular-nums ${sp.totalPnl >= 0 ? 'text-profit' : 'text-loss'}`}>{sp.totalPnl >= 0 ? '+' : ''}${sp.totalPnl.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
