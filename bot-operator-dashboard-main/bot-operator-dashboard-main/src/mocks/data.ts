import type {
  AccountSummary, RiskSnapshot, Position, ClosedTrade, RejectedTrade,
  UniverseAsset, AlertItem, HealthCheck, StrategyConfig, RiskConfig,
  PositionEvent, PerformancePoint
} from '@/types/trading';

export const accountSummary: AccountSummary = {
  totalEquity: 52_340.82,
  availableBalance: 34_544.94,
  usedMargin: 17_795.88,
  availableMargin: 34_544.94,
  usedMarginPercent: 34,
  dailyPnl: 487.23,
  dailyPnlPercent: 0.93,
  weeklyPnl: 1_842.56,
  weeklyPnlPercent: 3.65,
  monthlyPnl: 4_210.90,
  monthlyPnlPercent: 8.74,
  openPositionsCount: 4,
  botStatus: 'Running',
  riskMode: 'Normal',
  currentPulseSize: 200,
  newEntriesEnabled: true,
};

export const riskSnapshot: RiskSnapshot = {
  usedMarginPercent: 34,
  warningThreshold: 50,
  emergencyThreshold: 70,
  dailyLossPercent: 0.93,
  maxDailyLossPercent: 3,
  weeklyDrawdownPercent: 1.2,
  maxWeeklyDrawdownPercent: 7,
  consecutiveLosses: 1,
  maxConsecutiveLosses: 5,
  effectiveLeverage: 3.4,
  protectionStatus: 'Protected',
  newEntriesEnabled: true,
  riskMode: 'Normal',
};

export const openPositions: Position[] = [
  {
    id: 'pos-001', symbol: 'SOLUSDT', side: 'Long', entryPrice: 142.35, markPrice: 148.92,
    quantity: 14.0, leverage: 5, requiredMargin: 398.58, unrealizedPnl: 91.98, unrealizedPnlPercent: 4.61,
    rsi: 58.3, initialStop: 135.20, currentStop: 141.50, trailingActive: true,
    protectionStatus: 'Protected', openTime: '2025-03-28T08:14:00Z', riskAmount: 100, pulseSize: 200,
  },
  {
    id: 'pos-002', symbol: 'XRPUSDT', side: 'Long', entryPrice: 0.6210, markPrice: 0.6385,
    quantity: 3200, leverage: 3, requiredMargin: 662.40, unrealizedPnl: 56.00, unrealizedPnlPercent: 2.82,
    rsi: 52.1, initialStop: 0.5950, currentStop: 0.6100, trailingActive: false,
    protectionStatus: 'Protected', openTime: '2025-03-27T14:32:00Z', riskAmount: 83.20, pulseSize: 200,
  },
  {
    id: 'pos-003', symbol: 'AVAXUSDT', side: 'Short', entryPrice: 38.45, markPrice: 37.12,
    quantity: 52, leverage: 4, requiredMargin: 499.85, unrealizedPnl: 69.16, unrealizedPnlPercent: 3.46,
    rsi: 41.7, initialStop: 41.20, currentStop: 39.80, trailingActive: true,
    protectionStatus: 'Protected', openTime: '2025-03-28T11:05:00Z', riskAmount: 143.00, pulseSize: 200,
  },
  {
    id: 'pos-004', symbol: 'DOGEUSDT', side: 'Long', entryPrice: 0.1742, markPrice: 0.1718,
    quantity: 11500, leverage: 3, requiredMargin: 667.43, unrealizedPnl: -27.60, unrealizedPnlPercent: -1.38,
    rsi: 44.8, initialStop: 0.1650, currentStop: 0.1650, trailingActive: false,
    protectionStatus: 'Partial', openTime: '2025-03-29T02:18:00Z', riskAmount: 105.80, pulseSize: 200,
  },
];

function generateClosedTrades(): ClosedTrade[] {
  const symbols = ['SOLUSDT', 'XRPUSDT', 'DOGEUSDT', 'ADAUSDT', 'AVAXUSDT', 'LINKUSDT', 'DOTUSDT', 'LTCUSDT', 'NEARUSDT', 'APTUSDT'];
  const exitReasons = ['RSI Exit', 'Trailing Stop', 'Red Candle Exit', 'Manual Close', 'Max Hold Time', 'Target Reached'];
  const trades: ClosedTrade[] = [];
  const baseDate = new Date('2025-03-01');

  for (let i = 0; i < 52; i++) {
    const sym = symbols[i % symbols.length];
    const side = Math.random() > 0.35 ? 'Long' as const : 'Short' as const;
    const entry = 10 + Math.random() * 200;
    const pnlPct = (Math.random() - 0.35) * 10;
    const exit = side === 'Long' ? entry * (1 + pnlPct / 100) : entry * (1 - pnlPct / 100);
    const qty = Math.floor(10 + Math.random() * 500);
    const entryDate = new Date(baseDate.getTime() + i * 12 * 3600000);
    const exitDate = new Date(entryDate.getTime() + (1 + Math.random() * 48) * 3600000);
    const realizedPnl = (exit - entry) * qty * (side === 'Long' ? 1 : -1);

    trades.push({
      id: `ct-${String(i).padStart(3, '0')}`,
      symbol: sym, side,
      entryPrice: +entry.toFixed(4), exitPrice: +exit.toFixed(4),
      quantity: qty, leverage: [3, 4, 5][i % 3],
      entryTime: entryDate.toISOString(), exitTime: exitDate.toISOString(),
      holdDuration: `${Math.floor((exitDate.getTime() - entryDate.getTime()) / 3600000)}h`,
      realizedPnl: +realizedPnl.toFixed(2),
      realizedPnlPercent: +pnlPct.toFixed(2),
      exitReason: exitReasons[i % exitReasons.length],
      signalRsi: +(25 + Math.random() * 30).toFixed(1),
      exitRsi: +(45 + Math.random() * 30).toFixed(1),
    });
  }
  return trades;
}

export const closedTrades: ClosedTrade[] = generateClosedTrades();

export const rejectedTrades: RejectedTrade[] = [
  { id: 'rj-001', symbol: 'LINKUSDT', timestamp: '2025-03-29T01:12:00Z', rejectionReason: 'Max open positions reached', relatedThreshold: 'maxOpenPositions: 6', side: 'Long', requestedSize: 200 },
  { id: 'rj-002', symbol: 'DOTUSDT', timestamp: '2025-03-28T22:45:00Z', rejectionReason: 'Used margin exceeds warning threshold', relatedThreshold: 'warningMarginThreshold: 50%', side: 'Long', requestedSize: 200 },
  { id: 'rj-003', symbol: 'NEARUSDT', timestamp: '2025-03-28T18:30:00Z', rejectionReason: 'Correlated exposure limit exceeded', relatedThreshold: 'maxCorrelatedExposure: 40%', side: 'Long', requestedSize: 200 },
  { id: 'rj-004', symbol: 'APTUSDT', timestamp: '2025-03-28T15:10:00Z', rejectionReason: 'Cooldown period active after 2 consecutive losses', relatedThreshold: 'cooldownAfterLosses: 2', side: 'Short', requestedSize: 200 },
  { id: 'rj-005', symbol: 'SOLUSDT', timestamp: '2025-03-28T12:05:00Z', rejectionReason: 'Daily loss limit approaching', relatedThreshold: 'maxDailyLoss: 3%', side: 'Long', requestedSize: 200 },
  { id: 'rj-006', symbol: 'ADAUSDT', timestamp: '2025-03-27T20:30:00Z', rejectionReason: 'Spread exceeds maximum allowed', relatedThreshold: 'maxSpread: 0.15%', side: 'Long', requestedSize: 200 },
  { id: 'rj-007', symbol: 'LTCUSDT', timestamp: '2025-03-27T16:15:00Z', rejectionReason: 'RSI not in entry zone', relatedThreshold: 'entryThreshold: 30', side: 'Long', requestedSize: 200 },
  { id: 'rj-008', symbol: 'XRPUSDT', timestamp: '2025-03-27T10:22:00Z', rejectionReason: 'Position already open for symbol', relatedThreshold: 'duplicate symbol check', side: 'Long', requestedSize: 200 },
  { id: 'rj-009', symbol: 'AVAXUSDT', timestamp: '2025-03-26T23:45:00Z', rejectionReason: 'Bot paused by operator', relatedThreshold: 'botStatus: Paused', side: 'Short', requestedSize: 200 },
  { id: 'rj-010', symbol: 'DOGEUSDT', timestamp: '2025-03-26T19:10:00Z', rejectionReason: 'Weekly drawdown limit exceeded', relatedThreshold: 'maxWeeklyLoss: 7%', side: 'Long', requestedSize: 200 },
  { id: 'rj-011', symbol: 'LINKUSDT', timestamp: '2025-03-26T14:30:00Z', rejectionReason: 'Insufficient available margin', relatedThreshold: 'availableMargin < requiredMargin', side: 'Long', requestedSize: 200 },
  { id: 'rj-012', symbol: 'NEARUSDT', timestamp: '2025-03-26T08:55:00Z', rejectionReason: 'Liquidity score below minimum', relatedThreshold: 'minLiquidityScore: 70', side: 'Short', requestedSize: 200 },
];

export const activeUniverse: UniverseAsset[] = [
  { rank: 1, symbol: 'SOLUSDT', weeklyVolume: 48_200_000_000, dailyVolume: 7_120_000_000, spread: 0.01, liquidityScore: 98, eligible: true },
  { rank: 2, symbol: 'XRPUSDT', weeklyVolume: 35_800_000_000, dailyVolume: 5_340_000_000, spread: 0.02, liquidityScore: 96, eligible: true },
  { rank: 3, symbol: 'DOGEUSDT', weeklyVolume: 28_400_000_000, dailyVolume: 4_210_000_000, spread: 0.02, liquidityScore: 94, eligible: true },
  { rank: 4, symbol: 'ADAUSDT', weeklyVolume: 18_600_000_000, dailyVolume: 2_780_000_000, spread: 0.03, liquidityScore: 91, eligible: true },
  { rank: 5, symbol: 'AVAXUSDT', weeklyVolume: 14_200_000_000, dailyVolume: 2_100_000_000, spread: 0.04, liquidityScore: 89, eligible: true },
  { rank: 6, symbol: 'LINKUSDT', weeklyVolume: 12_800_000_000, dailyVolume: 1_890_000_000, spread: 0.04, liquidityScore: 87, eligible: true },
  { rank: 7, symbol: 'DOTUSDT', weeklyVolume: 9_400_000_000, dailyVolume: 1_420_000_000, spread: 0.05, liquidityScore: 84, eligible: true },
  { rank: 8, symbol: 'LTCUSDT', weeklyVolume: 8_100_000_000, dailyVolume: 1_180_000_000, spread: 0.05, liquidityScore: 82, eligible: true },
  { rank: 9, symbol: 'NEARUSDT', weeklyVolume: 6_500_000_000, dailyVolume: 980_000_000, spread: 0.06, liquidityScore: 79, eligible: true },
  { rank: 10, symbol: 'APTUSDT', weeklyVolume: 5_200_000_000, dailyVolume: 810_000_000, spread: 0.07, liquidityScore: 76, eligible: true },
  { rank: 0, symbol: 'BTCUSDT', weeklyVolume: 320_000_000_000, dailyVolume: 48_000_000_000, spread: 0.001, liquidityScore: 100, eligible: false, exclusionReason: 'BTC excluded by policy' },
  { rank: 0, symbol: 'ETHUSDT', weeklyVolume: 180_000_000_000, dailyVolume: 27_000_000_000, spread: 0.002, liquidityScore: 99, eligible: false, exclusionReason: 'ETH excluded by policy' },
  { rank: 11, symbol: 'MATICUSDT', weeklyVolume: 4_100_000_000, dailyVolume: 620_000_000, spread: 0.09, liquidityScore: 71, eligible: false, exclusionReason: 'Below top 10 threshold' },
  { rank: 12, symbol: 'SUIUSDT', weeklyVolume: 3_800_000_000, dailyVolume: 580_000_000, spread: 0.10, liquidityScore: 68, eligible: false, exclusionReason: 'Below top 10 threshold' },
];

export const alertsFeed: AlertItem[] = [
  { id: 'a-001', timestamp: '2025-03-29T03:45:00Z', severity: 'INFO', module: 'Execution', symbol: 'DOGEUSDT', message: 'Long position opened at 0.1742' },
  { id: 'a-002', timestamp: '2025-03-29T03:44:00Z', severity: 'INFO', module: 'Risk Engine', symbol: 'DOGEUSDT', message: 'Trade approved — all risk checks passed' },
  { id: 'a-003', timestamp: '2025-03-29T03:43:00Z', severity: 'INFO', module: 'Signal', symbol: 'DOGEUSDT', message: 'RSI entry signal detected at 28.4 on 15m' },
  { id: 'a-004', timestamp: '2025-03-29T01:12:00Z', severity: 'WARNING', module: 'Risk Engine', symbol: 'LINKUSDT', message: 'Trade rejected: max open positions reached' },
  { id: 'a-005', timestamp: '2025-03-28T22:30:00Z', severity: 'INFO', module: 'Trailing', symbol: 'SOLUSDT', message: 'Trailing stop activated at 141.50' },
  { id: 'a-006', timestamp: '2025-03-28T20:15:00Z', severity: 'INFO', module: 'Trailing', symbol: 'AVAXUSDT', message: 'Trailing stop activated at 39.80' },
  { id: 'a-007', timestamp: '2025-03-28T18:30:00Z', severity: 'WARNING', module: 'Risk Engine', symbol: 'NEARUSDT', message: 'Correlated exposure limit reached' },
  { id: 'a-008', timestamp: '2025-03-28T16:00:00Z', severity: 'CRITICAL', module: 'Exchange', message: 'API rate limit warning — 85% of limit reached' },
  { id: 'a-009', timestamp: '2025-03-28T14:22:00Z', severity: 'INFO', module: 'Universe', message: 'Universe refreshed — 10 eligible symbols' },
  { id: 'a-010', timestamp: '2025-03-28T12:05:00Z', severity: 'WARNING', module: 'Risk Engine', symbol: 'SOLUSDT', message: 'Daily loss limit approaching (2.1% of 3% max)' },
  { id: 'a-011', timestamp: '2025-03-28T10:00:00Z', severity: 'INFO', module: 'Reconciliation', message: 'Reconciliation completed — no discrepancies' },
  { id: 'a-012', timestamp: '2025-03-28T08:14:00Z', severity: 'INFO', module: 'Execution', symbol: 'SOLUSDT', message: 'Long position opened at 142.35' },
  { id: 'a-013', timestamp: '2025-03-28T06:00:00Z', severity: 'INFO', module: 'Scheduler', message: 'Daily maintenance cycle completed' },
  { id: 'a-014', timestamp: '2025-03-27T22:45:00Z', severity: 'WARNING', module: 'Risk Engine', symbol: 'DOTUSDT', message: 'Margin utilization above warning threshold' },
  { id: 'a-015', timestamp: '2025-03-27T20:30:00Z', severity: 'INFO', module: 'Signal', symbol: 'ADAUSDT', message: 'RSI entry signal detected but spread too wide' },
  { id: 'a-016', timestamp: '2025-03-27T18:00:00Z', severity: 'CRITICAL', module: 'Database', message: 'Database connection pool exhausted — recovered after 12s' },
  { id: 'a-017', timestamp: '2025-03-27T14:32:00Z', severity: 'INFO', module: 'Execution', symbol: 'XRPUSDT', message: 'Long position opened at 0.6210' },
  { id: 'a-018', timestamp: '2025-03-27T12:00:00Z', severity: 'INFO', module: 'Config', message: 'Strategy config updated to version 14' },
  { id: 'a-019', timestamp: '2025-03-27T08:15:00Z', severity: 'WARNING', module: 'Market Data', message: 'Candle data delayed by 45 seconds on APTUSDT' },
  { id: 'a-020', timestamp: '2025-03-27T06:00:00Z', severity: 'INFO', module: 'Scheduler', message: 'Daily maintenance cycle completed' },
  { id: 'a-021', timestamp: '2025-03-26T23:45:00Z', severity: 'INFO', module: 'Execution', symbol: 'LTCUSDT', message: 'Short position closed — trailing stop hit at 82.40' },
  { id: 'a-022', timestamp: '2025-03-26T20:10:00Z', severity: 'INFO', module: 'Risk Engine', message: 'Risk mode changed from Elevated to Normal' },
  { id: 'a-023', timestamp: '2025-03-26T16:30:00Z', severity: 'CRITICAL', module: 'Exchange', message: 'Order execution timeout — retrying in 5s' },
  { id: 'a-024', timestamp: '2025-03-26T14:00:00Z', severity: 'INFO', module: 'Universe', message: 'Universe refreshed — MATICUSDT dropped from top 10' },
  { id: 'a-025', timestamp: '2025-03-26T10:20:00Z', severity: 'WARNING', module: 'Reconciliation', message: 'Position size mismatch detected on AVAXUSDT — auto-corrected' },
];

export const systemHealth: HealthCheck[] = [
  { name: 'Exchange Connection', status: 'Healthy', lastChecked: '2025-03-29T03:50:00Z', latency: 42, message: 'Binance Futures connected' },
  { name: 'Database', status: 'Healthy', lastChecked: '2025-03-29T03:50:00Z', latency: 8, message: 'PostgreSQL responsive' },
  { name: 'Market Data Feed', status: 'Healthy', lastChecked: '2025-03-29T03:49:00Z', latency: 120, message: 'All candle streams active' },
  { name: 'Reconciliation Service', status: 'Healthy', lastChecked: '2025-03-29T03:45:00Z', latency: 350, message: 'Last run: no discrepancies' },
  { name: 'Execution Engine', status: 'Healthy', lastChecked: '2025-03-29T03:50:00Z', latency: 15, message: 'Ready for orders' },
  { name: 'Alert Service', status: 'Healthy', lastChecked: '2025-03-29T03:50:00Z', latency: 25, message: 'Telegram & email active' },
  { name: 'Scheduler', status: 'Healthy', lastChecked: '2025-03-29T03:48:00Z', latency: 5, message: 'All cron jobs on schedule' },
  { name: 'Config Sync', status: 'Healthy', lastChecked: '2025-03-29T03:47:00Z', latency: 12, message: 'Config v14 synced' },
];

export const strategyConfig: StrategyConfig = {
  rsiLength: 14,
  entryThreshold: 30,
  managementThreshold: 55,
  primaryTimeframe: '15m',
  confirmationMode: true,
  redCandleExit: true,
  trailingBufferType: 'ATR',
  trailingBufferValue: 1.5,
  longOnlyMode: false,
  cooldownAfterLosses: 2,
  lastUpdated: '2025-03-27T12:00:00Z',
  version: 14,
};

export const riskConfig: RiskConfig = {
  riskPercentPerTrade: 1,
  pulseCap: 300,
  defaultLeverage: 4,
  maxUsedMarginPercent: 70,
  warningMarginThreshold: 50,
  emergencyMarginThreshold: 70,
  maxDailyLossPercent: 3,
  maxWeeklyLossPercent: 7,
  maxOpenPositions: 6,
  maxConsecutiveLosses: 5,
  maxCorrelatedExposure: 40,
  freezeOnCriticalError: true,
  emergencyFlattenPolicy: 'Manual',
  lastUpdated: '2025-03-25T09:00:00Z',
  version: 8,
};

export const positionEvents: Record<string, PositionEvent[]> = {
  'pos-001': [
    { id: 'ev-001', positionId: 'pos-001', timestamp: '2025-03-28T08:10:00Z', type: 'signal_detected', description: 'RSI entry signal at 27.8 on SOLUSDT 15m' },
    { id: 'ev-002', positionId: 'pos-001', timestamp: '2025-03-28T08:11:00Z', type: 'risk_approved', description: 'All risk checks passed — margin: 28%, positions: 3/6' },
    { id: 'ev-003', positionId: 'pos-001', timestamp: '2025-03-28T08:12:00Z', type: 'order_submitted', description: 'Market buy order submitted for 14 SOL @ ~142.35' },
    { id: 'ev-004', positionId: 'pos-001', timestamp: '2025-03-28T08:14:00Z', type: 'order_filled', description: 'Order filled at 142.35 — 14 SOL acquired' },
    { id: 'ev-005', positionId: 'pos-001', timestamp: '2025-03-28T08:14:30Z', type: 'initial_stop_attached', description: 'Stop loss set at 135.20 (-5.02%)' },
    { id: 'ev-006', positionId: 'pos-001', timestamp: '2025-03-28T16:40:00Z', type: 'trailing_activated', description: 'Price reached trailing activation zone — trailing enabled' },
    { id: 'ev-007', positionId: 'pos-001', timestamp: '2025-03-28T22:30:00Z', type: 'stop_updated', description: 'Trailing stop moved to 141.50 (+4.66% from initial stop)' },
  ],
  'pos-002': [
    { id: 'ev-010', positionId: 'pos-002', timestamp: '2025-03-27T14:28:00Z', type: 'signal_detected', description: 'RSI entry signal at 29.1 on XRPUSDT 15m' },
    { id: 'ev-011', positionId: 'pos-002', timestamp: '2025-03-27T14:29:00Z', type: 'risk_approved', description: 'All risk checks passed' },
    { id: 'ev-012', positionId: 'pos-002', timestamp: '2025-03-27T14:30:00Z', type: 'order_submitted', description: 'Market buy order submitted for 3200 XRP' },
    { id: 'ev-013', positionId: 'pos-002', timestamp: '2025-03-27T14:32:00Z', type: 'order_filled', description: 'Order filled at 0.6210' },
    { id: 'ev-014', positionId: 'pos-002', timestamp: '2025-03-27T14:32:30Z', type: 'initial_stop_attached', description: 'Stop loss set at 0.5950 (-4.19%)' },
  ],
  'pos-003': [
    { id: 'ev-020', positionId: 'pos-003', timestamp: '2025-03-28T11:00:00Z', type: 'signal_detected', description: 'RSI short signal at 72.4 on AVAXUSDT 15m' },
    { id: 'ev-021', positionId: 'pos-003', timestamp: '2025-03-28T11:01:00Z', type: 'risk_approved', description: 'All risk checks passed' },
    { id: 'ev-022', positionId: 'pos-003', timestamp: '2025-03-28T11:03:00Z', type: 'order_submitted', description: 'Market sell order submitted for 52 AVAX' },
    { id: 'ev-023', positionId: 'pos-003', timestamp: '2025-03-28T11:05:00Z', type: 'order_filled', description: 'Order filled at 38.45' },
    { id: 'ev-024', positionId: 'pos-003', timestamp: '2025-03-28T11:05:30Z', type: 'initial_stop_attached', description: 'Stop loss set at 41.20 (+7.15%)' },
    { id: 'ev-025', positionId: 'pos-003', timestamp: '2025-03-28T20:15:00Z', type: 'trailing_activated', description: 'Trailing stop activated at 39.80' },
  ],
  'pos-004': [
    { id: 'ev-030', positionId: 'pos-004', timestamp: '2025-03-29T02:14:00Z', type: 'signal_detected', description: 'RSI entry signal at 28.4 on DOGEUSDT 15m' },
    { id: 'ev-031', positionId: 'pos-004', timestamp: '2025-03-29T02:15:00Z', type: 'risk_approved', description: 'All risk checks passed' },
    { id: 'ev-032', positionId: 'pos-004', timestamp: '2025-03-29T02:16:00Z', type: 'order_submitted', description: 'Market buy order submitted for 11500 DOGE' },
    { id: 'ev-033', positionId: 'pos-004', timestamp: '2025-03-29T02:18:00Z', type: 'order_filled', description: 'Order filled at 0.1742' },
    { id: 'ev-034', positionId: 'pos-004', timestamp: '2025-03-29T02:18:30Z', type: 'initial_stop_attached', description: 'Stop loss set at 0.1650 (-5.28%)' },
  ],
};

function generatePerformanceData(): PerformancePoint[] {
  const points: PerformancePoint[] = [];
  let equity = 48_000;
  const baseDate = new Date('2025-03-01');

  for (let i = 0; i < 29; i++) {
    const date = new Date(baseDate.getTime() + i * 86400000);
    const dailyPnl = (Math.random() - 0.35) * 800;
    equity += dailyPnl;
    const drawdown = Math.min(0, equity - 52_340) / 52_340 * 100;

    points.push({
      date: date.toISOString().split('T')[0],
      equity: +equity.toFixed(2),
      pnl: +dailyPnl.toFixed(2),
      drawdown: +drawdown.toFixed(2),
      usedMargin: +(25 + Math.random() * 20).toFixed(1),
      pulseSize: [150, 175, 200, 200, 225, 200][i % 6],
    });
  }
  return points;
}

export const performanceData: PerformancePoint[] = generatePerformanceData();

export const symbolPerformance = [
  { symbol: 'SOLUSDT', totalPnl: 1_240.50, trades: 12, winRate: 75, avgHold: '8h' },
  { symbol: 'XRPUSDT', totalPnl: 890.20, trades: 10, winRate: 70, avgHold: '12h' },
  { symbol: 'DOGEUSDT', totalPnl: 420.80, trades: 8, winRate: 62.5, avgHold: '6h' },
  { symbol: 'AVAXUSDT', totalPnl: 650.30, trades: 7, winRate: 71.4, avgHold: '10h' },
  { symbol: 'ADAUSDT', totalPnl: 310.60, trades: 6, winRate: 66.7, avgHold: '14h' },
  { symbol: 'LINKUSDT', totalPnl: -120.40, trades: 5, winRate: 40, avgHold: '4h' },
  { symbol: 'DOTUSDT', totalPnl: 180.90, trades: 4, winRate: 75, avgHold: '9h' },
  { symbol: 'LTCUSDT', totalPnl: 95.10, trades: 3, winRate: 66.7, avgHold: '7h' },
  { symbol: 'NEARUSDT', totalPnl: -45.20, trades: 3, winRate: 33.3, avgHold: '3h' },
  { symbol: 'APTUSDT', totalPnl: 210.40, trades: 4, winRate: 75, avgHold: '11h' },
];

export const exitReasonBreakdown = [
  { reason: 'Trailing Stop', count: 18, pnl: 2840 },
  { reason: 'RSI Exit', count: 14, pnl: 1420 },
  { reason: 'Red Candle Exit', count: 8, pnl: -320 },
  { reason: 'Target Reached', count: 6, pnl: 1650 },
  { reason: 'Max Hold Time', count: 4, pnl: 180 },
  { reason: 'Manual Close', count: 2, pnl: -95 },
];
