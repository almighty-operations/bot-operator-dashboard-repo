export interface AccountSummary {
  totalEquity: number;
  availableBalance: number;
  usedMargin: number;
  availableMargin: number;
  usedMarginPercent: number;
  dailyPnl: number;
  dailyPnlPercent: number;
  weeklyPnl: number;
  weeklyPnlPercent: number;
  monthlyPnl: number;
  monthlyPnlPercent: number;
  openPositionsCount: number;
  botStatus: 'Running' | 'Paused' | 'Stopped' | 'Error';
  riskMode: 'Normal' | 'Elevated' | 'Locked';
  currentPulseSize: number;
  newEntriesEnabled: boolean;
}

export interface RiskSnapshot {
  usedMarginPercent: number;
  warningThreshold: number;
  emergencyThreshold: number;
  dailyLossPercent: number;
  maxDailyLossPercent: number;
  weeklyDrawdownPercent: number;
  maxWeeklyDrawdownPercent: number;
  consecutiveLosses: number;
  maxConsecutiveLosses: number;
  effectiveLeverage: number;
  protectionStatus: 'Protected' | 'Partial' | 'Unprotected';
  newEntriesEnabled: boolean;
  riskMode: 'Normal' | 'Elevated' | 'Locked';
}

export interface Position {
  id: string;
  symbol: string;
  side: 'Long' | 'Short';
  entryPrice: number;
  markPrice: number;
  quantity: number;
  leverage: number;
  requiredMargin: number;
  unrealizedPnl: number;
  unrealizedPnlPercent: number;
  rsi: number;
  initialStop: number;
  currentStop: number;
  trailingActive: boolean;
  protectionStatus: 'Protected' | 'Partial' | 'Unprotected';
  openTime: string;
  riskAmount: number;
  pulseSize: number;
}

export interface ClosedTrade {
  id: string;
  symbol: string;
  side: 'Long' | 'Short';
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  leverage: number;
  entryTime: string;
  exitTime: string;
  holdDuration: string;
  realizedPnl: number;
  realizedPnlPercent: number;
  exitReason: string;
  signalRsi: number;
  exitRsi: number;
}

export interface RejectedTrade {
  id: string;
  symbol: string;
  timestamp: string;
  rejectionReason: string;
  relatedThreshold: string;
  side: 'Long' | 'Short';
  requestedSize: number;
}

export interface UniverseAsset {
  rank: number;
  symbol: string;
  weeklyVolume: number;
  dailyVolume: number;
  spread: number;
  liquidityScore: number;
  eligible: boolean;
  exclusionReason?: string;
}

export interface AlertItem {
  id: string;
  timestamp: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  module: string;
  symbol?: string;
  message: string;
  details?: string;
}

export interface HealthCheck {
  name: string;
  status: 'Healthy' | 'Degraded' | 'Down';
  lastChecked: string;
  latency?: number;
  message?: string;
}

export interface StrategyConfig {
  rsiLength: number;
  entryThreshold: number;
  managementThreshold: number;
  primaryTimeframe: string;
  confirmationMode: boolean;
  redCandleExit: boolean;
  trailingBufferType: 'Fixed' | 'ATR' | 'Percentage';
  trailingBufferValue: number;
  longOnlyMode: boolean;
  cooldownAfterLosses: number;
  lastUpdated: string;
  version: number;
}

export interface RiskConfig {
  riskPercentPerTrade: number;
  pulseCap: number;
  defaultLeverage: number;
  maxUsedMarginPercent: number;
  warningMarginThreshold: number;
  emergencyMarginThreshold: number;
  maxDailyLossPercent: number;
  maxWeeklyLossPercent: number;
  maxOpenPositions: number;
  maxConsecutiveLosses: number;
  maxCorrelatedExposure: number;
  freezeOnCriticalError: boolean;
  emergencyFlattenPolicy: 'Manual' | 'Auto' | 'Disabled';
  lastUpdated: string;
  version: number;
}

export interface PositionEvent {
  id: string;
  positionId: string;
  timestamp: string;
  type: 'signal_detected' | 'risk_approved' | 'order_submitted' | 'order_filled' | 'initial_stop_attached' | 'trailing_activated' | 'stop_updated' | 'exit_triggered' | 'position_closed';
  description: string;
  metadata?: Record<string, string | number>;
}

export interface PerformancePoint {
  date: string;
  equity: number;
  pnl: number;
  drawdown: number;
  usedMargin: number;
  pulseSize: number;
}

export type Severity = 'INFO' | 'WARNING' | 'CRITICAL';
export type BotStatus = 'Running' | 'Paused' | 'Stopped' | 'Error';
export type RiskMode = 'Normal' | 'Elevated' | 'Locked';
