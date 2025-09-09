import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GameStateProvider } from "@/systems/GameStateSystem";
import { ConsentBanner } from "@/components/analytics/ConsentBanner";
import { PerformanceMonitor } from "@/components/analytics/PerformanceMonitor";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AnalyticsPage from "./pages/admin/Analytics";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <GameStateProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin/analytics" element={<AnalyticsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <ConsentBanner />
        <PerformanceMonitor showDetails={false} position="top-right" />
      </TooltipProvider>
    </GameStateProvider>
  </QueryClientProvider>
);

export default App;