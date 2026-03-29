import { createContext, useContext, ReactNode } from 'react';
import { useSimulation } from '@/hooks/useSimulation';
import type { Position, AccountSummary, RiskSnapshot, AlertItem } from '@/types/trading';

interface SimulationContextType {
  positions: Position[];
  account: AccountSummary;
  risk: RiskSnapshot;
  alerts: AlertItem[];
  paused: boolean;
  setPaused: (paused: boolean) => void;
}

const SimulationContext = createContext<SimulationContextType | null>(null);

export function SimulationProvider({ children }: { children: ReactNode }) {
  const sim = useSimulation(2000);
  return (
    <SimulationContext.Provider value={sim}>
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulationData(): SimulationContextType {
  const ctx = useContext(SimulationContext);
  if (!ctx) throw new Error('useSimulationData must be inside SimulationProvider');
  return ctx;
}
