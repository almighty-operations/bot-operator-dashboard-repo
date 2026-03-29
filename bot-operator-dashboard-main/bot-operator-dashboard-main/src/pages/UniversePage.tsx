import { AppLayout } from '@/components/AppLayout';
import { StatusBadge } from '@/components/StatusBadge';
import { activeUniverse } from '@/mocks/data';
import { Globe, Info } from 'lucide-react';

export default function UniversePage() {
  const eligible = activeUniverse.filter(a => a.eligible);
  const excluded = activeUniverse.filter(a => !a.eligible);

  return (
    <AppLayout title="Universe" subtitle="Coin selection diagnostics and eligibility">
      <div className="rounded-xl border border-info/20 bg-info/5 p-5 mb-6 flex items-start gap-3">
        <Info className="h-4 w-4 text-info mt-0.5 shrink-0" />
        <div className="text-[12px] text-card-foreground leading-relaxed">
          <p className="font-medium mb-1">Universe Selection Policy</p>
          <p className="text-muted-foreground">The active universe is composed of the top 10 coins by rolling 7-day trading volume, <span className="font-medium text-warning">excluding BTC and ETH</span>. Universe is refreshed periodically based on rolling volume data.</p>
        </div>
      </div>

      {/* Active Universe */}
      <div className="rounded-xl border border-border bg-card mb-6 overflow-hidden">
        <div className="flex items-center gap-2.5 px-6 py-4 border-b border-border">
          <Globe className="h-4 w-4 text-primary" />
          <h2 className="text-[13px] font-semibold text-card-foreground">Active Universe</h2>
          <span className="text-[11px] text-muted-foreground ml-1">({eligible.length} symbols)</span>
        </div>
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-border bg-muted/20">
              <th className="text-left py-3 px-5 font-medium text-muted-foreground">Rank</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Symbol</th>
              <th className="text-right py-3 px-4 font-medium text-muted-foreground">Weekly Volume</th>
              <th className="text-right py-3 px-4 font-medium text-muted-foreground">24h Volume</th>
              <th className="text-right py-3 px-4 font-medium text-muted-foreground">Spread</th>
              <th className="text-right py-3 px-4 font-medium text-muted-foreground">Liquidity</th>
              <th className="text-center py-3 px-5 font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {eligible.map(a => (
              <tr key={a.symbol} className="border-b border-border/40 hover:bg-accent/40 transition-colors">
                <td className="py-3 px-5 font-mono text-muted-foreground">#{a.rank}</td>
                <td className="py-3 px-4 font-mono font-medium text-card-foreground">{a.symbol}</td>
                <td className="py-3 px-4 text-right font-mono text-card-foreground tabular-nums">${(a.weeklyVolume / 1e9).toFixed(1)}B</td>
                <td className="py-3 px-4 text-right font-mono text-muted-foreground tabular-nums">${(a.dailyVolume / 1e9).toFixed(1)}B</td>
                <td className="py-3 px-4 text-right font-mono text-muted-foreground tabular-nums">{a.spread.toFixed(2)}%</td>
                <td className="py-3 px-4 text-right font-mono text-card-foreground tabular-nums">{a.liquidityScore}</td>
                <td className="py-3 px-5 text-center"><StatusBadge variant="success" size="sm">Eligible</StatusBadge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Excluded */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center gap-2.5 px-6 py-4 border-b border-border">
          <h2 className="text-[13px] font-semibold text-card-foreground">Excluded Coins</h2>
          <span className="text-[11px] text-muted-foreground ml-1">({excluded.length})</span>
        </div>
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-border bg-muted/20">
              <th className="text-left py-3 px-5 font-medium text-muted-foreground">Symbol</th>
              <th className="text-right py-3 px-4 font-medium text-muted-foreground">Weekly Volume</th>
              <th className="text-right py-3 px-4 font-medium text-muted-foreground">Liquidity</th>
              <th className="text-left py-3 px-5 font-medium text-muted-foreground">Exclusion Reason</th>
            </tr>
          </thead>
          <tbody>
            {excluded.map(a => (
              <tr key={a.symbol} className="border-b border-border/40 hover:bg-accent/40 transition-colors">
                <td className="py-3 px-5 font-mono font-medium text-card-foreground">{a.symbol}</td>
                <td className="py-3 px-4 text-right font-mono text-muted-foreground tabular-nums">${(a.weeklyVolume / 1e9).toFixed(1)}B</td>
                <td className="py-3 px-4 text-right font-mono text-muted-foreground tabular-nums">{a.liquidityScore}</td>
                <td className="py-3 px-5 text-muted-foreground">{a.exclusionReason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
