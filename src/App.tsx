import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GameStateProvider } from '@/systems/GameStateSystem';
import { Toaster } from '@/components/ui/sonner';
import { ConsentBanner } from '@/components/analytics/ConsentBanner';
import { GameTransition } from '@/components/GameTransition';
import GameLobby from '@/pages/GameLobby';
import GamePlay from '@/pages/GamePlay';
import MissionsPage from '@/pages/MissionsPage';
import AchievementsPage from '@/pages/AchievementsPage';
import DailyRewardsPage from '@/pages/DailyRewardsPage';
import ReferralsPage from '@/pages/ReferralsPage';
import VIPPage from '@/pages/VIPPage';
import SettingsPage from '@/pages/SettingsPage';
import CoinStorePage from '@/pages/CoinStorePage';
import RewardsPage from '@/pages/RewardsPage';
import AnalyticsPage from '@/pages/admin/Analytics';
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <GameStateProvider>
      <Router>
        <GameTransition>
          <Routes>
            <Route path="/" element={<GameLobby />} />
            <Route path="/game" element={<GamePlay />} />
            <Route path="/missions" element={<MissionsPage />} />
            <Route path="/achievements" element={<AchievementsPage />} />
            <Route path="/daily-rewards" element={<DailyRewardsPage />} />
            <Route path="/referrals" element={<ReferralsPage />} />
            <Route path="/vip" element={<VIPPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/coin-store" element={<CoinStorePage />} />
            <Route path="/rewards" element={<RewardsPage />} />
            <Route path="/admin/analytics" element={<AnalyticsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </GameTransition>
        <Toaster />
        <ConsentBanner />
      </Router>
    </GameStateProvider>
  );
}

export default App;