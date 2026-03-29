import { useState, useEffect, useCallback, useRef } from 'react';
import type { Position, AccountSummary, RiskSnapshot, AlertItem } from '@/types/trading';
import {
  openPositions as initialPositions,
  accountSummary as initialAccount,
  riskSnapshot as initialRisk,
  alertsFeed as initialAlerts,
} from '@/mocks/data';

// Simulate realistic price jitter
function jitter(price: number, volatility: number = 0.002): number {
  const change = price * volatility * (Math.random() - 0.5) * 2;
  return +(price + change);
}

function roundTo(n: number, decimals: number): number {
  const f = Math.pow(10, decimals);
  return Math.round(n * f) / f;
}

function getDecimals(price: number): number {
  if (price > 100) return 2;
  if (price > 1) return 2;
  return 4;
}

const alertMessages: { severity: 'INFO' | 'WARNING' | 'CRITICAL'; module: string; templates: string[] }[] = [
  { severity: 'INFO', module: 'Trailing', templates: ['Trailing stop adjusted on {symbol}', 'Stop moved to {price} on {symbol}'] },
  { severity: 'INFO', module: 'Market Data', templates: ['Candle update received for {symbol}', 'RSI recalculated for {symbol}: {rsi}'] },
  { severity: 'WARNING', module: 'Risk Engine', templates: ['Margin utilization rising: {margin}%', 'Effective leverage at {lev}x'] },
  { severity: 'INFO', module: 'Execution', templates: ['Order health check passed', 'Heartbeat OK — latency {latency}ms'] },
  { severity: 'INFO', module: 'Signal', templates: ['Monitoring RSI on {symbol}: {rsi}', 'No entry signals detected this cycle'] },
];

let alertCounter = 100;

export function useSimulation(intervalMs: number = 2000) {
  const [paused, setPaused] = useState(false);
  const [positions, setPositions] = useState<Position[]>(() =>
    initialPositions.map(p => ({ ...p }))
  );
  const [account, setAccount] = useState<AccountSummary>({ ...initialAccount });
  const [risk, setRisk] = useState<RiskSnapshot>({ ...initialRisk });
  const [alerts, setAlerts] = useState<AlertItem[]>(() =>
    initialAlerts.map(a => ({ ...a }))
  );
  const tickRef = useRef(0);

  const tick = useCallback(() => {
    tickRef.current += 1;
    const currentTick = tickRef.current;

    setPositions(prev => {
      const updated = prev.map(pos => {
        const decimals = getDecimals(pos.entryPrice);
        const newMark = roundTo(jitter(pos.markPrice, 0.003), decimals);
        const pnlRaw = pos.side === 'Long'
          ? (newMark - pos.entryPrice) * pos.quantity
          : (pos.entryPrice - newMark) * pos.quantity;
        const pnl = roundTo(pnlRaw, 2);
        const pnlPct = roundTo((pnl / pos.requiredMargin) * 100, 2);
        const newRsi = roundTo(Math.max(15, Math.min(85, pos.rsi + (Math.random() - 0.5) * 3)), 1);

        // Simulate trailing stop movement
        let newStop = pos.currentStop;
        let trailing = pos.trailingActive;
        if (pos.side === 'Long' && newMark > pos.entryPrice * 1.03 && !trailing) {
          trailing = true;
        }
        if (trailing && pos.side === 'Long' && newMark * 0.97 > pos.currentStop) {
          newStop = roundTo(newMark * 0.97, decimals);
        }
        if (pos.side === 'Short' && pos.entryPrice * 0.97 > newMark && !trailing) {
          trailing = true;
        }
        if (trailing && pos.side === 'Short' && newMark * 1.03 < pos.currentStop) {
          newStop = roundTo(newMark * 1.03, decimals);
        }

        return {
          ...pos,
          markPrice: newMark,
          unrealizedPnl: pnl,
          unrealizedPnlPercent: pnlPct,
          rsi: newRsi,
          currentStop: newStop,
          trailingActive: trailing,
        };
      });

      // Update account & risk based on new positions
      const totalPnl = updated.reduce((s, p) => s + p.unrealizedPnl, 0);
      const baseEquity = initialAccount.totalEquity - initialPositions.reduce((s, p) => s + p.unrealizedPnl, 0);
      const newEquity = roundTo(baseEquity + totalPnl, 2);
      const totalMargin = updated.reduce((s, p) => s + p.requiredMargin, 0);
      const marginPct = roundTo((totalMargin / newEquity) * 100, 1);
      const dailyPnl = roundTo(totalPnl + 400 + (Math.random() - 0.5) * 10, 2);

      setAccount(prev => ({
        ...prev,
        totalEquity: newEquity,
        availableBalance: roundTo(newEquity - totalMargin, 2),
        availableMargin: roundTo(newEquity - totalMargin, 2),
        usedMargin: roundTo(totalMargin, 2),
        usedMarginPercent: Math.round(marginPct),
        dailyPnl,
        dailyPnlPercent: roundTo((dailyPnl / newEquity) * 100, 2),
      }));

      setRisk(prev => ({
        ...prev,
        usedMarginPercent: Math.round(marginPct),
        effectiveLeverage: roundTo(totalMargin * 4 / newEquity, 1),
        dailyLossPercent: roundTo(Math.max(0, -dailyPnl / newEquity * 100), 2),
      }));

      return updated;
    });

    // Generate a new alert every ~6 seconds (every 3rd tick at 2s interval)
    if (currentTick % 3 === 0) {
      const template = alertMessages[Math.floor(Math.random() * alertMessages.length)];
      const randomPos = initialPositions[Math.floor(Math.random() * initialPositions.length)];
      const msg = template.templates[Math.floor(Math.random() * template.templates.length)]
        .replace('{symbol}', randomPos.symbol)
        .replace('{price}', randomPos.currentStop.toString())
        .replace('{rsi}', (30 + Math.random() * 40).toFixed(1))
        .replace('{margin}', (30 + Math.random() * 15).toFixed(1))
        .replace('{lev}', (2 + Math.random() * 3).toFixed(1))
        .replace('{latency}', Math.floor(20 + Math.random() * 100).toString());

      alertCounter++;
      const newAlert: AlertItem = {
        id: `sim-${alertCounter}`,
        timestamp: new Date().toISOString(),
        severity: template.severity,
        module: template.module,
        symbol: msg.includes(randomPos.symbol) ? randomPos.symbol : undefined,
        message: msg,
      };

      setAlerts(prev => [newAlert, ...prev].slice(0, 50));
    }
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(tick, intervalMs);
    return () => clearInterval(id);
  }, [tick, intervalMs, paused]);

  return { positions, account, risk, alerts, paused, setPaused };
}
