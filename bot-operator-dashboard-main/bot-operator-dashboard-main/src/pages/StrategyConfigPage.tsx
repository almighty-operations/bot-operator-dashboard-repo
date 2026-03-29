import { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { strategyConfig } from '@/mocks/data';
import { toast } from 'sonner';
import { Settings, Save, RotateCcw, AlertCircle } from 'lucide-react';
import type { StrategyConfig } from '@/types/trading';

export default function StrategyConfigPage() {
  const [config, setConfig] = useState<StrategyConfig>({ ...strategyConfig });
  const [hasChanges, setHasChanges] = useState(false);

  const update = <K extends keyof StrategyConfig>(key: K, value: StrategyConfig[K]) => {
    setConfig(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const save = () => { setHasChanges(false); toast.success('Strategy configuration saved'); };
  const revert = () => { setConfig({ ...strategyConfig }); setHasChanges(false); toast.info('Configuration reverted'); };

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
    <AppLayout title="Strategy Config" subtitle={`Version ${config.version} · Updated ${new Date(config.lastUpdated).toLocaleDateString()}`}>
      {hasChanges && (
        <div className="rounded-xl border border-warning/20 bg-warning/5 p-3.5 mb-6 flex items-center gap-2.5 text-[11px] text-warning">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span className="font-medium">You have unsaved changes</span>
        </div>
      )}

      <div className="rounded-xl border border-border/60 bg-card p-6 mb-5 gradient-card">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Settings className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h2 className="text-[13px] font-semibold text-card-foreground">RSI Signal Settings</h2>
            <p className="text-[10px] text-muted-foreground">Core signal detection parameters</p>
          </div>
        </div>
        <Field label="RSI Length" desc="Number of periods for RSI calculation">
          <NumInput value={config.rsiLength} onChange={v => update('rsiLength', v)} min={2} max={50} />
        </Field>
        <Field label="Entry Threshold" desc="RSI level to trigger entry signals">
          <NumInput value={config.entryThreshold} onChange={v => update('entryThreshold', v)} min={10} max={50} />
        </Field>
        <Field label="Management Threshold" desc="RSI level for position management decisions">
          <NumInput value={config.managementThreshold} onChange={v => update('managementThreshold', v)} min={40} max={80} />
        </Field>
        <Field label="Primary Timeframe" desc="Main chart timeframe for signal detection">
          <select value={config.primaryTimeframe} onChange={e => update('primaryTimeframe', e.target.value)}
            className="h-8 rounded-lg border border-input bg-muted/50 px-3 text-[11px] font-mono text-card-foreground focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="5m">5m</option><option value="15m">15m</option><option value="1h">1h</option><option value="4h">4h</option>
          </select>
        </Field>
      </div>

      <div className="rounded-xl border border-border/60 bg-card p-6 mb-5 gradient-card">
        <h2 className="text-[13px] font-semibold text-card-foreground mb-6">Trade Management</h2>
        <Field label="Confirmation Mode" desc="Require additional confirmation candle before entry">
          <Toggle value={config.confirmationMode} onChange={v => update('confirmationMode', v)} />
        </Field>
        <Field label="Red Candle Exit" desc="Exit position on bearish engulfing candle pattern">
          <Toggle value={config.redCandleExit} onChange={v => update('redCandleExit', v)} />
        </Field>
        <Field label="Trailing Buffer Type" desc="Method for calculating trailing stop distance">
          <select value={config.trailingBufferType} onChange={e => update('trailingBufferType', e.target.value as 'Fixed' | 'ATR' | 'Percentage')}
            className="h-8 rounded-lg border border-input bg-muted/50 px-3 text-[11px] font-mono text-card-foreground focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="Fixed">Fixed</option><option value="ATR">ATR</option><option value="Percentage">Percentage</option>
          </select>
        </Field>
        <Field label="Trailing Buffer Value" desc="Buffer value for trailing stop calculation">
          <NumInput value={config.trailingBufferValue} onChange={v => update('trailingBufferValue', v)} min={0.1} max={10} step={0.1} />
        </Field>
        <Field label="Long Only Mode" desc="Restrict bot to long positions only">
          <Toggle value={config.longOnlyMode} onChange={v => update('longOnlyMode', v)} />
        </Field>
        <Field label="Cooldown After Losses" desc="Number of consecutive losses before cooldown activates">
          <NumInput value={config.cooldownAfterLosses} onChange={v => update('cooldownAfterLosses', v)} min={1} max={10} />
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
