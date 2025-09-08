import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WheelGame } from './WheelGame';
import { SlotMachine } from './SlotMachine';
import { FortuneTigerSlot } from './FortuneTigerSlot';
import { PremiumZodiacSlot } from './PremiumZodiacSlot';
import { MissionsSystem } from './MissionsSystem';
import { CollectiblesSystem } from './CollectiblesSystem';
import { VIPSystem } from './VIPSystem';
import { GameStats } from './GameStats';
import { DailyRewards } from './DailyRewards';
import { SpriteSystem } from './SpriteSystem';
import { DragonMascot } from './DragonMascot';
import { AudioControlPanel, premiumAudio } from './PremiumAudioSystem';
import { ParallaxCoinsBackground } from './ParallaxCoinsBackground';
import { HapticProvider, HapticControls, useGameHaptics } from './HapticSystem';
import { 
  Crown, Star, Zap, Coins, Gift, Target, Gem, 
  Trophy, Calendar, Users, PlayCircle, Gamepad2, Volume2 
} from 'lucide-react';
import { toast } from 'sonner';

interface EnhancedGameHubProps {
  coins: number;
  energy: number;
  level: number;
  experience: number;
  maxExperience: number;
  maxEnergy: number;
  totalSpins: number;
  totalCoinsEarned: number;
  dailyStreak: number;
  lastWin: number;
  onCoinsChange: (newCoins: number) => void;
  onEnergyChange: (newEnergy: number) => void;
  onExperienceChange: (newXP: number) => void;
  onLevelUp: () => void;
}

export const EnhancedGameHub: React.FC<EnhancedGameHubProps> = ({
  coins,
  energy,
  level,
  experience,
  maxExperience,
  maxEnergy,
  totalSpins,
  totalCoinsEarned,
  dailyStreak,
  lastWin,
  onCoinsChange,
  onEnergyChange,
  onExperienceChange,
  onLevelUp
}) => {
  const [activeTab, setActiveTab] = useState('games');
  const [notifications, setNotifications] = useState<string[]>([]);
  const [activeGame, setActiveGame] = useState<string>('fortune-tiger');
  const [showAudioControls, setShowAudioControls] = useState(false);
  
  // Haptic feedback for level ups
  const gameHaptics = useGameHaptics();

  // Audio initialization
  useEffect(() => {
    const initAudio = async () => {
      await premiumAudio.startBackgroundMusic();
    };
    
    // Start background music after user interaction
    const handleFirstInteraction = () => {
      initAudio();
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
      premiumAudio.stopBackgroundMusic();
    };
  }, []);

  // Available games
  const games = [
    {
      id: 'fortune-tiger',
      name: 'Fortune Tiger',
      description: 'O clássico caça-níquel Fortune Tiger',
      minLevel: 1,
      icon: <div className="text-2xl">🐯</div>,
      isNew: false,
      featured: true
    },
    {
      id: 'wheel-fortune',
      name: 'Roda da Fortuna',
      description: 'Gire a roda e ganhe prêmios incríveis',
      minLevel: 1,
      icon: <div className="text-2xl">🎡</div>,
      isNew: false,
      featured: false
    },
    {
      id: 'wild-slots',
      name: 'Wild Slots Animais',
      description: 'Slots com animais selvagens da sorte',
      minLevel: 1,
      icon: <div className="text-2xl">🦊</div>,
      isNew: false,
      featured: false
    },
    {
      id: 'dragon-treasure',
      name: 'Tesouro do Dragão',
      description: 'Desperte o dragão e encontre tesouros',
      minLevel: 5,
      icon: <div className="text-2xl">🐲</div>,
      isNew: true,
      featured: true
    },
    {
      id: 'phoenix-fire',
      name: 'Fogo da Fênix',
      description: 'Renasça das cinzas com grandes prêmios',
      minLevel: 10,
      icon: <div className="text-2xl">🔥</div>,
      isNew: true,
      featured: false
    },
    {
      id: 'golden-palace',
      name: 'Palácio Dourado',
      description: 'Entre no palácio e encontre riquezas',
      minLevel: 15,
      icon: <div className="text-2xl">🏰</div>,
      isNew: false,
      featured: false
    }
  ];

  // Check for achievements and notifications
  useEffect(() => {
    const newNotifications: string[] = [];

    // Level milestones with haptic feedback
    if (level === 5) {
      newNotifications.push('🎉 Nível 5 alcançado! Novo jogo desbloqueado!');
      gameHaptics.levelUpHaptic(5);
    }
    if (level === 10) {
      newNotifications.push('🔥 Nível 10! Fogo da Fênix disponível!');
      gameHaptics.levelUpHaptic(10);
    }
    if (level === 15) {
      newNotifications.push('🏰 Nível 15! Palácio Dourado desbloqueado!');
      gameHaptics.levelUpHaptic(15);
    }

    // Coin milestones
    if (totalCoinsEarned >= 100000 && totalCoinsEarned < 100500) {
      newNotifications.push('💰 100.000 moedas ganhas! Você é um verdadeiro magnata!');
      gameHaptics.success();
    }

    // Spin milestones
    if (totalSpins >= 100 && totalSpins < 105) {
      newNotifications.push('🎰 100 giros completados! Mestre dos slots!');
      gameHaptics.success();
    }

    setNotifications(newNotifications);
  }, [level, totalCoinsEarned, totalSpins, gameHaptics]);

  const handleMissionReward = (coins: number, xp: number) => {
    onCoinsChange(coins + coins);
    onExperienceChange(experience + xp);
    
    if (experience + xp >= maxExperience) {
      onLevelUp();
    }
  };

  const handleCollectionReward = (coins: number, xp: number) => {
    onCoinsChange(coins + coins);
    onExperienceChange(experience + xp);
    
    if (experience + xp >= maxExperience) {
      onLevelUp();
    }
  };

  const handleVIPBonus = (coins: number, energy: number) => {
    onCoinsChange(coins + coins);
    onEnergyChange(Math.min(energy + energy, maxEnergy));
  };

  const canPlayGame = (gameMinLevel: number) => level >= gameMinLevel;

  const handlePlayGame = (gameId: string) => {
    if (energy < 1) {
      gameHaptics.error();
      toast.error('⚡ Energia insuficiente!');
      return;
    }
    
    gameHaptics.buttonClick();
    setActiveGame(gameId);
    gameHaptics.success();
    toast.success(`🎮 ${games.find(g => g.id === gameId)?.name} carregado!`);
  };

  const renderGameCard = (game: any) => (
    <Card key={game.id} className={`p-6 transition-all hover:scale-105 cursor-pointer ${
      game.featured 
        ? 'bg-gradient-to-br from-fortune-gold/20 to-fortune-ember/20 border-2 border-fortune-gold shadow-glow-gold' 
        : 'bg-card/80 border border-primary/30'
    } ${!canPlayGame(game.minLevel) ? 'opacity-50' : ''}`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {game.icon}
            <div>
              <h3 className={`font-bold ${game.featured ? 'text-fortune-gold' : 'text-primary'}`}>
                {game.name}
              </h3>
              <p className="text-sm text-muted-foreground">{game.description}</p>
            </div>
          </div>
          
          <div className="flex flex-col items-end space-y-1">
            {game.isNew && (
              <Badge className="bg-fortune-red text-white animate-pulse">NOVO</Badge>
            )}
            {game.featured && (
              <Badge className="bg-fortune-gold text-fortune-dark">DESTAQUE</Badge>
            )}
            <div className="text-xs text-muted-foreground">
              Nível {game.minLevel}+
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <Zap className="w-4 h-4 text-primary" />
              <span>1 energia</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-secondary" />
              <span>+10 XP</span>
            </div>
          </div>

          <Button
            disabled={!canPlayGame(game.minLevel) || energy < 1}
            onClick={() => handlePlayGame(game.id)}
            className={`${game.featured 
              ? 'bg-gradient-gold hover:scale-105 text-fortune-dark' 
              : ''
            }`}
          >
            <PlayCircle className="w-4 h-4 mr-2" />
            {!canPlayGame(game.minLevel) ? 'Bloqueado' : 'Jogar'}
          </Button>
        </div>
      </div>
    </Card>
  );

  return (
    <HapticProvider>
      <SpriteSystem>
        <div className="min-h-screen bg-gradient-background p-4">
      {/* Header with Stats */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 bg-gradient-to-r from-fortune-gold/20 to-fortune-ember/20 border border-fortune-gold">
            <div className="flex items-center space-x-3">
              <Coins className="w-8 h-8 text-fortune-gold" />
              <div>
                <div className="text-2xl font-bold text-fortune-gold">
                  {coins.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Moedas</div>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary">
            <div className="flex items-center space-x-3">
              <Zap className="w-8 h-8 text-primary" />
              <div>
                <div className="text-2xl font-bold text-primary">
                  {energy}/{maxEnergy}
                </div>
                <div className="text-sm text-muted-foreground">Energia</div>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-r from-secondary/20 to-accent/20 border border-secondary">
            <div className="flex items-center space-x-3">
              <Crown className="w-8 h-8 text-secondary" />
              <div>
                <div className="text-2xl font-bold text-secondary">
                  {level}
                </div>
                <div className="text-sm text-muted-foreground">Nível</div>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-r from-accent/20 to-primary/20 border border-accent">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Trophy className="w-8 h-8 text-accent" />
                <div>
                  <div className="text-2xl font-bold text-accent">
                    {totalSpins}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Giros</div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAudioControls(!showAudioControls)}
                className="text-pgbet-gold hover:bg-pgbet-gold/20"
              >
                <Volume2 className="w-5 h-5" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Audio Control Panel */}
        {showAudioControls && (
          <div className="mb-6 flex justify-center space-x-6">
            <AudioControlPanel 
              audioEngine={premiumAudio}
              className="w-full max-w-md"
            />
            <div className="flex items-center">
              <HapticControls />
            </div>
          </div>
        )}

        {/* Experience Bar */}
        <Card className="p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Experiência</span>
            <span className="text-sm text-muted-foreground">
              {experience}/{maxExperience} XP
            </span>
          </div>
          <Progress value={(experience / maxExperience) * 100} className="h-3" />
        </Card>

        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="space-y-2 mb-6">
            {notifications.map((notification, index) => (
              <Card key={index} className="p-3 bg-fortune-gold/20 border border-fortune-gold animate-pulse">
                <div className="text-center text-fortune-dark font-medium">
                  {notification}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-6">
            <TabsTrigger value="games" className="flex items-center space-x-2">
              <Gamepad2 className="w-4 h-4" />
              <span>Jogos</span>
            </TabsTrigger>
            <TabsTrigger value="missions" className="flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>Missões</span>
            </TabsTrigger>
            <TabsTrigger value="collectibles" className="flex items-center space-x-2">
              <Gem className="w-4 h-4" />
              <span>Colecionáveis</span>
            </TabsTrigger>
            <TabsTrigger value="vip" className="flex items-center space-x-2">
              <Crown className="w-4 h-4" />
              <span>VIP</span>
            </TabsTrigger>
            <TabsTrigger value="rewards" className="flex items-center space-x-2">
              <Gift className="w-4 h-4" />
              <span>Recompensas</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center space-x-2">
              <Trophy className="w-4 h-4" />
              <span>Estatísticas</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="games" className="space-y-6">
            {/* Featured Games */}
            <div>
              <h2 className="text-2xl font-bold text-primary mb-4">🌟 Jogos em Destaque</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                {games.filter(game => game.featured).map(renderGameCard)}
              </div>
            </div>

            {/* All Games */}
            <div>
              <h2 className="text-2xl font-bold text-primary mb-4">🎮 Todos os Jogos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {games.map(renderGameCard)}
              </div>
            </div>

            {/* Game Area with Background */}
            <div className="mt-8 relative">
              <ParallaxCoinsBackground />
              <Card className="relative z-10 p-6 bg-gradient-to-br from-pgbet-dark via-black to-pgbet-dark border-2 border-pgbet-gold">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-pgbet-gold">
                    🎮 {games.find(g => g.id === activeGame)?.name || 'Zodiac Fortune Slots'}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {games.find(g => g.id === activeGame)?.description || 'Gire e ganhe fortunas!'}
                  </p>
                </div>
                
                {activeGame === 'fortune-tiger' && (
                  <PremiumZodiacSlot
                    coins={coins}
                    energy={energy}
                    level={level}
                    experience={experience}
                    onCoinsChange={onCoinsChange}
                    onEnergyChange={onEnergyChange}
                    onExperienceChange={onExperienceChange}
                  />
                )}
                
                {activeGame === 'wheel-fortune' && (
                  <WheelGame
                    coins={coins}
                    energy={energy}
                    onCoinsChange={onCoinsChange}
                    onEnergyChange={onEnergyChange}
                  />
                )}
                
                {activeGame === 'wild-slots' && (
                  <FortuneTigerSlot
                    coins={coins}
                    energy={energy}
                    onCoinsChange={onCoinsChange}
                    onEnergyChange={onEnergyChange}
                  />
                )}
                
                {(activeGame === 'dragon-treasure' || activeGame === 'phoenix-fire' || activeGame === 'golden-palace') && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔒</div>
                    <h3 className="text-2xl font-bold text-pgbet-gold mb-2">Em Breve!</h3>
                    <p className="text-gray-400">Este jogo incrível está sendo desenvolvido...</p>
                    <Button 
                      onClick={() => setActiveGame('fortune-tiger')}
                      className="mt-4 bg-pgbet-gradient-gold text-black"
                    >
                      Voltar para Fortune Tiger
                    </Button>
                  </div>
                )}
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="missions">
            <MissionsSystem
              totalSpins={totalSpins}
              totalCoinsEarned={totalCoinsEarned}
              dailyStreak={dailyStreak}
              level={level}
              onClaimReward={handleMissionReward}
            />
          </TabsContent>

          <TabsContent value="collectibles">
            <CollectiblesSystem
              totalSpins={totalSpins}
              level={level}
              totalCoinsEarned={totalCoinsEarned}
              onCollectionComplete={handleCollectionReward}
            />
          </TabsContent>

          <TabsContent value="vip">
            <VIPSystem
              totalCoinsEarned={totalCoinsEarned}
              totalSpins={totalSpins}
              level={level}
              onClaimDailyVIP={handleVIPBonus}
            />
          </TabsContent>

          <TabsContent value="rewards">
            <DailyRewards
              currentDay={dailyStreak}
              onClaimReward={(day, coins, energy) => {
                onCoinsChange(coins + coins);
                onEnergyChange(Math.min(energy + energy, maxEnergy));
              }}
            />
          </TabsContent>

          <TabsContent value="stats">
            <GameStats
              coins={coins}
              energy={energy}
              maxEnergy={maxEnergy}
              level={level}
              experience={experience}
              maxExperience={maxExperience}
              dailySpins={totalSpins % 50} // Reset daily
              maxDailySpins={50}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Dragon Mascot */}
      <div className="fixed bottom-4 right-4">
        <DragonMascot 
          mood={lastWin > 1000 ? 'celebrating' : energy === 0 ? 'sleepy' : 'happy'}
          isSpinning={false}
          lastWin={lastWin}
          energy={energy}
        />
      </div>
      </div>
    </SpriteSystem>
    </HapticProvider>
  );
};