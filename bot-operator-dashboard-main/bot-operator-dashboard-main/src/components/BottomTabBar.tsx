import { useLocation, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, BarChart3, Bell, FlaskConical, MoreHorizontal,
} from 'lucide-react';
import { useState } from 'react';
import {
  Globe, Settings, Shield, Activity, TrendingUp,
} from 'lucide-react';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';

const primaryTabs = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/positions', label: 'Positions', icon: BarChart3 },
  { path: '/alerts', label: 'Alerts', icon: Bell },
  { path: '/backtest', label: 'Backtest', icon: FlaskConical },
];

const moreTabs = [
  { path: '/universe', label: 'Universe', icon: Globe },
  { path: '/strategy', label: 'Strategy', icon: Settings },
  { path: '/risk', label: 'Risk', icon: Shield },
  { path: '/system', label: 'System', icon: Activity },
  { path: '/analytics', label: 'Analytics', icon: TrendingUp },
];

export function BottomTabBar() {
  const location = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const isMoreActive = moreTabs.some(t => isActive(t.path));

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-stretch border-t border-border bg-card/95 backdrop-blur-xl safe-bottom">
        {primaryTabs.map(tab => {
          const active = isActive(tab.path);
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={cn(
                'flex flex-1 flex-col items-center justify-center gap-0.5 py-2 transition-colors',
                active ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <tab.icon className={cn('h-[18px] w-[18px]', active && 'drop-shadow-sm')} />
              <span className={cn('text-[10px] leading-none', active ? 'font-semibold' : 'font-medium')}>{tab.label}</span>
              {active && <div className="absolute top-0 h-[2px] w-8 rounded-b bg-primary" />}
            </Link>
          );
        })}
        <button
          onClick={() => setMoreOpen(true)}
          className={cn(
            'flex flex-1 flex-col items-center justify-center gap-0.5 py-2 transition-colors',
            isMoreActive ? 'text-primary' : 'text-muted-foreground'
          )}
        >
          <MoreHorizontal className={cn('h-[18px] w-[18px]', isMoreActive && 'drop-shadow-sm')} />
          <span className={cn('text-[10px] leading-none', isMoreActive ? 'font-semibold' : 'font-medium')}>More</span>
          {isMoreActive && <div className="absolute top-0 h-[2px] w-8 rounded-b bg-primary" />}
        </button>
      </nav>

      <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl p-0 bg-card border-border">
          <SheetTitle className="sr-only">More Pages</SheetTitle>
          <div className="px-2 pt-4 pb-6">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-muted-foreground/30" />
            <div className="grid grid-cols-3 gap-1">
              {moreTabs.map(tab => {
                const active = isActive(tab.path);
                return (
                  <Link
                    key={tab.path}
                    to={tab.path}
                    onClick={() => setMoreOpen(false)}
                    className={cn(
                      'flex flex-col items-center gap-1.5 rounded-xl py-4 px-2 transition-colors',
                      active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50'
                    )}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span className={cn('text-[11px]', active ? 'font-semibold' : 'font-medium')}>{tab.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
