import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SimulationProvider } from "@/contexts/SimulationContext";
import DashboardPage from "./pages/DashboardPage";
import PositionsPage from "./pages/PositionsPage";
import PositionDetailPage from "./pages/PositionDetailPage";
import UniversePage from "./pages/UniversePage";
import StrategyConfigPage from "./pages/StrategyConfigPage";
import RiskControlsPage from "./pages/RiskControlsPage";
import AlertsLogsPage from "./pages/AlertsLogsPage";
import SystemStatusPage from "./pages/SystemStatusPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import BacktestPage from "./pages/BacktestPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <SimulationProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/positions" element={<PositionsPage />} />
            <Route path="/positions/:id" element={<PositionDetailPage />} />
            <Route path="/universe" element={<UniversePage />} />
            <Route path="/strategy" element={<StrategyConfigPage />} />
            <Route path="/risk" element={<RiskControlsPage />} />
            <Route path="/alerts" element={<AlertsLogsPage />} />
            <Route path="/system" element={<SystemStatusPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/backtest" element={<BacktestPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SimulationProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
