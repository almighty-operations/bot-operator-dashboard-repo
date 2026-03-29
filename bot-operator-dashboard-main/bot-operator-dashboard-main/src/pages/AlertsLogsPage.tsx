import { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { SeverityBadge } from '@/components/StatusBadge';
import { useSimulationData } from '@/contexts/SimulationContext';
import { Search, Filter } from 'lucide-react';

type Tab = 'all' | 'alerts' | 'trade' | 'system' | 'critical';

export default function AlertsLogsPage() {
  const { alerts: alertsFeed } = useSimulationData();
  const [tab, setTab] = useState<Tab>('all');
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  const tabs: { key: Tab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'alerts', label: 'Alerts' },
    { key: 'trade', label: 'Trade Events' },
    { key: 'system', label: 'System Logs' },
    { key: 'critical', label: 'Critical Only' },
  ];

  const filtered = alertsFeed.filter(a => {
    if (search && !a.message.toLowerCase().includes(search.toLowerCase()) && !(a.symbol || '').toLowerCase().includes(search.toLowerCase())) return false;
    if (severityFilter !== 'all' && a.severity !== severityFilter) return false;
    if (tab === 'critical' && a.severity !== 'CRITICAL') return false;
    if (tab === 'trade' && !['Execution', 'Signal'].includes(a.module)) return false;
    if (tab === 'system' && ['Execution', 'Signal'].includes(a.module)) return false;
    if (tab === 'alerts' && a.severity === 'INFO') return false;
    return true;
  });

  return (
    <AppLayout title="Alerts & Logs" subtitle="Operational event log and diagnostics">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex gap-1 bg-muted/50 rounded-lg p-1 border border-border overflow-x-auto">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-3 py-[7px] rounded-md text-[11px] font-medium transition-all duration-150 whitespace-nowrap ${
                tab === t.key
                  ? 'bg-card text-card-foreground shadow-sm border border-border'
                  : 'text-muted-foreground hover:text-card-foreground border border-transparent'
              }`}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
              className="h-8 w-full sm:w-44 rounded-lg border border-input bg-card pl-8 pr-3 text-[11px] text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-shadow" />
          </div>
          <select value={severityFilter} onChange={e => setSeverityFilter(e.target.value)}
            className="h-8 rounded-lg border border-input bg-card px-3 text-[11px] text-card-foreground focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="all">All Severity</option>
            <option value="INFO">INFO</option>
            <option value="WARNING">WARNING</option>
            <option value="CRITICAL">CRITICAL</option>
          </select>
        </div>
      </div>

      <div className="rounded-xl border border-border/60 bg-card overflow-hidden overflow-x-auto gradient-card">
        <table className="w-full text-[11px] table-premium">
          <thead>
            <tr className="border-b border-border bg-muted/20">
              <th className="text-left py-3 px-5 font-medium text-muted-foreground w-40">Timestamp</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground w-24">Severity</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground w-28">Module</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground w-24">Symbol</th>
              <th className="text-left py-3 px-5 font-medium text-muted-foreground">Message</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(a => (
              <tr key={a.id} className="border-b border-border/40 hover:bg-accent/40 transition-colors">
                <td className="py-3 px-5 font-mono text-muted-foreground tabular-nums">{new Date(a.timestamp).toLocaleString()}</td>
                <td className="py-3 px-4"><SeverityBadge severity={a.severity} /></td>
                <td className="py-3 px-4 text-card-foreground">{a.module}</td>
                <td className="py-3 px-4 font-mono text-card-foreground">{a.symbol || <span className="text-muted-foreground">—</span>}</td>
                <td className="py-3 px-5 text-card-foreground">{a.message}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="py-16 text-center text-muted-foreground">
                  <Filter className="h-6 w-6 mx-auto mb-2 opacity-30" />
                  <p className="text-[12px]">No logs match your filters</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
