import { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { KpiCard } from '@/components/KpiCard';
import { ThresholdProgress } from '@/components/ThresholdProgress';
import { riskConfig, riskSnapshot } from '@/mocks/data';
import { toast } from 'sonner';
import { Shield, Save, RotateCcw, AlertCircle } from 'lucide-react';
import type { RiskConfig } from '@/types/trading';

export default function RiskControlsPage() {
  const [config, setConfig] = useState<RiskConfig>({ ...riskConfig });
  const [hasChanges, setHasChanges] = useState(false);

  const update = <K extends keyof RiskConfig>(key: K, value: RiskConfig[K]) => {
    setConfig(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const save = () => { setHasChanges(false); toast.success('Risk configuration saved'); };
  const revert = () => { setConfig({ ...riskConfig }); setHasChanges(false); toast.info('Configuration reverted'); };

  const Field = ({ label, desc, children }: { label: string; desc: string; children: React.ReactNode }) => (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between py-4 border-b border-border/40 last:border-0 gap-2 sm:gap-8">
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-card-foreground">{label}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );

  const NumInput = ({ value, onChange, min, max, step }: { value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number }) => (
    <input type="number" value={value} min={min} max={max} step={step}
      onChange={e => onChange(Number(e.target.value))}
      className="h-8 w-24 rounded-lg border border-input bg-muted/50 px-3 text-[11px] font-mono text-card-foreground text-right focus:outline-none focus:ring-1 focus:ring-ring transition-shadow" />
  );

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <button onClick={() => onChange(!value)} className={`relative h-[22px] w-10 rounded-full transition-colors duration-200 ${value ? 'bg-success' : 'bg-muted'}`}>
      <span className={`absolute top-[2px] h-[18px] w-[18px] rounded-full bg-foreground shadow-sm transition-transform duration-200 ${value ? 'translate-x-[20px]' : 'translate-x-[2px]'}`} />
    </button>
  );

  return (
    <AppLayout title="Risk Controls" subtitle={`Version ${config.version} · Updated ${new Date(config.lastUpdated).toLocaleDateString()}`}>
      {/* Live Risk Summary */}
      <div className="rounded-xl border border-primary/20 bg-card p-6 mb-6 gradient-card-elevated">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Shield className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h2 className="text-[13px] font-semibold text-card-foreground">Live Risk Summary</h2>
            <p className="text-[10px] text-muted-foreground">Real-time account risk metrics</p>
          </div>
        </div>
        <div className="space-y-4 mb-5">
          <ThresholdProgress value={riskSnapshot.usedMarginPercent} label="Used Margin" valueLabel={`${riskSnapshot.usedMarginPercent}%`} warningThreshold={riskSnapshot.warningThreshold} emergencyThreshold={riskSnapshot.emergencyThreshold} />
          <ThresholdProgress value={riskSnapshot.dailyLossPercent} max={riskSnapshot.maxDailyLossPercent} label="Daily PnL vs Max Loss" valueLabel={`${riskSnapshot.dailyLossPercent}% / ${riskSnapshot.maxDailyLossPercent}%`} warningThreshold={riskSnapshot.maxDailyLossPercent * 0.7} emergencyThreshold={riskSnapshot.maxDailyLossPercent} />
          <ThresholdProgress value={riskSnapshot.weeklyDrawdownPercent} max={riskSnapshot.maxWeeklyDrawdownPercent} label="Weekly Drawdown vs Max" valueLabel={`${riskSnapshot.weeklyDrawdownPercent}% / ${riskSnapshot.maxWeeklyDrawdownPercent}%`} warningThreshold={riskSnapshot.maxWeeklyDrawdownPercent * 0.7} emergencyThreshold={riskSnapshot.maxWeeklyDrawdownPercent} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <KpiCard title="Eff. Leverage" value={`${riskSnapshot.effectiveLeverage}x`} compact />
          <KpiCard title="Consec. Losses" value={`${riskSnapshot.consecutiveLosses}/${riskSnapshot.maxConsecutiveLosses}`} compact />
          <KpiCard title="Risk Mode" value={riskSnapshot.riskMode} variant={riskSnapshot.riskMode === 'Normal' ? 'success' : 'warning'} compact />
          <KpiCard title="New Entries" value={riskSnapshot.newEntriesEnabled ? 'Enabled' : 'Disabled'} variant={riskSnapshot.newEntriesEnabled ? 'success' : 'critical'} compact />
        </div>
      </div>

      {hasChanges && (
        <div className="rounded-xl border border-warning/20 bg-warning/5 p-3.5 mb-6 flex items-center gap-2.5 text-[11px] text-warning">
          <AlertCircle className="h-4 w-4 shrink-0" /><span className="font-medium">You have unsaved changes</span>
        </div>
      )}

      <div className="rounded-xl border border-border/60 bg-card p-6 mb-5 gradient-card">
        <h2 className="text-[13px] font-semibold text-card-foreground mb-6">Position Sizing</h2>
        <Field label="Risk % per Trade" desc="Maximum percentage of equity risked on a single trade"><NumInput value={config.riskPercentPerTrade} onChange={v => update('riskPercentPerTrade', v)} min={0.1} max={5} step={0.1} /></Field>
        <Field label="Pulse Cap ($)" desc="Maximum dollar amount per pulse/position"><NumInput value={config.pulseCap} onChange={v => update('pulseCap', v)} min={50} max={1000} /></Field>
        <Field label="Default Leverage" desc="Standard leverage applied to new positions"><NumInput value={config.defaultLeverage} onChange={v => update('defaultLeverage', v)} min={1} max={20} /></Field>
      </div>

      <div className="rounded-xl border border-border/60 bg-card p-6 mb-5 gradient-card">
        <h2 className="text-[13px] font-semibold text-card-foreground mb-6">Margin Limits</h2>
        <Field label="Max Used Margin %" desc="Hard cap on total margin utilization"><NumInput value={config.maxUsedMarginPercent} onChange={v => update('maxUsedMarginPercent', v)} min={10} max={100} /></Field>
        <Field label="Warning Margin %" desc="Threshold to trigger margin warnings"><NumInput value={config.warningMarginThreshold} onChange={v => update('warningMarginThreshold', v)} min={10} max={90} /></Field>
        <Field label="Emergency Margin %" desc="Threshold for emergency protocols"><NumInput value={config.emergencyMarginThreshold} onChange={v => update('emergencyMarginThreshold', v)} min={20} max={100} /></Field>
      </div>

      <div className="rounded-xl border border-border/60 bg-card p-6 mb-5 gradient-card">
        <h2 className="text-[13px] font-semibold text-card-foreground mb-6">Loss Limits</h2>
        <Field label="Max Daily Loss %" desc="Maximum allowed daily portfolio loss"><NumInput value={config.maxDailyLossPercent} onChange={v => update('maxDailyLossPercent', v)} min={0.5} max={10} step={0.5} /></Field>
        <Field label="Max Weekly Loss %" desc="Maximum allowed weekly drawdown"><NumInput value={config.maxWeeklyLossPercent} onChange={v => update('maxWeeklyLossPercent', v)} min={1} max={20} step={0.5} /></Field>
        <Field label="Max Open Positions" desc="Limit on simultaneous open positions"><NumInput value={config.maxOpenPositions} onChange={v => update('maxOpenPositions', v)} min={1} max={20} /></Field>
        <Field label="Max Consecutive Losses" desc="Consecutive losses before cooldown"><NumInput value={config.maxConsecutiveLosses} onChange={v => update('maxConsecutiveLosses', v)} min={1} max={15} /></Field>
        <Field label="Max Correlated Exposure %" desc="Max exposure to correlated assets"><NumInput value={config.maxCorrelatedExposure} onChange={v => update('maxCorrelatedExposure', v)} min={10} max={100} /></Field>
      </div>

      <div className="rounded-xl border border-border/60 bg-card p-6 mb-5 gradient-card">
        <h2 className="text-[13px] font-semibold text-card-foreground mb-6">Emergency Controls</h2>
        <Field label="Freeze on Critical Error" desc="Automatically freeze entries on critical system errors">
          <Toggle value={config.freezeOnCriticalError} onChange={v => update('freezeOnCriticalError', v)} />
        </Field>
        <Field label="Emergency Flatten Policy" desc="Auto-flatten behavior in emergency scenarios">
          <select value={config.emergencyFlattenPolicy} onChange={e => update('emergencyFlattenPolicy', e.target.value as 'Manual' | 'Auto' | 'Disabled')}
            className="h-8 rounded-lg border border-input bg-muted/50 px-3 text-[11px] font-mono text-card-foreground focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="Manual">Manual</option><option value="Auto">Auto</option><option value="Disabled">Disabled</option>
          </select>
        </Field>
      </div>

      <div className="flex items-center gap-3 justify-end">
        <button onClick={revert} className="flex items-center gap-1.5 h-9 px-5 rounded-lg bg-secondary/60 text-secondary-foreground text-[12px] font-medium hover:bg-secondary border border-transparent hover:border-border transition-all">
          <RotateCcw className="h-3.5 w-3.5" /> Revert
        </button>
        <button onClick={save} className="flex items-center gap-1.5 h-9 px-5 rounded-lg bg-primary text-primary-foreground text-[12px] font-medium hover:bg-primary/90 transition-all shadow-sm">
          <Save className="h-3.5 w-3.5" /> Save Changes
        </button>
      </div>
    </AppLayout>
  );
}
