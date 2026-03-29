import type { PerformancePoint } from '@/types/trading';

export interface BacktestCoin {
  symbol: string;
  name: string;
  available: boolean;
  dataFrom: string; // earliest date
  dataTo: string;
}

export interface BacktestResult {
  id: string;
  runAt: string;
  coins: string[];
  dateFrom: string;
  dateTo: string;
  strategyConfig: {
    rsiLength: number;
    entryThreshold: number;
    managementThreshold: number;
    timeframe: string;
    trailingBufferType: string;
    trailingBufferValue: number;
    redCandleExit: boolean;
    longOnlyMode: boolean;
  };
  summary: {
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    winRate: number;
    totalPnl: number;
    totalPnlPercent: number;
    maxDrawdown: number;
    maxDrawdownPercent: number;
    sharpeRatio: number;
    sortinoRatio: number;
    profitFactor: number;
    avgWin: number;
    avgLoss: number;
    avgHoldDuration: string;
    bestTrade: number;
    worstTrade: number;
    startingEquity: number;
    endingEquity: number;
  };
  equityCurve: PerformancePoint[];
  tradesBySymbol: { symbol: string; trades: number; pnl: number; winRate: number }[];
  monthlyReturns: { month: string; pnl: number; pnlPercent: number; trades: number }[];
  trades: BacktestTrade[];
}

export interface BacktestTrade {
  id: string;
  symbol: string;
  side: 'Long' | 'Short';
  entryPrice: number;
  exitPrice: number;
  entryDate: string;
  exitDate: string;
  pnl: number;
  pnlPercent: number;
  exitReason: 'TP Hit' | 'SL Hit' | 'Trailing Stop' | 'Red Candle' | 'RSI Exit' | 'Manual' | 'Time Exit';
  holdDuration: string;
}

export const backtestCoins: BacktestCoin[] = [
  { symbol: 'SOLUSDT', name: 'Solana', available: true, dataFrom: '2020-04-10', dataTo: '2026-03-29' },
  { symbol: 'XRPUSDT', name: 'XRP', available: true, dataFrom: '2020-01-01', dataTo: '2026-03-29' },
  { symbol: 'BNBUSDT', name: 'BNB', available: true, dataFrom: '2020-01-01', dataTo: '2026-03-29' },
  { symbol: 'DOGEUSDT', name: 'Dogecoin', available: true, dataFrom: '2020-07-10', dataTo: '2026-03-29' },
  { symbol: 'ADAUSDT', name: 'Cardano', available: true, dataFrom: '2020-01-01', dataTo: '2026-03-29' },
  { symbol: 'AVAXUSDT', name: 'Avalanche', available: true, dataFrom: '2020-09-22', dataTo: '2026-03-29' },
  { symbol: 'TRXUSDT', name: 'TRON', available: true, dataFrom: '2020-01-01', dataTo: '2026-03-29' },
  { symbol: 'LINKUSDT', name: 'Chainlink', available: true, dataFrom: '2020-01-01', dataTo: '2026-03-29' },
  { symbol: 'DOTUSDT', name: 'Polkadot', available: true, dataFrom: '2020-08-18', dataTo: '2026-03-29' },
  { symbol: 'TONUSDT', name: 'Toncoin', available: true, dataFrom: '2021-11-10', dataTo: '2026-03-29' },
  { symbol: 'SHIBUSDT', name: 'Shiba Inu', available: true, dataFrom: '2021-05-10', dataTo: '2026-03-29' },
  { symbol: 'LTCUSDT', name: 'Litecoin', available: true, dataFrom: '2020-01-01', dataTo: '2026-03-29' },
  { symbol: 'XLMUSDT', name: 'Stellar', available: true, dataFrom: '2020-01-01', dataTo: '2026-03-29' },
  { symbol: 'NEARUSDT', name: 'NEAR Protocol', available: true, dataFrom: '2020-10-14', dataTo: '2026-03-29' },
  { symbol: 'SUIUSDT', name: 'Sui', available: true, dataFrom: '2023-05-03', dataTo: '2026-03-29' },
  { symbol: 'APTUSDT', name: 'Aptos', available: true, dataFrom: '2022-10-18', dataTo: '2026-03-29' },
  { symbol: 'UNIUSDT', name: 'Uniswap', available: true, dataFrom: '2020-09-17', dataTo: '2026-03-29' },
  { symbol: 'ICPUSDT', name: 'Internet Computer', available: true, dataFrom: '2021-05-10', dataTo: '2026-03-29' },
  { symbol: 'ARBUSDT', name: 'Arbitrum', available: true, dataFrom: '2023-03-23', dataTo: '2026-03-29' },
  { symbol: 'OPUSDT', name: 'Optimism', available: true, dataFrom: '2022-05-31', dataTo: '2026-03-29' },
  { symbol: 'MATICUSDT', name: 'Polygon', available: true, dataFrom: '2020-04-24', dataTo: '2026-03-29' },
  { symbol: 'ETCUSDT', name: 'Ethereum Classic', available: true, dataFrom: '2020-01-01', dataTo: '2026-03-29' },
  { symbol: 'HBARUSDT', name: 'Hedera', available: true, dataFrom: '2020-01-01', dataTo: '2026-03-29' },
  { symbol: 'FILUSDT', name: 'Filecoin', available: true, dataFrom: '2020-10-15', dataTo: '2026-03-29' },
  { symbol: 'ATOMUSDT', name: 'Cosmos', available: true, dataFrom: '2020-01-01', dataTo: '2026-03-29' },
  { symbol: 'INJUSDT', name: 'Injective', available: true, dataFrom: '2020-10-20', dataTo: '2026-03-29' },
  { symbol: 'RENDERUSDT', name: 'Render', available: true, dataFrom: '2021-06-29', dataTo: '2026-03-29' },
  { symbol: 'AAVEUSDT', name: 'Aave', available: true, dataFrom: '2020-10-02', dataTo: '2026-03-29' },
  { symbol: 'VETUSDT', name: 'VeChain', available: true, dataFrom: '2020-01-01', dataTo: '2026-03-29' },
  { symbol: 'FTMUSDT', name: 'Fantom', available: true, dataFrom: '2020-06-18', dataTo: '2026-03-29' },
  { symbol: 'ALGOUSDT', name: 'Algorand', available: true, dataFrom: '2020-01-01', dataTo: '2026-03-29' },
  { symbol: 'GRTUSDT', name: 'The Graph', available: true, dataFrom: '2020-12-17', dataTo: '2026-03-29' },
  { symbol: 'THETAUSDT', name: 'Theta Network', available: true, dataFrom: '2020-01-01', dataTo: '2026-03-29' },
  { symbol: 'TIAUSDT', name: 'Celestia', available: true, dataFrom: '2023-10-31', dataTo: '2026-03-29' },
  { symbol: 'SEIUSDT', name: 'Sei', available: true, dataFrom: '2023-08-15', dataTo: '2026-03-29' },
  { symbol: 'STXUSDT', name: 'Stacks', available: true, dataFrom: '2021-01-28', dataTo: '2026-03-29' },
  { symbol: 'IMXUSDT', name: 'Immutable', available: true, dataFrom: '2021-11-05', dataTo: '2026-03-29' },
  { symbol: 'SANDUSDT', name: 'The Sandbox', available: true, dataFrom: '2020-08-13', dataTo: '2026-03-29' },
  { symbol: 'MANAUSDT', name: 'Decentraland', available: true, dataFrom: '2020-01-01', dataTo: '2026-03-29' },
  { symbol: 'AXSUSDT', name: 'Axie Infinity', available: true, dataFrom: '2020-11-04', dataTo: '2026-03-29' },
  { symbol: 'MKRUSDT', name: 'Maker', available: true, dataFrom: '2020-01-01', dataTo: '2026-03-29' },
  { symbol: 'SNXUSDT', name: 'Synthetix', available: true, dataFrom: '2020-01-01', dataTo: '2026-03-29' },
  { symbol: 'LDOUSDT', name: 'Lido DAO', available: true, dataFrom: '2022-01-11', dataTo: '2026-03-29' },
  { symbol: 'RUNEUSDT', name: 'THORChain', available: true, dataFrom: '2020-07-23', dataTo: '2026-03-29' },
  { symbol: 'FETUSDT', name: 'Fetch.ai', available: true, dataFrom: '2020-03-30', dataTo: '2026-03-29' },
  { symbol: 'WLDUSDT', name: 'Worldcoin', available: true, dataFrom: '2023-07-24', dataTo: '2026-03-29' },
  { symbol: 'JUPUSDT', name: 'Jupiter', available: true, dataFrom: '2024-01-31', dataTo: '2026-03-29' },
  { symbol: 'PENDLEUSDT', name: 'Pendle', available: true, dataFrom: '2023-07-04', dataTo: '2026-03-29' },
  { symbol: 'ENAUSDT', name: 'Ethena', available: true, dataFrom: '2024-04-02', dataTo: '2026-03-29' },
  { symbol: 'ONDOUSDT', name: 'Ondo Finance', available: true, dataFrom: '2024-01-18', dataTo: '2026-03-29' },
];

function generateEquityCurve(startDate: string, endDate: string, startEquity: number, endEquity: number): PerformancePoint[] {
  const points: PerformancePoint[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  const totalDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const step = Math.max(7, Math.floor(totalDays / 150));
  let equity = startEquity;
  const growth = (endEquity - startEquity) / (totalDays / step);

  for (let i = 0; i <= totalDays; i += step) {
    const date = new Date(start.getTime() + i * 86400000);
    const noise = (Math.random() - 0.45) * growth * 1.5;
    equity = Math.max(equity * 0.92, equity + growth + noise);
    const pnl = equity - startEquity;
    const drawdown = Math.random() * -8;
    points.push({
      date: date.toISOString().split('T')[0],
      equity: Math.round(equity * 100) / 100,
      pnl: Math.round(pnl * 100) / 100,
      drawdown: Math.round(drawdown * 100) / 100,
      usedMargin: 30 + Math.random() * 20,
      pulseSize: 200,
    });
  }
  return points;
}

const exitReasons: BacktestTrade['exitReason'][] = ['TP Hit', 'SL Hit', 'Trailing Stop', 'Red Candle', 'RSI Exit', 'Time Exit'];
const holdDurations = ['2h 14m', '5h 33m', '11h 8m', '18h 42m', '1d 3h', '2d 8h', '3d 14h', '6h 22m', '14h 55m', '22h 10m'];

function generateMockTrades(coins: string[], totalTrades: number, winningTrades: number, dateFrom: string, dateTo: string): BacktestTrade[] {
  const trades: BacktestTrade[] = [];
  const start = new Date(dateFrom).getTime();
  const end = new Date(dateTo).getTime();
  const span = end - start;
  const priceMap: Record<string, number> = {
    SOLUSDT: 120, XRPUSDT: 0.55, DOGEUSDT: 0.08, ADAUSDT: 0.45, LINKUSDT: 14,
    AVAXUSDT: 35, NEARUSDT: 5.5, DOTUSDT: 7.2, BNBUSDT: 580, TRXUSDT: 0.12,
    LTCUSDT: 85, MATICUSDT: 0.9, ATOMUSDT: 9, INJUSDT: 22, AAVEUSDT: 95,
  };

  for (let i = 0; i < Math.min(totalTrades, 200); i++) {
    const coin = coins[i % coins.length];
    const basePrice = priceMap[coin] || 50;
    const isWin = i < winningTrades * (Math.min(totalTrades, 200) / totalTrades);
    const side: 'Long' | 'Short' = Math.random() > 0.35 ? 'Long' : 'Short';
    const pnlPct = isWin ? (0.5 + Math.random() * 8) : -(0.3 + Math.random() * 5);
    const entryPrice = basePrice * (0.7 + Math.random() * 0.6);
    const exitPrice = side === 'Long' ? entryPrice * (1 + pnlPct / 100) : entryPrice * (1 - pnlPct / 100);
    const pnl = isWin ? (10 + Math.random() * 500) : -(5 + Math.random() * 300);
    const entryTime = start + Math.random() * span;

    trades.push({
      id: `t-${i.toString().padStart(4, '0')}`,
      symbol: coin,
      side,
      entryPrice: Math.round(entryPrice * 1000) / 1000,
      exitPrice: Math.round(exitPrice * 1000) / 1000,
      entryDate: new Date(entryTime).toISOString().split('T')[0],
      exitDate: new Date(entryTime + (3600000 * (2 + Math.random() * 72))).toISOString().split('T')[0],
      pnl: Math.round(pnl * 100) / 100,
      pnlPercent: Math.round(pnlPct * 100) / 100,
      exitReason: exitReasons[Math.floor(Math.random() * exitReasons.length)],
      holdDuration: holdDurations[Math.floor(Math.random() * holdDurations.length)],
    });
  }

  return trades.sort((a, b) => b.entryDate.localeCompare(a.entryDate));
}

export const mockBacktestResults: BacktestResult[] = [
  {
    id: 'bt-001',
    runAt: '2026-03-28T14:30:00Z',
    coins: ['SOLUSDT', 'XRPUSDT', 'DOGEUSDT', 'ADAUSDT', 'LINKUSDT'],
    dateFrom: '2022-01-01',
    dateTo: '2026-03-28',
    strategyConfig: {
      rsiLength: 14, entryThreshold: 30, managementThreshold: 70,
      timeframe: '4h', trailingBufferType: 'ATR', trailingBufferValue: 1.5,
      redCandleExit: true, longOnlyMode: false,
    },
    summary: {
      totalTrades: 847, winningTrades: 498, losingTrades: 349, winRate: 58.8,
      totalPnl: 42_680.50, totalPnlPercent: 213.4, maxDrawdown: 8_420.00,
      maxDrawdownPercent: 16.8, sharpeRatio: 1.87, sortinoRatio: 2.45,
      profitFactor: 1.92, avgWin: 142.30, avgLoss: -87.60, avgHoldDuration: '18h 42m',
      bestTrade: 2_840.00, worstTrade: -1_120.00, startingEquity: 20_000,
      endingEquity: 62_680.50,
    },
    equityCurve: generateEquityCurve('2022-01-01', '2026-03-28', 20000, 62680.5),
    tradesBySymbol: [
      { symbol: 'SOLUSDT', trades: 203, pnl: 14_220, winRate: 62.1 },
      { symbol: 'XRPUSDT', trades: 187, pnl: 8_940, winRate: 57.2 },
      { symbol: 'DOGEUSDT', trades: 168, pnl: 7_830, winRate: 55.4 },
      { symbol: 'ADAUSDT', trades: 152, pnl: 6_120, winRate: 59.9 },
      { symbol: 'LINKUSDT', trades: 137, pnl: 5_570, winRate: 60.6 },
    ],
    monthlyReturns: [
      { month: '2026-01', pnl: 3_240, pnlPercent: 5.8, trades: 34 },
      { month: '2026-02', pnl: 2_890, pnlPercent: 4.9, trades: 29 },
      { month: '2026-03', pnl: 1_670, pnlPercent: 2.7, trades: 22 },
      { month: '2025-12', pnl: -1_420, pnlPercent: -2.6, trades: 31 },
      { month: '2025-11', pnl: 4_120, pnlPercent: 7.8, trades: 38 },
      { month: '2025-10', pnl: 2_340, pnlPercent: 4.5, trades: 27 },
      { month: '2025-09', pnl: 1_890, pnlPercent: 3.7, trades: 25 },
      { month: '2025-08', pnl: -870, pnlPercent: -1.7, trades: 22 },
      { month: '2025-07', pnl: 3_560, pnlPercent: 7.2, trades: 35 },
      { month: '2025-06', pnl: 2_140, pnlPercent: 4.4, trades: 28 },
      { month: '2025-05', pnl: 1_780, pnlPercent: 3.7, trades: 24 },
      { month: '2025-04', pnl: -560, pnlPercent: -1.2, trades: 20 },
    ],
    trades: generateMockTrades(['SOLUSDT', 'XRPUSDT', 'DOGEUSDT', 'ADAUSDT', 'LINKUSDT'], 847, 498, '2022-01-01', '2026-03-28'),
  },
  {
    id: 'bt-002',
    runAt: '2026-03-25T09:15:00Z',
    coins: ['SOLUSDT', 'AVAXUSDT', 'NEARUSDT', 'DOTUSDT'],
    dateFrom: '2020-01-01',
    dateTo: '2026-03-25',
    strategyConfig: {
      rsiLength: 21, entryThreshold: 25, managementThreshold: 75,
      timeframe: '1d', trailingBufferType: 'Percentage', trailingBufferValue: 2.0,
      redCandleExit: false, longOnlyMode: true,
    },
    summary: {
      totalTrades: 412, winningTrades: 257, losingTrades: 155, winRate: 62.4,
      totalPnl: 78_340.20, totalPnlPercent: 391.7, maxDrawdown: 12_640.00,
      maxDrawdownPercent: 22.1, sharpeRatio: 1.54, sortinoRatio: 2.12,
      profitFactor: 2.34, avgWin: 428.60, avgLoss: -198.40, avgHoldDuration: '3d 8h',
      bestTrade: 8_920.00, worstTrade: -3_240.00, startingEquity: 20_000,
      endingEquity: 98_340.20,
    },
    equityCurve: generateEquityCurve('2020-01-01', '2026-03-25', 20000, 98340.2),
    tradesBySymbol: [
      { symbol: 'SOLUSDT', trades: 124, pnl: 32_400, winRate: 66.1 },
      { symbol: 'AVAXUSDT', trades: 108, pnl: 21_800, winRate: 61.1 },
      { symbol: 'NEARUSDT', trades: 96, pnl: 14_240, winRate: 59.4 },
      { symbol: 'DOTUSDT', trades: 84, pnl: 9_900, winRate: 63.1 },
    ],
    monthlyReturns: [
      { month: '2026-01', pnl: 5_840, pnlPercent: 6.4, trades: 12 },
      { month: '2026-02', pnl: 4_290, pnlPercent: 4.5, trades: 10 },
      { month: '2026-03', pnl: 2_170, pnlPercent: 2.2, trades: 7 },
      { month: '2025-12', pnl: -2_340, pnlPercent: -2.5, trades: 11 },
      { month: '2025-11', pnl: 6_780, pnlPercent: 7.5, trades: 14 },
      { month: '2025-10', pnl: 3_120, pnlPercent: 3.5, trades: 9 },
    ],
    trades: generateMockTrades(['SOLUSDT', 'AVAXUSDT', 'NEARUSDT', 'DOTUSDT'], 412, 257, '2020-01-01', '2026-03-25'),
  },
  {
    id: 'bt-003',
    runAt: '2026-03-27T11:45:00Z',
    coins: ['SOLUSDT', 'XRPUSDT', 'DOGEUSDT', 'ADAUSDT', 'LINKUSDT'],
    dateFrom: '2022-01-01',
    dateTo: '2026-03-27',
    strategyConfig: {
      rsiLength: 10, entryThreshold: 25, managementThreshold: 75,
      timeframe: '4h', trailingBufferType: 'Percentage', trailingBufferValue: 2.5,
      redCandleExit: false, longOnlyMode: true,
    },
    summary: {
      totalTrades: 623, winningTrades: 399, losingTrades: 224, winRate: 64.0,
      totalPnl: 56_120.80, totalPnlPercent: 280.6, maxDrawdown: 6_830.00,
      maxDrawdownPercent: 12.4, sharpeRatio: 2.14, sortinoRatio: 2.89,
      profitFactor: 2.48, avgWin: 198.50, avgLoss: -112.30, avgHoldDuration: '22h 15m',
      bestTrade: 3_680.00, worstTrade: -980.00, startingEquity: 20_000,
      endingEquity: 76_120.80,
    },
    equityCurve: generateEquityCurve('2022-01-01', '2026-03-27', 20000, 76120.8),
    tradesBySymbol: [
      { symbol: 'SOLUSDT', trades: 156, pnl: 18_940, winRate: 67.3 },
      { symbol: 'XRPUSDT', trades: 142, pnl: 12_280, winRate: 62.0 },
      { symbol: 'DOGEUSDT', trades: 128, pnl: 10_450, winRate: 61.7 },
      { symbol: 'ADAUSDT', trades: 108, pnl: 8_230, winRate: 65.7 },
      { symbol: 'LINKUSDT', trades: 89, pnl: 6_220, winRate: 62.9 },
    ],
    monthlyReturns: [
      { month: '2026-01', pnl: 4_180, pnlPercent: 6.1, trades: 28 },
      { month: '2026-02', pnl: 3_540, pnlPercent: 4.9, trades: 24 },
      { month: '2026-03', pnl: 2_010, pnlPercent: 2.7, trades: 18 },
      { month: '2025-12', pnl: -680, pnlPercent: -0.9, trades: 26 },
      { month: '2025-11', pnl: 5_240, pnlPercent: 7.6, trades: 32 },
      { month: '2025-10', pnl: 2_890, pnlPercent: 4.3, trades: 22 },
      { month: '2025-09', pnl: 2_340, pnlPercent: 3.5, trades: 20 },
      { month: '2025-08', pnl: -420, pnlPercent: -0.6, trades: 18 },
      { month: '2025-07', pnl: 4_210, pnlPercent: 6.5, trades: 30 },
      { month: '2025-06', pnl: 2_760, pnlPercent: 4.3, trades: 23 },
    ],
    trades: generateMockTrades(['SOLUSDT', 'XRPUSDT', 'DOGEUSDT', 'ADAUSDT', 'LINKUSDT'], 623, 399, '2022-01-01', '2026-03-27'),
  },
];
