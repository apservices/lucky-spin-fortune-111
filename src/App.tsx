import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GameStateProvider } from '@/systems/GameStateSystem';
import { Toaster } from '@/components/ui/sonner';
import { ConsentBanner } from '@/components/analytics/ConsentBanner';
import { GameTransition } from '@/components/GameTransition';
import GameLobby from '@/pages/GameLobby';
import GamePlay from '@/pages/GamePlay';
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <GameStateProvider>
      <Router>
        <GameTransition>
          <Routes>
            <Route path="/" element={<GameLobby />} />
            <Route path="/game" element={<GamePlay />} />
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