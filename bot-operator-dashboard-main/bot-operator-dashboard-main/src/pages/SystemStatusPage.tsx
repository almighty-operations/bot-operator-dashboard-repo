import { AppLayout } from '@/components/AppLayout';
import { StatusBadge } from '@/components/StatusBadge';
import { systemHealth } from '@/mocks/data';
import { Activity, Wifi, Database, BarChart3, RefreshCw, Cpu, Bell, Settings, AlertTriangle } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  'Exchange Connection': Wifi,
  'Database': Database,
  'Market Data Feed': BarChart3,
  'Reconciliation Service': RefreshCw,
  'Execution Engine': Cpu,
  'Alert Service': Bell,
  'Scheduler': Activity,
  'Config Sync': Settings,
};

const incidents = [
  { time: '2025-03-28T16:00:00Z', title: 'API Rate Limit Warning', desc: 'Exchange API usage reached 85% — throttling applied for 2 minutes', severity: 'CRITICAL' as const },
  { time: '2025-03-27T18:00:00Z', title: 'Database Connection Pool Exhaustion', desc: 'Connection pool maxed out — recovered automatically after 12 seconds', severity: 'CRITICAL' as const },
  { time: '2025-03-26T23:45:00Z', title: 'Order Execution Timeout', desc: 'Market order for LTCUSDT timed out — retried successfully after 5s', severity: 'CRITICAL' as const },
  { time: '2025-03-25T10:20:00Z', title: 'Candle Data Delay', desc: 'APTUSDT 15m candles delayed by 45 seconds — resolved automatically', severity: 'WARNING' as const },
];

export default function SystemStatusPage() {
  return (
    <AppLayout title="System Status" subtitle="Infrastructure health and monitoring">
      {/* Health Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {systemHealth.map(check => {
          const Icon = iconMap[check.name] || Activity;
          return (
            <div key={check.name} className="rounded-xl border border-border/60 bg-card p-5 hover:border-border/80 transition-all gradient-card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted/50">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <StatusBadge variant={check.status === 'Healthy' ? 'success' : check.status === 'Degraded' ? 'warning' : 'critical'} size="sm">
                  {check.status}
                </StatusBadge>
              </div>
              <h3 className="text-[13px] font-medium text-card-foreground mb-1">{check.name}</h3>
              <p className="text-[11px] text-muted-foreground mb-3 leading-relaxed">{check.message}</p>
              <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-3 border-t border-border/50">
                <span>Latency: <span className="font-mono text-card-foreground">{check.latency}ms</span></span>
                <span className="font-mono">{new Date(check.lastChecked).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="section-header mb-2">Last Successful Order</h3>
          <p className="text-[13px] font-mono text-card-foreground">2025-03-29 02:18 UTC</p>
          <p className="text-[11px] text-muted-foreground mt-1.5">DOGEUSDT Long — 11,500 units</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="section-header mb-2">Last Failed Action</h3>
          <p className="text-[13px] font-mono text-card-foreground">2025-03-26 16:30 UTC</p>
          <p className="text-[11px] text-muted-foreground mt-1.5">Order timeout — auto-retried successfully</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="section-header mb-2">Restart Recovery</h3>
          <p className="text-[13px] font-mono text-card-foreground">Clean — No recovery needed</p>
          <p className="text-[11px] text-muted-foreground mt-1.5">Last restart: 2025-03-25 06:00 UTC</p>
        </div>
      </div>

      {/* Recent Incidents */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center gap-2.5 px-6 py-4 border-b border-border">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <h2 className="text-[13px] font-semibold text-card-foreground">Recent Incidents</h2>
        </div>
        <div className="divide-y divide-border/40">
          {incidents.map((inc, i) => (
            <div key={i} className="px-6 py-4 hover:bg-accent/30 transition-colors">
              <div className="flex items-center gap-2.5 mb-1.5">
                <StatusBadge variant={inc.severity === 'CRITICAL' ? 'critical' : 'warning'} size="sm">{inc.severity}</StatusBadge>
                <span className="text-[13px] font-medium text-card-foreground">{inc.title}</span>
                <span className="text-[10px] text-muted-foreground font-mono ml-auto tabular-nums">{new Date(inc.time).toLocaleString()}</span>
              </div>
              <p className="text-[11px] text-muted-foreground ml-[76px]">{inc.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
