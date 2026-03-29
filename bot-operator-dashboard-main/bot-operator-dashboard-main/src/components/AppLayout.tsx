import { ReactNode } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { BottomTabBar } from '@/components/BottomTabBar';
import { StatusBadge } from '@/components/StatusBadge';
import { useSimulationData } from '@/contexts/SimulationContext';
import { useTheme } from '@/hooks/useTheme';
import { Clock, Sun, Moon, Pause, Play } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface AppLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function AppLayout({ children, title, subtitle }: AppLayoutProps) {
  const isMobile = useIsMobile();
  const { account, paused, setPaused } = useSimulationData();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <div className={`flex-1 ${isMobile ? 'ml-0' : 'ml-[232px]'}`}>
        <header className={`sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/80 backdrop-blur-xl ${isMobile ? 'h-[52px] px-4 pl-14' : 'h-[60px] px-8'}`}>
          <div className="flex items-center gap-4 min-w-0">
            <div className="min-w-0">
              <h1 className={`font-semibold tracking-tight text-foreground leading-tight truncate ${isMobile ? 'text-[13px]' : 'text-[15px]'}`}>{title}</h1>
              {subtitle && !isMobile && <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">{subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            <div className="hidden sm:flex items-center gap-2">
              <StatusBadge variant={account.botStatus === 'Running' ? 'success' : 'warning'}>
                {account.botStatus}
              </StatusBadge>
              <StatusBadge variant={account.riskMode === 'Normal' ? 'info' : account.riskMode === 'Elevated' ? 'warning' : 'critical'}>
                Risk: {account.riskMode}
              </StatusBadge>
            </div>
            <div className="hidden md:block h-4 w-px bg-border" />
            <div className="hidden md:flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span className="font-mono">{new Date().toLocaleTimeString()}</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <button
              onClick={() => setPaused(!paused)}
              className={`flex h-8 items-center gap-1.5 rounded-lg border px-2.5 transition-colors ${
                paused
                  ? 'border-warning/50 bg-warning/10 text-warning hover:bg-warning/20'
                  : 'border-border bg-card text-muted-foreground hover:bg-accent'
              }`}
              aria-label={paused ? 'Resume feed' : 'Pause feed'}
              title={paused ? 'Data feed paused — click to resume' : 'Click to pause data feed'}
            >
              {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
              <span className="text-[11px] font-medium hidden sm:inline">{paused ? 'Paused' : 'Live'}</span>
            </button>
            <span className="text-[12px] md:text-[13px] font-mono font-semibold text-foreground tracking-tight">
              ${account.totalEquity.toLocaleString()}
            </span>
            <button
              onClick={toggleTheme}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card hover:bg-accent transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-3.5 w-3.5 text-muted-foreground" />
              ) : (
                <Moon className="h-3.5 w-3.5 text-muted-foreground" />
              )}
            </button>
          </div>
        </header>
        <main className={isMobile ? 'p-4 pb-20' : 'p-8'}>
          {children}
        </main>
        {isMobile && <BottomTabBar />}
      </div>
    </div>
  );
}
