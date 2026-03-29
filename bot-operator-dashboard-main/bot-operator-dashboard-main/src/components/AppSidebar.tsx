import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, BarChart3, Globe, Settings, Shield, Bell, Activity, TrendingUp, X, Menu, FlaskConical,
} from 'lucide-react';
import { accountSummary } from '@/mocks/data';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/positions', label: 'Positions', icon: BarChart3 },
  { path: '/universe', label: 'Universe', icon: Globe },
  { path: '/strategy', label: 'Strategy Config', icon: Settings },
  { path: '/risk', label: 'Risk Controls', icon: Shield },
  { path: '/alerts', label: 'Alerts & Logs', icon: Bell },
  { path: '/system', label: 'System Status', icon: Activity },
  { path: '/analytics', label: 'Analytics', icon: TrendingUp },
  { path: '/backtest', label: 'Backtesting', icon: FlaskConical },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation();

  return (
    <>
      {/* Brand */}
      <div className="flex h-[60px] items-center gap-2.5 border-b border-sidebar-border px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm">
          <TrendingUp className="h-4 w-4 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-[13px] font-semibold tracking-tight text-foreground">TradingBot</h1>
          <p className="text-[10px] text-muted-foreground leading-none mt-0.5">Operator Console</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-thin">
        <p className="section-header px-3 mb-2">Navigation</p>
        {navItems.map((item) => {
          const active = item.path === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-2.5 rounded-lg px-3 py-[9px] text-[13px] transition-all duration-150',
                active
                  ? 'bg-sidebar-accent text-foreground font-medium shadow-sm'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-foreground'
              )}
            >
              <item.icon className={cn('h-[16px] w-[16px] shrink-0', active ? 'text-primary' : '')} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer status */}
      <div className="border-t border-sidebar-border px-5 py-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <div className="h-[6px] w-[6px] rounded-full bg-success animate-pulse" />
            <span>System Online</span>
          </div>
          <span className="text-[10px] font-mono text-muted-foreground">v{accountSummary.openPositionsCount > 0 ? '2.4.1' : '2.4.0'}</span>
        </div>
      </div>
    </>
  );
}

export function AppSidebar() {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  // Swipe from left edge to open, swipe left to close
  useSwipeGesture({
    onSwipeRight: isMobile ? () => setOpen(true) : undefined,
    onSwipeLeft: isMobile && open ? () => setOpen(false) : undefined,
    edgeOnly: true,
    edgeWidth: 35,
  });

  if (isMobile) {
    return (
      <>
        <button
          onClick={() => setOpen(true)}
          className="fixed top-3 left-3 z-50 flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card shadow-md lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-4 w-4 text-foreground" />
        </button>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="left" className="w-[260px] p-0 bg-sidebar border-sidebar-border">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <div className="flex h-full flex-col">
              <SidebarContent onNavigate={() => setOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </>
    );
  }

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[232px] flex-col border-r border-sidebar-border bg-sidebar">
      <SidebarContent />
    </aside>
  );
}
