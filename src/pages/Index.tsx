import React, { useState, useEffect } from 'react';
import { EnhancedGameHub } from '@/components/EnhancedGameHub';
import { GameStats } from '@/components/GameStats';
import { GameHeader } from '@/components/GameHeader';
import { DailyRewards } from '@/components/DailyRewards';
import { Achievements } from '@/components/Achievements';
import { ReferralSystem } from '@/components/ReferralSystem';
import { EventsAndChests } from '@/components/EventsAndChests';
import { Leaderboard } from '@/components/Leaderboard';
import { DragonMascot } from '@/components/DragonMascot';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlayCircle, Zap, Gift, Star, Trophy, Users, Calendar, Crown } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  // Game State
  const [coins, setCoins] = useState(1000);
  const [energy, setEnergy] = useState(5);
  const [maxEnergy] = useState(10);
  const [level, setLevel] = useState(1);
  const [experience, setExperience] = useState(150);
  const [maxExperience] = useState(1000);
  const [dailySpins, setDailySpins] = useState(3);
  const [maxDailySpins] = useState(20);
  const [currentDay, setCurrentDay] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  
  // New game state
  const [totalSpins, setTotalSpins] = useState(45);
  const [totalCoinsEarned, setTotalCoinsEarned] = useState(15000);
  const [dailyStreak, setDailyStreak] = useState(3);
  const [referrals, setReferrals] = useState([]);
  const [referralCode] = useState('LUCKY' + Math.random().toString(36).substr(2, 4).toUpperCase());
  const [lastWin, setLastWin] = useState(0);
  const [mascotMood, setMascotMood] = useState<'happy' | 'excited' | 'sleepy' | 'celebrating'>('happy');

  // Energy regeneration
  useEffect(() => {
    const interval = setInterval(() => {
      setEnergy(prev => prev < maxEnergy ? prev + 1 : prev);
    }, 60000); // 1 minute = 1 energy

    return () => clearInterval(interval);
  }, [maxEnergy]);

  // Experience and level system
  useEffect(() => {
    if (experience >= maxExperience) {
      setLevel(prev => prev + 1);
      setExperience(0);
      setCoins(prev => prev + 500); // Level up bonus
      toast.success(
        `🎉 Level Up! Agora você é nível ${level + 1}! +500 moedas de bônus!`,
        {
          duration: 4000,
          style: {
            background: 'hsl(var(--primary))',
            color: 'hsl(var(--primary-foreground))',
          }
        }
      );
    }
  }, [experience, maxExperience, level]);

  const handleCoinsChange = (newCoins: number) => {
    const winAmount = newCoins - coins;
    setCoins(newCoins);
    setTotalCoinsEarned(prev => prev + winAmount);
    setExperience(prev => prev + 10); // XP for each spin
    setLastWin(winAmount);
    
    // Update mascot mood based on win
    if (winAmount >= 1000) {
      setMascotMood('celebrating');
    } else if (winAmount > 0) {
      setMascotMood('excited');
    }
  };

  const handleEnergyChange = (newEnergy: number) => {
    setEnergy(newEnergy);
    setDailySpins(prev => prev + 1);
    setTotalSpins(prev => prev + 1);
    
    // Update mascot mood
    if (newEnergy === 0) {
      setMascotMood('sleepy');
    } else {
      setMascotMood('excited');
    }
  };

  const handleClaimDailyReward = (day: number, rewardCoins: number, rewardEnergy: number) => {
    setCoins(prev => prev + rewardCoins);
    setEnergy(prev => Math.min(prev + rewardEnergy, maxEnergy));
    setCurrentDay(prev => prev + 1);
    setDailyStreak(prev => prev + 1);
  };

  const handleAddReferral = (code: string) => {
    const newReferral = {
      id: Math.random().toString(),
      name: `Jogador${Math.floor(Math.random() * 1000)}`,
      level: Math.floor(Math.random() * 10) + 1,
      totalSpins: Math.floor(Math.random() * 100) + 10,
      joinDate: new Date().toISOString()
    };
    setReferrals(prev => [...prev, newReferral]);
    setCoins(prev => prev + 500); // Bonus for referral
  };

  const handleClaimAchievementReward = (reward: number) => {
    setCoins(prev => prev + reward);
  };

  const handleSpendCoins = (amount: number) => {
    setCoins(prev => prev - amount);
  };

  const handleGainCoins = (amount: number) => {
    setCoins(prev => prev + amount);
  };

  const handleGainEnergy = (amount: number) => {
    setEnergy(prev => Math.min(prev + amount, maxEnergy));
  };

  const handleWatchAd = () => {
    if (energy >= maxEnergy) {
      toast.error('Energia já está no máximo!');
      return;
    }
    
    // Simulate watching ad
    setTimeout(() => {
      setEnergy(prev => Math.min(prev + 2, maxEnergy));
      toast.success('🎥 Obrigado por assistir! +2 energia');
    }, 2000);
    
    toast.info('📺 Assistindo anúncio...', { duration: 2000 });
  };

  const startGame = () => {
    setGameStarted(true);
    toast.success(
      '🎰 Bem-vindo ao Lucky Spin Fortune! Gire a roleta e ganhe moedas!',
      {
        duration: 3000,
        style: {
          background: 'hsl(var(--fortune-gold))',
          color: 'hsl(var(--fortune-dark))',
        }
      }
    );
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center bg-card/80 backdrop-blur-md border-2 border-fortune-gold shadow-glow-gold">
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-gold bg-clip-text text-transparent">
                Lucky Fortune Animal
              </h1>
              <p className="text-xl text-fortune-red">🐯 Fortune Tiger Edition 🐯</p>
            </div>
            
            <div className="space-y-4 text-left">
              <div className="flex items-center space-x-3 p-3 bg-fortune-gold/10 rounded-lg border border-fortune-gold/30">
                <PlayCircle className="w-6 h-6 text-fortune-gold" />
                <span className="text-fortune-gold">Gire os rolos e ganhe prêmios em dinheiro</span>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-fortune-red/10 rounded-lg border border-fortune-red/30">
                <Zap className="w-6 h-6 text-fortune-red" />
                <span className="text-fortune-red">Sistema de energia: 1 energia = 1 giro</span>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-fortune-ember/10 rounded-lg border border-fortune-ember/30">
                <Gift className="w-6 h-6 text-fortune-ember" />
                <span className="text-fortune-ember">Bônus diários e jackpots especiais</span>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-fortune-bronze/10 rounded-lg border border-fortune-bronze/30">
                <Star className="w-6 h-6 text-fortune-bronze" />
                <span className="text-fortune-bronze">Multiplique seus ganhos até 15x</span>
              </div>
            </div>
            
            <Button 
              onClick={startGame}
              className="w-full h-14 text-lg bg-gradient-gold hover:scale-105 animate-glow-pulse text-fortune-dark font-bold border-2 border-fortune-ember"
            >
              🎰 JOGAR AGORA
            </Button>
            
            <div className="text-xs text-muted-foreground">
              Jogo recreativo • Para entretenimento • +18 anos
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <EnhancedGameHub
      coins={coins}
      energy={energy}
      level={level}
      experience={experience}
      maxExperience={maxExperience}
      maxEnergy={maxEnergy}
      totalSpins={totalSpins}
      totalCoinsEarned={totalCoinsEarned}
      dailyStreak={dailyStreak}
      lastWin={lastWin}
      onCoinsChange={handleCoinsChange}
      onEnergyChange={handleEnergyChange}
      onExperienceChange={setExperience}
      onLevelUp={() => {
        setLevel(prev => prev + 1);
        setExperience(0);
        setCoins(prev => prev + 500);
      }}
    />
  );
};

export default Index;