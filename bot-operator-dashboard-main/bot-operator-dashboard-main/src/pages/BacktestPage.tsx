import { useState, useMemo } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { KpiCard } from '@/components/KpiCard';
import {
  Play, RotateCcw, Download, Search, Calendar, TrendingUp, TrendingDown,
  BarChart3, Target, Clock, Zap, CheckCircle2, AlertTriangle, ChevronDown, ChevronUp,
  GitCompareArrows, Columns2, ListFilter, ArrowUpDown,
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, Cell, PieChart, Pie, Legend, LineChart, Line,
} from 'recharts';
import { backtestCoins, mockBacktestResults, type BacktestResult, type BacktestTrade } from '@/mocks/backtestData';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface StrategyConfigState {
  rsiLength: number;
  entryThreshold: number;
  managementThreshold: number;
  timeframe: string;
  trailingBufferType: string;
  trailingBufferValue: number;
  redCandleExit: boolean;
  longOnlyMode: boolean;
}

const defaultConfigA: StrategyConfigState = {
  rsiLength: 14, entryThreshold: 30, managementThreshold: 70,
  timeframe: '4h', trailingBufferType: 'ATR', trailingBufferValue: 1.5,
  redCandleExit: true, longOnlyMode: false,
};

const defaultConfigB: StrategyConfigState = {
  rsiLength: 10, entryThreshold: 25, managementThreshold: 75,
  timeframe: '4h', trailingBufferType: 'Percentage', trailingBufferValue: 2.5,
  redCandleExit: false, longOnlyMode: true,
};

function StrategyConfigPanel({
  config, onChange, label, color,
}: {
  config: StrategyConfigState;
  onChange: (c: StrategyConfigState) => void;
  label: string;
  color: string;
}) {
  return (
    <Card className={cn('border-border/60', color === 'A' ? 'border-l-2 border-l-primary' : 'border-l-2 border-l-amber-500')}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Badge variant={color === 'A' ? 'default' : 'secondary'} className={cn('text-[10px]', color === 'B' && 'bg-amber-500/20 text-amber-400 border-amber-500/30')}>
            {label}
          </Badge>
          Strategy Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-medium">RSI Length</Label>
            <div className="flex items-center gap-3">
              <Slider value={[config.rsiLength]} onValueChange={v => onChange({ ...config, rsiLength: v[0] })} min={5} max={50} step={1} className="flex-1" />
              <span className="text-sm font-mono w-8 text-right">{config.rsiLength}</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-medium">Entry Threshold</Label>
            <div className="flex items-center gap-3">
              <Slider value={[config.entryThreshold]} onValueChange={v => onChange({ ...config, entryThreshold: v[0] })} min={10} max={50} step={1} className="flex-1" />
              <span className="text-sm font-mono w-8 text-right">{config.entryThreshold}</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-medium">Management Threshold</Label>
            <div className="flex items-center gap-3">
              <Slider value={[config.managementThreshold]} onValueChange={v => onChange({ ...config, managementThreshold: v[0] })} min={50} max={90} step={1} className="flex-1" />
              <span className="text-sm font-mono w-8 text-right">{config.managementThreshold}</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-medium">Timeframe</Label>
            <Select value={config.timeframe} onValueChange={v => onChange({ ...config, timeframe: v })}>
              <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                {['15m', '30m', '1h', '2h', '4h', '6h', '8h', '12h', '1d'].map(tf => (
                  <SelectItem key={tf} value={tf}>{tf}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-medium">Trailing Buffer Type</Label>
            <Select value={config.trailingBufferType} onValueChange={v => onChange({ ...config, trailingBufferType: v })}>
              <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Fixed">Fixed</SelectItem>
                <SelectItem value="ATR">ATR</SelectItem>
                <SelectItem value="Percentage">Percentage</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-medium">Trailing Buffer Value</Label>
            <Input type="number" value={config.trailingBufferValue} onChange={e => onChange({ ...config, trailingBufferValue: Number(e.target.value) })} step={0.1} className="h-9 text-sm" />
          </div>
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Red Candle Exit</Label>
              <Switch checked={config.redCandleExit} onCheckedChange={v => onChange({ ...config, redCandleExit: v })} />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-xs">Long Only Mode</Label>
              <Switch checked={config.longOnlyMode} onCheckedChange={v => onChange({ ...config, longOnlyMode: v })} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MetricRow({ label, valA, valB, format: fmt, higherIsBetter = true }: {
  label: string; valA: number; valB: number; format?: (v: number) => string; higherIsBetter?: boolean;
}) {
  const f = fmt || ((v: number) => v.toFixed(2));
  const diff = valB - valA;
  const winner = higherIsBetter ? (diff > 0 ? 'B' : diff < 0 ? 'A' : null) : (diff < 0 ? 'B' : diff > 0 ? 'A' : null);
  return (
    <div className="grid grid-cols-4 items-center py-2 border-b border-border/20 last:border-0 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn('font-mono text-center', winner === 'A' && 'text-profit font-semibold')}>{f(valA)}</span>
      <span className={cn('font-mono text-center', winner === 'B' && 'text-profit font-semibold')}>{f(valB)}</span>
      <span className={cn('font-mono text-center text-xs', diff > 0 ? (higherIsBetter ? 'text-profit' : 'text-loss') : diff < 0 ? (higherIsBetter ? 'text-loss' : 'text-profit') : 'text-muted-foreground')}>
        {diff > 0 ? '+' : ''}{f(diff)}
      </span>
    </div>
  );
}

export default function BacktestPage() {
  const [selectedCoins, setSelectedCoins] = useState<string[]>(['SOLUSDT', 'XRPUSDT', 'DOGEUSDT', 'ADAUSDT', 'LINKUSDT']);
  const [coinSearch, setCoinSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('2022-01-01');
  const [dateTo, setDateTo] = useState('2026-03-29');

  const [configA, setConfigA] = useState<StrategyConfigState>(defaultConfigA);
  const [configB, setConfigB] = useState<StrategyConfigState>(defaultConfigB);

  const [isRunning, setIsRunning] = useState(false);
  const [activeResult, setActiveResult] = useState<BacktestResult | null>(mockBacktestResults[0]);
  const [activeTab, setActiveTab] = useState('configure');
  const [showHistory, setShowHistory] = useState(false);
  const [tradeFilter, setTradeFilter] = useState<'all' | 'winners' | 'losers'>('all');
  const [tradeSymbolFilter, setTradeSymbolFilter] = useState<string>('all');
  const [tradePage, setTradePage] = useState(0);
  const TRADES_PER_PAGE = 25;

  // Compare mode
  const [compareMode, setCompareMode] = useState(false);
  const [resultA, setResultA] = useState<BacktestResult | null>(null);
  const [resultB, setResultB] = useState<BacktestResult | null>(null);

  const filteredCoins = useMemo(() =>
    backtestCoins.filter(c => c.symbol.toLowerCase().includes(coinSearch.toLowerCase()) || c.name.toLowerCase().includes(coinSearch.toLowerCase())),
    [coinSearch]
  );

  const toggleCoin = (symbol: string) => {
    setSelectedCoins(prev => prev.includes(symbol) ? prev.filter(s => s !== symbol) : [...prev, symbol]);
  };

  const selectAll = () => setSelectedCoins(backtestCoins.map(c => c.symbol));
  const clearAll = () => setSelectedCoins([]);

  const runBacktest = () => {
    if (selectedCoins.length === 0) {
      toast.error('Select at least one coin to backtest');
      return;
    }
    setIsRunning(true);
    setActiveTab('results');
    const desc = compareMode ? `Running Config A & B with ${selectedCoins.length} coins` : `Running ${selectedCoins.length} coins from ${dateFrom} to ${dateTo}`;
    toast.info('Backtest started...', { description: desc });
    setTimeout(() => {
      setIsRunning(false);
      if (compareMode) {
        setResultA(mockBacktestResults[0]);
        setResultB(mockBacktestResults[2]);
        toast.success('Comparison complete', { description: 'Both strategies analyzed — view results below' });
      } else {
        setActiveResult(mockBacktestResults[0]);
        toast.success('Backtest completed', { description: `${mockBacktestResults[0].summary.totalTrades} trades analyzed` });
      }
    }, 3000);
  };

  const r = activeResult?.summary;

  // Merge equity curves for overlay chart
  const overlayData = useMemo(() => {
    if (!resultA || !resultB) return [];
    const mapA = new Map(resultA.equityCurve.map(p => [p.date, p.equity]));
    const mapB = new Map(resultB.equityCurve.map(p => [p.date, p.equity]));
    const allDates = [...new Set([...resultA.equityCurve.map(p => p.date), ...resultB.equityCurve.map(p => p.date)])].sort();
    return allDates.map(date => ({
      date,
      equityA: mapA.get(date) ?? null,
      equityB: mapB.get(date) ?? null,
    }));
  }, [resultA, resultB]);

  return (
    <AppLayout title="Backtesting" subtitle="Test strategy configurations against historical data (2020–2026)">
      <div className="space-y-5">
        {/* Actions bar */}
        <div className="flex items-center justify-between gap-2">
          <Button
            variant={compareMode ? 'default' : 'outline'}
            size="sm"
            onClick={() => { setCompareMode(!compareMode); setActiveTab('configure'); }}
            className={cn(compareMode && 'bg-amber-500/20 text-amber-400 border-amber-500/40 hover:bg-amber-500/30')}
          >
            <GitCompareArrows className="h-3.5 w-3.5 mr-1.5" />
            {compareMode ? 'Compare Mode ON' : 'Compare Mode'}
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowHistory(!showHistory)}>
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              History ({mockBacktestResults.length})
              {showHistory ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
            </Button>
            <Button
              size="sm"
              onClick={runBacktest}
              disabled={isRunning || selectedCoins.length === 0}
              className="bg-primary hover:bg-primary/90"
            >
              {isRunning ? <RotateCcw className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <Play className="h-3.5 w-3.5 mr-1.5" />}
              {isRunning ? 'Running...' : compareMode ? 'Run Comparison' : 'Run Backtest'}
            </Button>
          </div>
        </div>

        {/* History panel */}
        {showHistory && (
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Previous Backtest Runs</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/40">
                {mockBacktestResults.map(bt => (
                  <button
                    key={bt.id}
                    onClick={() => { setActiveResult(bt); setActiveTab('results'); setShowHistory(false); setCompareMode(false); }}
                    className="w-full flex items-center justify-between px-5 py-3 hover:bg-muted/40 transition-colors text-left"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{bt.coins.join(', ')}</p>
                      <p className="text-xs text-muted-foreground">{bt.dateFrom} → {bt.dateTo} • {bt.summary.totalTrades} trades</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-mono font-semibold ${bt.summary.totalPnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                        {bt.summary.totalPnl >= 0 ? '+' : ''}{bt.summary.totalPnlPercent.toFixed(1)}%
                      </p>
                      <p className="text-xs text-muted-foreground">{format(new Date(bt.runAt), 'MMM d, HH:mm')}</p>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-muted/50">
            <TabsTrigger value="configure">Configure</TabsTrigger>
            <TabsTrigger value="results" disabled={compareMode ? (!resultA || !resultB) && !isRunning : !activeResult && !isRunning}>
              {compareMode ? 'Comparison Results' : 'Results'}
            </TabsTrigger>
          </TabsList>

          {/* ── Configure Tab ── */}
          <TabsContent value="configure" className="space-y-5 mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Coin Selection */}
              <Card className="lg:col-span-2 border-border/60">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-sm">Coin Selection</CardTitle>
                      <CardDescription className="mt-0.5">
                        {selectedCoins.length} of {backtestCoins.length} coins selected • Data available from 2020
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={selectAll} className="text-xs h-7">Select All</Button>
                      <Button variant="ghost" size="sm" onClick={clearAll} className="text-xs h-7">Clear</Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input placeholder="Search coins..." value={coinSearch} onChange={e => setCoinSearch(e.target.value)} className="pl-9 h-9 text-sm" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-[400px] overflow-y-auto scrollbar-thin pr-1">
                    {filteredCoins.map(coin => (
                      <label
                        key={coin.symbol}
                        className={cn(
                          'flex items-center gap-3 rounded-lg border px-3 py-2.5 cursor-pointer transition-all',
                          selectedCoins.includes(coin.symbol) ? 'border-primary/50 bg-primary/5' : 'border-border/40 hover:border-border/80'
                        )}
                      >
                        <Checkbox checked={selectedCoins.includes(coin.symbol)} onCheckedChange={() => toggleCoin(coin.symbol)} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-mono font-medium text-foreground">{coin.symbol.replace('USDT', '')}</span>
                            <span className="text-xs text-muted-foreground">{coin.name}</span>
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-0.5">Data: {coin.dataFrom} → {coin.dataTo}</p>
                        </div>
                        <Badge variant="outline" className="text-[10px] shrink-0">
                          {Math.round((new Date(coin.dataTo).getTime() - new Date(coin.dataFrom).getTime()) / (365.25 * 86400000))}y
                        </Badge>
                      </label>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Date Range & Summary */}
              <div className="space-y-5">
                <Card className="border-border/60">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" /> Date Range
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">From</Label>
                      <Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="h-9 text-sm mt-1" />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">To</Label>
                      <Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="h-9 text-sm mt-1" />
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {[
                        { label: '1Y', from: '2025-03-29' },
                        { label: '2Y', from: '2024-03-29' },
                        { label: '4Y', from: '2022-03-29' },
                        { label: 'Max', from: '2020-01-01' },
                      ].map(p => (
                        <Button key={p.label} variant="outline" size="sm" className="h-7 text-xs flex-1" onClick={() => { setDateFrom(p.from); setDateTo('2026-03-29'); }}>
                          {p.label}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/60">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Run Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Coins</span><span className="font-medium">{selectedCoins.length}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Period</span><span className="font-mono text-xs">{dateFrom} → {dateTo}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Mode</span>
                      <Badge variant={compareMode ? 'secondary' : 'outline'} className={cn('text-[10px]', compareMode && 'bg-amber-500/20 text-amber-400')}>
                        {compareMode ? 'A vs B Comparison' : 'Single Run'}
                      </Badge>
                    </div>
                    {compareMode && (
                      <>
                        <div className="flex justify-between"><span className="text-muted-foreground">Config A</span><span className="font-mono text-xs">RSI {configA.rsiLength} / {configA.entryThreshold} / {configA.managementThreshold}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Config B</span><span className="font-mono text-xs">RSI {configB.rsiLength} / {configB.entryThreshold} / {configB.managementThreshold}</span></div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Strategy Configuration */}
            {compareMode ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <StrategyConfigPanel config={configA} onChange={setConfigA} label="Config A" color="A" />
                <StrategyConfigPanel config={configB} onChange={setConfigB} label="Config B" color="B" />
              </div>
            ) : (
              <Card className="border-border/60">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" /> Strategy Configuration Override
                  </CardTitle>
                  <CardDescription>Adjust parameters to test different strategy variations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">RSI Length</Label>
                      <div className="flex items-center gap-3">
                        <Slider value={[configA.rsiLength]} onValueChange={v => setConfigA({ ...configA, rsiLength: v[0] })} min={5} max={50} step={1} className="flex-1" />
                        <span className="text-sm font-mono w-8 text-right">{configA.rsiLength}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Entry Threshold (RSI)</Label>
                      <div className="flex items-center gap-3">
                        <Slider value={[configA.entryThreshold]} onValueChange={v => setConfigA({ ...configA, entryThreshold: v[0] })} min={10} max={50} step={1} className="flex-1" />
                        <span className="text-sm font-mono w-8 text-right">{configA.entryThreshold}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Management Threshold (RSI)</Label>
                      <div className="flex items-center gap-3">
                        <Slider value={[configA.managementThreshold]} onValueChange={v => setConfigA({ ...configA, managementThreshold: v[0] })} min={50} max={90} step={1} className="flex-1" />
                        <span className="text-sm font-mono w-8 text-right">{configA.managementThreshold}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Timeframe</Label>
                      <Select value={configA.timeframe} onValueChange={v => setConfigA({ ...configA, timeframe: v })}>
                        <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {['15m', '30m', '1h', '2h', '4h', '6h', '8h', '12h', '1d'].map(tf => (
                            <SelectItem key={tf} value={tf}>{tf}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Trailing Buffer Type</Label>
                      <Select value={configA.trailingBufferType} onValueChange={v => setConfigA({ ...configA, trailingBufferType: v })}>
                        <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Fixed">Fixed</SelectItem>
                          <SelectItem value="ATR">ATR</SelectItem>
                          <SelectItem value="Percentage">Percentage</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Trailing Buffer Value</Label>
                      <Input type="number" value={configA.trailingBufferValue} onChange={e => setConfigA({ ...configA, trailingBufferValue: Number(e.target.value) })} step={0.1} className="h-9 text-sm" />
                    </div>
                    <div className="space-y-3 pt-1">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs">Red Candle Exit</Label>
                        <Switch checked={configA.redCandleExit} onCheckedChange={v => setConfigA({ ...configA, redCandleExit: v })} />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-xs">Long Only Mode</Label>
                        <Switch checked={configA.longOnlyMode} onCheckedChange={v => setConfigA({ ...configA, longOnlyMode: v })} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ── Results Tab ── */}
          <TabsContent value="results" className="space-y-5 mt-4">
            {isRunning ? (
              <Card className="border-border/60">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <RotateCcw className="h-10 w-10 text-primary animate-spin mb-4" />
                  <p className="text-sm font-medium text-foreground">{compareMode ? 'Running comparison...' : 'Running backtest...'}</p>
                  <p className="text-xs text-muted-foreground mt-1">Analyzing {selectedCoins.length} coins across {dateFrom} to {dateTo}</p>
                  <div className="w-48 h-1.5 bg-muted rounded-full mt-4 overflow-hidden">
                    <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: '60%' }} />
                  </div>
                </CardContent>
              </Card>
            ) : compareMode && resultA && resultB ? (
              /* ── COMPARISON RESULTS ── */
              <>
                {/* Compare header */}
                <div className="flex items-center gap-3 px-1">
                  <Columns2 className="h-5 w-5 text-amber-400" />
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Strategy Comparison Results</h3>
                    <p className="text-xs text-muted-foreground">Config A vs Config B — same coins, same period, different parameters</p>
                  </div>
                </div>

                {/* Side-by-side KPIs */}
                <div className="grid grid-cols-2 gap-4">
                  <Card className="border-border/60 border-l-2 border-l-primary">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Badge className="text-[10px]">A</Badge> Config A Results
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-3">
                        <div><p className="text-[10px] text-muted-foreground">Return</p><p className={cn('text-lg font-mono font-bold', resultA.summary.totalPnlPercent >= 0 ? 'text-profit' : 'text-loss')}>+{resultA.summary.totalPnlPercent.toFixed(1)}%</p></div>
                        <div><p className="text-[10px] text-muted-foreground">Win Rate</p><p className="text-lg font-mono font-bold">{resultA.summary.winRate}%</p></div>
                        <div><p className="text-[10px] text-muted-foreground">Sharpe</p><p className="text-lg font-mono font-bold">{resultA.summary.sharpeRatio.toFixed(2)}</p></div>
                        <div><p className="text-[10px] text-muted-foreground">PnL</p><p className="text-sm font-mono">${resultA.summary.totalPnl.toLocaleString()}</p></div>
                        <div><p className="text-[10px] text-muted-foreground">Trades</p><p className="text-sm font-mono">{resultA.summary.totalTrades}</p></div>
                        <div><p className="text-[10px] text-muted-foreground">Max DD</p><p className="text-sm font-mono text-loss">{resultA.summary.maxDrawdownPercent}%</p></div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-border/60 border-l-2 border-l-amber-500">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Badge className="text-[10px] bg-amber-500/20 text-amber-400 border-amber-500/30">B</Badge> Config B Results
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-3">
                        <div><p className="text-[10px] text-muted-foreground">Return</p><p className={cn('text-lg font-mono font-bold', resultB.summary.totalPnlPercent >= 0 ? 'text-profit' : 'text-loss')}>+{resultB.summary.totalPnlPercent.toFixed(1)}%</p></div>
                        <div><p className="text-[10px] text-muted-foreground">Win Rate</p><p className="text-lg font-mono font-bold">{resultB.summary.winRate}%</p></div>
                        <div><p className="text-[10px] text-muted-foreground">Sharpe</p><p className="text-lg font-mono font-bold">{resultB.summary.sharpeRatio.toFixed(2)}</p></div>
                        <div><p className="text-[10px] text-muted-foreground">PnL</p><p className="text-sm font-mono">${resultB.summary.totalPnl.toLocaleString()}</p></div>
                        <div><p className="text-[10px] text-muted-foreground">Trades</p><p className="text-sm font-mono">{resultB.summary.totalTrades}</p></div>
                        <div><p className="text-[10px] text-muted-foreground">Max DD</p><p className="text-sm font-mono text-loss">{resultB.summary.maxDrawdownPercent}%</p></div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Overlayed Equity Curves */}
                <Card className="border-border/60">
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <GitCompareArrows className="h-4 w-4 text-amber-400" />
                      Equity Curve Overlay
                    </CardTitle>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-1.5"><span className="h-2 w-4 rounded-sm bg-primary inline-block" /> Config A</span>
                      <span className="flex items-center gap-1.5"><span className="h-2 w-4 rounded-sm bg-amber-500 inline-block" /> Config B</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={overlayData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                          <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} />
                          <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                          <Tooltip
                            contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }}
                            formatter={(v: number, name: string) => [`$${v?.toLocaleString() ?? '—'}`, name === 'equityA' ? 'Config A' : 'Config B']}
                          />
                          <Line type="monotone" dataKey="equityA" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} connectNulls />
                          <Line type="monotone" dataKey="equityB" stroke="#f59e0b" strokeWidth={2} dot={false} connectNulls />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Detailed metrics comparison table */}
                <Card className="border-border/60">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Detailed Metrics Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 items-center py-2 border-b border-border/40 text-xs font-medium text-muted-foreground">
                      <span>Metric</span>
                      <span className="text-center">Config A</span>
                      <span className="text-center">Config B</span>
                      <span className="text-center">Δ Delta</span>
                    </div>
                    <MetricRow label="Total Return %" valA={resultA.summary.totalPnlPercent} valB={resultB.summary.totalPnlPercent} format={v => `${v.toFixed(1)}%`} />
                    <MetricRow label="Total PnL" valA={resultA.summary.totalPnl} valB={resultB.summary.totalPnl} format={v => `$${v.toLocaleString()}`} />
                    <MetricRow label="Win Rate" valA={resultA.summary.winRate} valB={resultB.summary.winRate} format={v => `${v.toFixed(1)}%`} />
                    <MetricRow label="Total Trades" valA={resultA.summary.totalTrades} valB={resultB.summary.totalTrades} format={v => v.toFixed(0)} />
                    <MetricRow label="Sharpe Ratio" valA={resultA.summary.sharpeRatio} valB={resultB.summary.sharpeRatio} />
                    <MetricRow label="Sortino Ratio" valA={resultA.summary.sortinoRatio} valB={resultB.summary.sortinoRatio} />
                    <MetricRow label="Profit Factor" valA={resultA.summary.profitFactor} valB={resultB.summary.profitFactor} />
                    <MetricRow label="Max Drawdown %" valA={resultA.summary.maxDrawdownPercent} valB={resultB.summary.maxDrawdownPercent} format={v => `${v.toFixed(1)}%`} higherIsBetter={false} />
                    <MetricRow label="Avg Win" valA={resultA.summary.avgWin} valB={resultB.summary.avgWin} format={v => `$${v.toFixed(2)}`} />
                    <MetricRow label="Avg Loss" valA={Math.abs(resultA.summary.avgLoss)} valB={Math.abs(resultB.summary.avgLoss)} format={v => `$${v.toFixed(2)}`} higherIsBetter={false} />
                    <MetricRow label="Best Trade" valA={resultA.summary.bestTrade} valB={resultB.summary.bestTrade} format={v => `$${v.toLocaleString()}`} />
                    <MetricRow label="Ending Equity" valA={resultA.summary.endingEquity} valB={resultB.summary.endingEquity} format={v => `$${v.toLocaleString()}`} />
                  </CardContent>
                </Card>

                {/* Config comparison side by side */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <Card className="border-border/60 border-l-2 border-l-primary">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2"><Badge className="text-[10px]">A</Badge> Strategy Config</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      {Object.entries(resultA.strategyConfig).map(([k, v]) => (
                        <div key={k} className="flex justify-between">
                          <span className="text-muted-foreground capitalize">{k.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <span className="font-mono font-medium">{String(v)}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                  <Card className="border-border/60 border-l-2 border-l-amber-500">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2"><Badge className="text-[10px] bg-amber-500/20 text-amber-400 border-amber-500/30">B</Badge> Strategy Config</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      {Object.entries(resultB.strategyConfig).map(([k, v]) => (
                        <div key={k} className="flex justify-between">
                          <span className="text-muted-foreground capitalize">{k.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <span className="font-mono font-medium">{String(v)}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </>
            ) : !compareMode && activeResult ? (
              /* ── SINGLE RESULT ── */
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  <KpiCard title="Total PnL" value={`$${r!.totalPnl.toLocaleString()}`} trend={r!.totalPnlPercent >= 0 ? 'up' : 'down'} trendValue={`${r!.totalPnlPercent.toFixed(1)}%`} icon={<TrendingUp className="h-4 w-4" />} />
                  <KpiCard title="Win Rate" value={`${r!.winRate}%`} trend={r!.winRate >= 50 ? 'up' : 'down'} trendValue={`${(r!.winRate - 50).toFixed(1)}% vs 50%`} icon={<Target className="h-4 w-4" />} />
                  <KpiCard title="Total Trades" value={r!.totalTrades.toLocaleString()} icon={<BarChart3 className="h-4 w-4" />} />
                  <KpiCard title="Sharpe Ratio" value={r!.sharpeRatio.toFixed(2)} trend={r!.sharpeRatio >= 1 ? 'up' : 'down'} trendValue={`${r!.sharpeRatio.toFixed(2)}`} icon={<Zap className="h-4 w-4" />} />
                  <KpiCard title="Max Drawdown" value={`${r!.maxDrawdownPercent.toFixed(1)}%`} trend="down" trendValue={`-${r!.maxDrawdownPercent.toFixed(1)}%`} icon={<TrendingDown className="h-4 w-4" />} />
                  <KpiCard title="Profit Factor" value={r!.profitFactor.toFixed(2)} trend={r!.profitFactor >= 1 ? 'up' : 'down'} trendValue={`${r!.profitFactor.toFixed(2)}x`} icon={<CheckCircle2 className="h-4 w-4" />} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  <Card className="border-border/60">
                    <CardHeader className="pb-2"><CardTitle className="text-sm">Performance Summary</CardTitle></CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      {[
                        ['Starting Equity', `$${r!.startingEquity.toLocaleString()}`],
                        ['Ending Equity', `$${r!.endingEquity.toLocaleString()}`],
                        ['Return', `${r!.totalPnlPercent.toFixed(1)}%`],
                        ['Winning Trades', `${r!.winningTrades}`],
                        ['Losing Trades', `${r!.losingTrades}`],
                        ['Avg Win', `$${r!.avgWin.toFixed(2)}`],
                        ['Avg Loss', `$${r!.avgLoss.toFixed(2)}`],
                        ['Best Trade', `$${r!.bestTrade.toLocaleString()}`],
                        ['Worst Trade', `$${r!.worstTrade.toLocaleString()}`],
                        ['Avg Hold Duration', r!.avgHoldDuration],
                        ['Sortino Ratio', r!.sortinoRatio.toFixed(2)],
                      ].map(([label, val]) => (
                        <div key={label as string} className="flex justify-between">
                          <span className="text-muted-foreground">{label}</span>
                          <span className="font-mono font-medium">{val}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                  <Card className="border-border/60">
                    <CardHeader className="pb-2"><CardTitle className="text-sm">Strategy Config Used</CardTitle></CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      {[
                        ['RSI Length', activeResult.strategyConfig.rsiLength],
                        ['Entry Threshold', activeResult.strategyConfig.entryThreshold],
                        ['Mgmt Threshold', activeResult.strategyConfig.managementThreshold],
                        ['Timeframe', activeResult.strategyConfig.timeframe],
                        ['Trailing Buffer', `${activeResult.strategyConfig.trailingBufferType} ${activeResult.strategyConfig.trailingBufferValue}`],
                        ['Red Candle Exit', activeResult.strategyConfig.redCandleExit ? 'Yes' : 'No'],
                        ['Long Only', activeResult.strategyConfig.longOnlyMode ? 'Yes' : 'No'],
                      ].map(([label, val]) => (
                        <div key={label as string} className="flex justify-between">
                          <span className="text-muted-foreground">{label}</span>
                          <span className="font-mono font-medium">{val}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                  <Card className="border-border/60">
                    <CardHeader className="pb-2"><CardTitle className="text-sm">Performance by Symbol</CardTitle></CardHeader>
                    <CardContent className="p-0">
                      <div className="divide-y divide-border/30">
                        {activeResult.tradesBySymbol.map(s => (
                          <div key={s.symbol} className="flex items-center justify-between px-5 py-2.5">
                            <div>
                              <span className="text-sm font-mono font-medium">{s.symbol.replace('USDT', '')}</span>
                              <span className="text-xs text-muted-foreground ml-2">{s.trades} trades</span>
                            </div>
                            <div className="text-right">
                              <p className={cn('text-sm font-mono font-semibold', s.pnl >= 0 ? 'text-profit' : 'text-loss')}>${s.pnl.toLocaleString()}</p>
                              <p className="text-[10px] text-muted-foreground">{s.winRate}% win</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Equity Curve */}
                <Card className="border-border/60">
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm">Equity Curve</CardTitle>
                    <Button variant="ghost" size="sm" className="h-7 text-xs"><Download className="h-3 w-3 mr-1" /> Export</Button>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={activeResult.equityCurve}>
                          <defs>
                            <linearGradient id="btEquity" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                          <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} />
                          <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                          <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} formatter={(v: number) => [`$${v.toLocaleString()}`, 'Equity']} />
                          <Area type="monotone" dataKey="equity" stroke="hsl(var(--primary))" fill="url(#btEquity)" strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Monthly Returns + Win/Loss */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <Card className="border-border/60">
                    <CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Returns</CardTitle></CardHeader>
                    <CardContent>
                      <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={activeResult.monthlyReturns}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                            <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} />
                            <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(1)}k`} />
                            <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} formatter={(v: number) => [`$${v.toLocaleString()}`, 'PnL']} />
                            <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
                              {activeResult.monthlyReturns.map((entry, i) => (
                                <Cell key={i} fill={entry.pnl >= 0 ? 'hsl(var(--profit))' : 'hsl(var(--loss))'} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-border/60">
                    <CardHeader className="pb-2"><CardTitle className="text-sm">Win / Loss Distribution</CardTitle></CardHeader>
                    <CardContent>
                      <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={[{ name: 'Wins', value: r!.winningTrades }, { name: 'Losses', value: r!.losingTrades }]} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                              <Cell fill="hsl(var(--profit))" />
                              <Cell fill="hsl(var(--loss))" />
                            </Pie>
                            <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                            <Legend wrapperStyle={{ fontSize: 12 }} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Drawdown */}
                <Card className="border-border/60">
                  <CardHeader className="pb-2"><CardTitle className="text-sm">Drawdown Over Time</CardTitle></CardHeader>
                  <CardContent>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={activeResult.equityCurve}>
                          <defs>
                            <linearGradient id="btDrawdown" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="hsl(var(--loss))" stopOpacity={0.3} />
                              <stop offset="100%" stopColor="hsl(var(--loss))" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                          <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} />
                          <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} tickFormatter={v => `${v}%`} />
                          <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} formatter={(v: number) => [`${v.toFixed(2)}%`, 'Drawdown']} />
                          <Area type="monotone" dataKey="drawdown" stroke="hsl(var(--loss))" fill="url(#btDrawdown)" strokeWidth={1.5} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* ── Trade Log ── */}
                <Card className="border-border/60">
                  <CardHeader className="pb-3 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <ListFilter className="h-4 w-4 text-primary" />
                        Trade Log — All Trades ({activeResult.trades.length} shown of {r!.totalTrades})
                      </CardTitle>
                      <CardDescription className="mt-1">
                        <span className="text-profit font-mono font-medium">{activeResult.trades.filter(t => t.pnl > 0).length} winners</span>
                        {' · '}
                        <span className="text-loss font-mono font-medium">{activeResult.trades.filter(t => t.pnl <= 0).length} losers</span>
                        {' · '}
                        <span className="font-mono">
                          Net: <span className={cn(activeResult.trades.reduce((s, t) => s + t.pnl, 0) >= 0 ? 'text-profit' : 'text-loss', 'font-medium')}>
                            ${activeResult.trades.reduce((s, t) => s + t.pnl, 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                          </span>
                        </span>
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select value={tradeSymbolFilter} onValueChange={v => { setTradeSymbolFilter(v); setTradePage(0); }}>
                        <SelectTrigger className="h-8 text-xs w-[130px]"><SelectValue placeholder="All Symbols" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Symbols</SelectItem>
                          {activeResult.tradesBySymbol.map(s => (
                            <SelectItem key={s.symbol} value={s.symbol}>{s.symbol.replace('USDT', '')}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={tradeFilter} onValueChange={v => { setTradeFilter(v as any); setTradePage(0); }}>
                        <SelectTrigger className="h-8 text-xs w-[110px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Trades</SelectItem>
                          <SelectItem value="winners">Winners</SelectItem>
                          <SelectItem value="losers">Losers</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    {(() => {
                      let filtered = activeResult.trades;
                      if (tradeFilter === 'winners') filtered = filtered.filter(t => t.pnl > 0);
                      if (tradeFilter === 'losers') filtered = filtered.filter(t => t.pnl <= 0);
                      if (tradeSymbolFilter !== 'all') filtered = filtered.filter(t => t.symbol === tradeSymbolFilter);
                      const totalPages = Math.ceil(filtered.length / TRADES_PER_PAGE);
                      const paginated = filtered.slice(tradePage * TRADES_PER_PAGE, (tradePage + 1) * TRADES_PER_PAGE);

                      return (
                        <>
                          <div className="overflow-x-auto">
                            <table className="w-full text-[11px] table-premium">
                              <thead>
                                <tr className="border-b border-border/60">
                                  <th className="text-left py-2.5 px-4">#</th>
                                  <th className="text-left py-2.5 px-3">Symbol</th>
                                  <th className="text-left py-2.5 px-3">Side</th>
                                  <th className="text-right py-2.5 px-3">Entry</th>
                                  <th className="text-right py-2.5 px-3">Exit</th>
                                  <th className="text-left py-2.5 px-3">Entry Date</th>
                                  <th className="text-left py-2.5 px-3">Exit Date</th>
                                  <th className="text-right py-2.5 px-3">PnL</th>
                                  <th className="text-right py-2.5 px-3">PnL %</th>
                                  <th className="text-left py-2.5 px-3">Exit Reason</th>
                                  <th className="text-right py-2.5 px-4">Hold</th>
                                </tr>
                              </thead>
                              <tbody>
                                {paginated.map((t, i) => (
                                  <tr key={t.id} className="border-b border-border/20 hover:bg-accent/30 transition-colors">
                                    <td className="py-2 px-4 text-muted-foreground font-mono">{tradePage * TRADES_PER_PAGE + i + 1}</td>
                                    <td className="py-2 px-3 font-mono font-medium text-card-foreground">{t.symbol.replace('USDT', '')}</td>
                                    <td className="py-2 px-3">
                                      <Badge variant="outline" className={cn('text-[9px] px-1.5 py-0', t.side === 'Long' ? 'text-profit border-success/30' : 'text-loss border-critical/30')}>
                                        {t.side}
                                      </Badge>
                                    </td>
                                    <td className="py-2 px-3 text-right font-mono text-muted-foreground tabular-nums">${t.entryPrice.toLocaleString()}</td>
                                    <td className="py-2 px-3 text-right font-mono text-muted-foreground tabular-nums">${t.exitPrice.toLocaleString()}</td>
                                    <td className="py-2 px-3 text-muted-foreground">{t.entryDate}</td>
                                    <td className="py-2 px-3 text-muted-foreground">{t.exitDate}</td>
                                    <td className={cn('py-2 px-3 text-right font-mono font-semibold tabular-nums', t.pnl >= 0 ? 'text-profit' : 'text-loss')}>
                                      {t.pnl >= 0 ? '+' : ''}${t.pnl.toLocaleString()}
                                    </td>
                                    <td className={cn('py-2 px-3 text-right font-mono tabular-nums', t.pnlPercent >= 0 ? 'text-profit' : 'text-loss')}>
                                      {t.pnlPercent >= 0 ? '+' : ''}{t.pnlPercent.toFixed(2)}%
                                    </td>
                                    <td className="py-2 px-3">
                                      <Badge variant="outline" className="text-[9px] px-1.5 py-0 text-muted-foreground">{t.exitReason}</Badge>
                                    </td>
                                    <td className="py-2 px-4 text-right font-mono text-muted-foreground">{t.holdDuration}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          {totalPages > 1 && (
                            <div className="flex items-center justify-between px-4 py-3 border-t border-border/40">
                              <span className="text-xs text-muted-foreground">
                                Showing {tradePage * TRADES_PER_PAGE + 1}–{Math.min((tradePage + 1) * TRADES_PER_PAGE, filtered.length)} of {filtered.length} trades
                              </span>
                              <div className="flex gap-1.5">
                                <Button variant="outline" size="sm" className="h-7 text-xs px-2.5" disabled={tradePage === 0} onClick={() => setTradePage(p => p - 1)}>Prev</Button>
                                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                  const page = tradePage < 3 ? i : tradePage > totalPages - 3 ? totalPages - 5 + i : tradePage - 2 + i;
                                  if (page < 0 || page >= totalPages) return null;
                                  return (
                                    <Button key={page} variant={page === tradePage ? 'default' : 'outline'} size="sm" className="h-7 text-xs px-2.5 min-w-[28px]" onClick={() => setTradePage(page)}>
                                      {page + 1}
                                    </Button>
                                  );
                                })}
                                <Button variant="outline" size="sm" className="h-7 text-xs px-2.5" disabled={tradePage >= totalPages - 1} onClick={() => setTradePage(p => p + 1)}>Next</Button>
                              </div>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="border-border/60">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <AlertTriangle className="h-10 w-10 text-muted-foreground/50 mb-4" />
                  <p className="text-sm text-muted-foreground">No backtest results yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Configure your parameters and run a backtest</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
