import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Zap, 
  Coins, 
  Crown, 
  Star, 
  Volume2, 
  VolumeX, 
  Settings, 
  Trophy, 
  Target,
  Palette,
  Play,
  Pause,
  Plus,
  Minus
} from 'lucide-react';
import { toast } from 'sonner';

import { ParticleSystem } from './ParticleSystem';
import { MascotSystem } from './MascotSystem';
import { ThemeSystem, GameTheme, themes, type ThemeConfig } from './ThemeSystem';
import { AudioSystem, gameAudio } from './AudioSystem';

interface PremiumZodiacSlotProps {
  coins: number;
  energy: number;
  level: number;
  experience: number;
  onCoinsChange: (newCoins: number) => void;
  onEnergyChange: (newEnergy: number) => void;
  onExperienceChange: (newExp: number) => void;
}

type Symbol = {
  emoji: string;
  name: string;
  multiplier: number;
  rarity: 'common' | 'rare' | 'legendary';
  color: string;
  winSound: string;
};

type WinParticle = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  scale: number;
  rotation: number;
  color: string;
  symbol: string;
};

const symbols: Symbol[] = [
  { emoji: '🐯', name: 'Tigre Dourado', multiplier: 50, rarity: 'legendary', color: 'text-pgbet-gold', winSound: 'roar' },
  { emoji: '🦊', name: 'Raposa da Sorte', multiplier: 20, rarity: 'rare', color: 'text-pgbet-amber', winSound: 'magic' },
  { emoji: '🐸', name: 'Sapo da Prosperidade', multiplier: 15, rarity: 'rare', color: 'text-pgbet-emerald', winSound: 'prosperity' },
  { emoji: '🧧', name: 'Envelope Vermelho', multiplier: 12, rarity: 'rare', color: 'text-pgbet-red', winSound: 'fortune' },
  { emoji: '🍊', name: 'Laranja da Fortuna', multiplier: 8, rarity: 'common', color: 'text-pgbet-amber', winSound: 'fruit' },
  { emoji: '📜', name: 'Pergaminho Místico', multiplier: 25, rarity: 'rare', color: 'text-pgbet-purple', winSound: 'mystic' },
];

export const PremiumZodiacSlot: React.FC<PremiumZodiacSlotProps> = ({
  coins,
  energy,
  level,
  experience,
  onCoinsChange,
  onEnergyChange,
  onExperienceChange
}) => {
  const [reels, setReels] = useState<Symbol[][]>([
    [symbols[0], symbols[1], symbols[2]],
    [symbols[3], symbols[4], symbols[5]],
    [symbols[1], symbols[2], symbols[0]]
  ]);
  
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastWin, setLastWin] = useState(0);
  const [showWin, setShowWin] = useState(false);
  const [bet, setBet] = useState(100);
  const [autoSpin, setAutoSpin] = useState(false);
  const [turboMode, setTurboMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [multiplier, setMultiplier] = useState(1);
  const [winStreak, setWinStreak] = useState(0);
  const [totalSpins, setTotalSpins] = useState(0);
  const [floatingCoins, setFloatingCoins] = useState<Array<{id: number, x: number, y: number}>>([]);
  const [winParticles, setWinParticles] = useState<WinParticle[]>([]);
  const [achievements, setAchievements] = useState<string[]>([]);
  
  // Advanced Features
  const [currentTheme, setCurrentTheme] = useState<GameTheme>('classic');
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [particleTrigger, setParticleTrigger] = useState(0);
  const [particleType, setParticleType] = useState<'win' | 'jackpot' | 'coin_burst' | 'dragon_fire'>('win');
  const [mascotMood, setMascotMood] = useState<'idle' | 'excited' | 'celebrating' | 'sleeping' | 'magical'>('idle');
  const [currentWinningSymbol, setCurrentWinningSymbol] = useState<string>('');
  
  const slotRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Generate floating background coins
  useEffect(() => {
    const generateFloatingCoins = () => {
      const coins = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100
      }));
      setFloatingCoins(coins);
    };
    
    generateFloatingCoins();
    const interval = setInterval(generateFloatingCoins, 15000);
    return () => clearInterval(interval);
  }, []);

  // Auto-spin logic
  useEffect(() => {
    if (autoSpin && !isSpinning && energy > 0 && coins >= bet) {
      const timeout = setTimeout(() => {
        spin();
      }, turboMode ? 500 : 1500);
      return () => clearTimeout(timeout);
    }
  }, [autoSpin, isSpinning, energy, coins, bet, turboMode]);

  // Experience to next level calculation
  const expToNextLevel = level * 1000;
  const expProgress = (experience % expToNextLevel) / expToNextLevel * 100;

  // Get current theme configuration
  const getCurrentThemeConfig = (): ThemeConfig => {
    return themes.find(theme => theme.id === currentTheme) || themes[0];
  };

  const getRandomSymbol = useCallback((): Symbol => {
    const themeConfig = getCurrentThemeConfig();
    const themeSymbols = symbols.filter(symbol => 
      themeConfig.symbolSet.includes(symbol.emoji)
    );
    
    const weights = {
      common: 0.55,
      rare: 0.35,
      legendary: 0.10
    };
    
    // Increase legendary chance with higher levels
    const legendaryBonus = Math.min(level * 0.01, 0.05);
    weights.legendary += legendaryBonus;
    weights.common -= legendaryBonus;
    
    const random = Math.random();
    let rarity: 'common' | 'rare' | 'legendary';
    
    if (random < weights.legendary) {
      rarity = 'legendary';
    } else if (random < weights.legendary + weights.rare) {
      rarity = 'rare';
    } else {
      rarity = 'common';
    }
    
    const filteredSymbols = themeSymbols.filter(s => s.rarity === rarity);
    return filteredSymbols.length > 0 
      ? filteredSymbols[Math.floor(Math.random() * filteredSymbols.length)]
      : symbols[Math.floor(Math.random() * symbols.length)];
  }, [level, currentTheme]);

  const checkWin = useCallback((newReels: Symbol[][]) => {
    // Check middle row (main line)
    const middleRow = [newReels[0][1], newReels[1][1], newReels[2][1]];
    
    if (middleRow[0].name === middleRow[1].name && middleRow[1].name === middleRow[2].name) {
      const symbol = middleRow[0];
      const baseWin = bet * symbol.multiplier;
      let finalMultiplier = multiplier;
      
      // Streak bonus
      if (winStreak > 0) {
        finalMultiplier += Math.min(winStreak * 0.1, 1.0);
      }
      
      // Level bonus
      finalMultiplier += level * 0.05;
      
      const winAmount = Math.floor(baseWin * finalMultiplier);
      return { 
        win: true, 
        amount: winAmount, 
        symbol, 
        line: 'middle',
        multiplier: finalMultiplier,
        isJackpot: symbol.rarity === 'legendary'
      };
    }
    
    // Check other lines with reduced payouts
    const topRow = [newReels[0][0], newReels[1][0], newReels[2][0]];
    const bottomRow = [newReels[0][2], newReels[1][2], newReels[2][2]];
    
    if (topRow[0].name === topRow[1].name && topRow[1].name === topRow[2].name) {
      const symbol = topRow[0];
      const winAmount = Math.floor(bet * symbol.multiplier * 0.6 * multiplier);
      return { win: true, amount: winAmount, symbol, line: 'top', multiplier, isJackpot: false };
    }
    
    if (bottomRow[0].name === bottomRow[1].name && bottomRow[1].name === bottomRow[2].name) {
      const symbol = bottomRow[0];
      const winAmount = Math.floor(bet * symbol.multiplier * 0.6 * multiplier);
      return { win: true, amount: winAmount, symbol, line: 'bottom', multiplier, isJackpot: false };
    }
    
    return { win: false, amount: 0, symbol: null, line: null, multiplier: 1, isJackpot: false };
  }, [bet, multiplier, winStreak, level]);

  const createWinParticles = useCallback((centerX: number, centerY: number, symbol: string, color: string) => {
    const particles: WinParticle[] = [];
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const speed = 2 + Math.random() * 3;
      
      particles.push({
        id: Date.now() + i,
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        scale: 0.5 + Math.random() * 0.5,
        rotation: Math.random() * 360,
        color,
        symbol
      });
    }
    
    setWinParticles(prev => [...prev, ...particles]);
    
    // Remove particles after animation
    setTimeout(() => {
      setWinParticles(prev => prev.filter(p => !particles.find(np => np.id === p.id)));
    }, 1500);
  }, []);

  const playSound = useCallback((type: string) => {
    if (!soundEnabled) return;
    
    // Trigger haptic feedback for mobile devices
    if (navigator.vibrate) {
      const vibrationPattern: { [key: string]: number[] } = {
        spin: [50],
        win: [100, 50, 100],
        bigwin: [200, 100, 200, 100, 200],
        jackpot: [300, 100, 300, 100, 300, 100, 300],
        coin: [30],
      };
      navigator.vibrate(vibrationPattern[type] || [50]);
    }
    
    // Use advanced audio system
    switch (type) {
      case 'spin':
        gameAudio.playSpinSound();
        break;
      case 'win':
        gameAudio.playWinSound(multiplier);
        break;
      case 'bigwin':
        gameAudio.playWinSound(multiplier * 2);
        break;
      case 'jackpot':
        gameAudio.playJackpotSound();
        break;
      case 'coin':
        gameAudio.playCoinSound();
        break;
    }
  }, [soundEnabled, multiplier]);

  const checkAchievements = useCallback((spins: number, streak: number, winAmount: number) => {
    const newAchievements: string[] = [];
    
    if (spins === 10 && !achievements.includes('first_10')) {
      newAchievements.push('first_10');
      toast.success('🏆 Conquista: Primeiros 10 Giros!');
    }
    
    if (streak === 3 && !achievements.includes('triple_win')) {
      newAchievements.push('triple_win');
      toast.success('🏆 Conquista: Sequência Tripla!');
    }
    
    if (winAmount >= bet * 30 && !achievements.includes('big_win')) {
      newAchievements.push('big_win');
      toast.success('🏆 Conquista: Grande Vitória!');
    }
    
    if (newAchievements.length > 0) {
      setAchievements(prev => [...prev, ...newAchievements]);
    }
  }, [achievements, bet]);

  const spin = async () => {
    if (energy < 1) {
      toast.error('⚡ Energia insuficiente! Aguarde a recarga.');
      return;
    }
    
    if (coins < bet) {
      toast.error('💰 Moedas insuficientes para esta aposta!');
      return;
    }

    setIsSpinning(true);
    setShowWin(false);
    
    // Consume energy and bet
    onEnergyChange(energy - 1);
    onCoinsChange(coins - bet);
    
    const newTotalSpins = totalSpins + 1;
    setTotalSpins(newTotalSpins);
    
    playSound('spin');

    // Realistic spinning duration with physics
    const spinDuration = turboMode ? 800 : 2500;
    
    // Create spinning effect with multiple phases
    const spinPhases = turboMode ? 3 : 6;
    const phaseInterval = spinDuration / spinPhases;
    
    for (let phase = 0; phase < spinPhases; phase++) {
      setTimeout(() => {
        const tempReels = [
          [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
          [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
          [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()]
        ];
        setReels(tempReels);
      }, phase * phaseInterval);
    }
    
    setTimeout(() => {
      const finalReels = [
        [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
        [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
        [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()]
      ];
      
      setReels(finalReels);
      
      const result = checkWin(finalReels);
      
      if (result.win) {
        setLastWin(result.amount);
        setShowWin(true);
        setWinStreak(prev => prev + 1);
        
        // Set winning symbol for mascot animation
        setCurrentWinningSymbol(result.symbol?.emoji || '');
        
        // Update coins with winnings
        onCoinsChange(coins - bet + result.amount);
        
        // Add experience
        const expGain = Math.floor(result.amount / 10);
        onExperienceChange(experience + expGain);
        
        // Create win particles and trigger advanced effects
        if (slotRef.current) {
          const rect = slotRef.current.getBoundingClientRect();
          createWinParticles(
            rect.width / 2,
            rect.height / 2,
            result.symbol?.emoji || '💰',
            result.symbol?.color || 'text-pgbet-gold'
          );
        }
        
        // Determine win type and play appropriate sound
        if (result.amount >= bet * 20) {
          playSound('jackpot');
          setMascotMood('magical');
          setParticleType('jackpot');
          setParticleTrigger(prev => prev + 1);
          gameAudio.playMascotSound(result.symbol?.emoji || '');
          toast.success(
            `🎰 MEGA JACKPOT! ${result.symbol?.emoji} ${result.symbol?.name}! +${result.amount} moedas! x${result.multiplier.toFixed(1)}`,
            {
              duration: 6000,
              style: {
                background: 'linear-gradient(135deg, hsl(45 100% 50%), hsl(0 85% 50%))',
                color: 'hsl(0 0% 0%)',
                border: '3px solid hsl(45 100% 70%)',
                fontWeight: 'bold',
                fontSize: '16px'
              }
            }
          );
        } else if (result.amount >= bet * 5) {
          playSound('bigwin');
          setMascotMood('celebrating');
          setParticleType('coin_burst');
          setParticleTrigger(prev => prev + 1);
          gameAudio.playMascotSound(result.symbol?.emoji || '');
          toast.success(
            `🎉 Grande Vitória! ${result.symbol?.emoji} +${result.amount} moedas! x${result.multiplier.toFixed(1)}`,
            {
              duration: 3000,
              style: {
                background: 'linear-gradient(135deg, hsl(45 100% 50%), hsl(142 86% 45%))',
                color: 'hsl(0 0% 0%)',
                border: '2px solid hsl(45 100% 70%)',
                fontWeight: 'bold'
              }
            }
          );
        } else {
          playSound('win');
          setMascotMood('excited');
          setParticleType('win');
          setParticleTrigger(prev => prev + 1);
          toast.success(`✨ Vitória! ${result.symbol?.emoji} +${result.amount} moedas! x${result.multiplier.toFixed(1)}`);
        }
        
        checkAchievements(newTotalSpins, winStreak + 1, result.amount);
        
        // Hide win animation
        setTimeout(() => {
          setShowWin(false);
          setMascotMood('idle');
        }, result.isJackpot ? 4000 : 2500);
      } else {
        setWinStreak(0);
        setMascotMood('idle');
        playSound('spin_end');
      }
      
      setIsSpinning(false);
    }, spinDuration);
  };

  const adjustBet = (increment: boolean) => {
    if (increment && bet < 1000) {
      setBet(prev => Math.min(prev + 50, 1000));
    } else if (!increment && bet > 50) {
      setBet(prev => Math.max(prev - 50, 50));
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto min-h-screen">
      {/* Advanced Audio System */}
      <AudioSystem soundEnabled={soundEnabled} />
      
      {/* Advanced Particle System */}
      <ParticleSystem 
        trigger={particleTrigger}
        type={particleType}
        intensity={lastWin >= bet * 20 ? 3 : lastWin >= bet * 5 ? 2 : 1}
        centerX={50}
        centerY={40}
      />
      
      {/* Floating Coins Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {floatingCoins.map(coin => (
          <div
            key={coin.id}
            className="absolute text-3xl opacity-20 animate-pgbet-coin-float"
            style={{
              left: `${coin.x}%`,
              top: `${coin.y}%`,
              animationDelay: `${coin.id * 0.7}s`,
              animationDuration: `${8 + coin.id * 0.5}s`
            }}
          >
            🪙
          </div>
        ))}
      </div>

      {/* Win Particles */}
      {winParticles.map(particle => (
        <div
          key={particle.id}
          className="fixed pointer-events-none z-50 text-2xl animate-pgbet-particle-burst"
          style={{
            left: particle.x,
            top: particle.y,
            '--particle-x': `${particle.vx * 20}px`,
            '--particle-y': `${particle.vy * 20}px`,
            transform: `scale(${particle.scale}) rotate(${particle.rotation}deg)`,
            color: particle.color
          } as React.CSSProperties}
        >
          {particle.symbol}
        </div>
      ))}

      <Card className={`relative z-10 p-6 ${getCurrentThemeConfig().bgClass} border-4 border-pgbet-gold shadow-2xl animate-pgbet-machine-glow`}>
        {/* Header with Level & XP */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-between mb-2">
            <Badge className="bg-pgbet-purple text-white">
              Nível {level}
            </Badge>
            <h2 className="text-2xl font-bold bg-pgbet-gradient-gold bg-clip-text text-transparent">
              {getCurrentThemeConfig().preview} {getCurrentThemeConfig().name} {getCurrentThemeConfig().preview}
            </h2>
            <Badge className="bg-pgbet-emerald text-white">
              VIP
            </Badge>
          </div>
          
          <div className="mb-2">
            <div className="flex items-center justify-between text-xs text-pgbet-gold mb-1">
              <span>XP: {experience}</span>
              <span>Próximo: {expToNextLevel}</span>
            </div>
            <Progress 
              value={expProgress} 
              className="h-2 bg-pgbet-dark border border-pgbet-gold"
            />
          </div>
          
          <Badge className="bg-pgbet-red text-white animate-pulse">
            Edição Premium PGSoft
          </Badge>
        </div>

        {/* Stats HUD */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="text-center p-2 bg-pgbet-gold/10 rounded-lg border border-pgbet-gold/30">
            <Coins className="w-4 h-4 text-pgbet-gold mx-auto mb-1" />
            <div className="text-sm font-bold text-pgbet-gold">{coins.toLocaleString()}</div>
            <div className="text-xs text-gray-400">Moedas</div>
          </div>
          
          <div className="text-center p-2 bg-pgbet-red/10 rounded-lg border border-pgbet-red/30">
            <Zap className="w-4 h-4 text-pgbet-red mx-auto mb-1" />
            <div className="text-sm font-bold text-pgbet-red">{energy}</div>
            <div className="text-xs text-gray-400">Energia</div>
          </div>
          
          <div className="text-center p-2 bg-pgbet-emerald/10 rounded-lg border border-pgbet-emerald/30">
            <Crown className="w-4 h-4 text-pgbet-emerald mx-auto mb-1" />
            <div className="text-sm font-bold text-pgbet-emerald">{bet}</div>
            <div className="text-xs text-gray-400">Aposta</div>
          </div>
          
          <div className="text-center p-2 bg-pgbet-purple/10 rounded-lg border border-pgbet-purple/30">
            <Target className="w-4 h-4 text-pgbet-purple mx-auto mb-1" />
            <div className="text-sm font-bold text-pgbet-purple">{winStreak}</div>
            <div className="text-xs text-gray-400">Streak</div>
          </div>
        </div>

        {/* Premium Slot Machine - 3x3 Grid */}
        <div className="relative mb-6" ref={slotRef}>
          {showWin && (
            <div className="absolute inset-0 bg-pgbet-gradient-gold opacity-30 animate-pgbet-win-pulse rounded-xl z-20"></div>
          )}
          
          {/* Win Line Indicator */}
          <div className={`absolute top-1/2 left-6 right-6 h-2 bg-pgbet-gold/70 transform -translate-y-1/2 rounded-full z-30 ${
            showWin ? 'animate-pgbet-win-line' : 'opacity-40'
          }`}></div>
          
          <div className="grid grid-cols-3 gap-4 p-8 bg-gradient-to-b from-gray-900 via-black to-gray-900 rounded-2xl border-4 border-pgbet-gold shadow-2xl relative overflow-hidden">
            {/* Premium 3D Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-pgbet-gold/10 via-transparent to-pgbet-red/10 rounded-xl"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 rounded-xl"></div>
            
            {reels.map((column, colIndex) => (
              <div key={colIndex} className="space-y-4 relative z-10">
                {column.map((symbol, rowIndex) => (
                  <div
                    key={`${colIndex}-${rowIndex}`}
                    className={`
                      h-20 flex items-center justify-center text-4xl relative
                      bg-gradient-to-br from-gray-800 via-gray-900 to-black
                      border-2 border-gradient-to-r from-pgbet-gold/60 to-pgbet-red/60
                      rounded-2xl shadow-xl transform-gpu transition-all duration-300
                      ${isSpinning ? 'animate-pgbet-premium-spin' : 'hover:scale-105'}
                      ${showWin && rowIndex === 1 ? 'ring-4 ring-pgbet-gold animate-pgbet-symbol-win shadow-2xl shadow-pgbet-gold/60' : ''}
                    `}
                    style={{
                      boxShadow: showWin && rowIndex === 1 
                        ? '0 0 50px rgba(255, 215, 0, 0.9), inset 0 0 30px rgba(255, 215, 0, 0.4)' 
                        : '0 12px 40px rgba(0, 0, 0, 0.7), inset 0 2px 0 rgba(255, 255, 255, 0.15)',
                      background: showWin && rowIndex === 1
                        ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 100, 0, 0.1))'
                        : undefined
                    }}
                  >
                    <span 
                      className={`${symbol.color} relative z-20 drop-shadow-xl transition-all duration-300 ${
                        showWin && rowIndex === 1 ? 'scale-125' : ''
                      }`}
                      style={{
                        filter: `drop-shadow(0 0 15px currentColor) ${
                          showWin && rowIndex === 1 ? 'brightness(1.5)' : 'brightness(1)'
                        }`,
                        textShadow: showWin && rowIndex === 1 
                          ? '0 0 30px currentColor, 0 0 50px currentColor' 
                          : '0 0 20px currentColor'
                      }}
                    >
                      {symbol.emoji}
                    </span>
                    
                    {/* Premium glow effect */}
                    <div className={`absolute inset-0 bg-gradient-radial from-current/30 to-transparent rounded-2xl ${
                      showWin && rowIndex === 1 ? 'animate-pgbet-sparkle' : ''
                    }`}></div>
                    
                    {/* Symbol rarity indicator */}
                    {symbol.rarity === 'legendary' && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-pgbet-gold rounded-full animate-pulse">
                        <Crown className="w-3 h-3 text-black m-0.5" />
                      </div>
                    )}
                    {symbol.rarity === 'rare' && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-pgbet-purple rounded-full animate-pulse">
                        <Star className="w-3 h-3 text-white m-0.5" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Win Display */}
        {showWin && lastWin > 0 && (
          <div className="text-center mb-4 p-6 bg-pgbet-gradient-gold rounded-xl animate-pgbet-win-pulse border-4 border-pgbet-amber">
            <div className="text-black font-bold text-3xl mb-2">
              🎉 VITÓRIA! 🎉
            </div>
            <div className="text-black font-bold text-2xl">
              +{lastWin.toLocaleString()} moedas
            </div>
            {multiplier > 1 && (
              <div className="text-black font-bold text-lg">
                Multiplicador: {multiplier.toFixed(1)}x
              </div>
            )}
          </div>
        )}

        {/* Premium Controls */}
        <div className="space-y-4">
          {/* Bet Controls */}
          <div className="flex items-center justify-center space-x-4 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => adjustBet(false)}
              disabled={bet <= 50}
              className="border-pgbet-gold text-pgbet-gold hover:bg-pgbet-gold/20 h-10 w-10"
            >
              -
            </Button>
            <div className="text-center min-w-[120px]">
              <div className="text-pgbet-gold font-bold text-lg">
                Aposta: {bet}
              </div>
              <div className="text-xs text-gray-400">
                Max Ganho: {(bet * 50).toLocaleString()}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => adjustBet(true)}
              disabled={bet >= 1000}
              className="border-pgbet-gold text-pgbet-gold hover:bg-pgbet-gold/20 h-10 w-10"
            >
              +
            </Button>
          </div>

          {/* Main Action Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Button
              onClick={spin}
              disabled={isSpinning || energy < 1 || coins < bet}
              className="h-16 bg-pgbet-gradient-gold text-black font-bold text-xl hover:scale-105 transform transition-all duration-200 disabled:opacity-50 shadow-2xl"
            >
              {isSpinning ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin">🎰</div>
                  <span>GIRANDO...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>🎰</span>
                  <span>GIRAR</span>
                </div>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setTurboMode(!turboMode)}
              className={`h-16 border-2 font-bold text-lg ${
                turboMode 
                  ? 'border-pgbet-red bg-pgbet-red/20 text-pgbet-red animate-pulse' 
                  : 'border-pgbet-purple text-pgbet-purple hover:bg-pgbet-purple/10'
              }`}
            >
              {turboMode ? (
                <div className="flex items-center space-x-2">
                  <span>⚡</span>
                  <span>TURBO ON</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>⚡</span>
                  <span>TURBO</span>
                </div>
              )}
            </Button>
          </div>

          {/* Secondary Controls */}
          <div className="grid grid-cols-3 gap-3">
            <Button
              variant="outline"
              onClick={() => setAutoSpin(!autoSpin)}
              disabled={isSpinning}
              className={`h-12 border font-bold ${
                autoSpin 
                  ? 'border-pgbet-emerald bg-pgbet-emerald/20 text-pgbet-emerald' 
                  : 'border-pgbet-amber text-pgbet-amber hover:bg-pgbet-amber/10'
              }`}
            >
              {autoSpin ? '⏸️ AUTO' : '▶️ AUTO'}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="h-12 border-pgbet-bronze text-pgbet-bronze hover:bg-pgbet-bronze/10"
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </Button>
            
            <Button
              variant="outline"
              className="h-12 border-pgbet-jade text-pgbet-jade hover:bg-pgbet-jade/10"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Premium Paytable */}
        <div className="mt-6 p-4 bg-gradient-to-br from-gray-900/70 to-black/70 rounded-xl border border-pgbet-gold/30">
          <div className="text-center text-pgbet-gold font-bold mb-3 flex items-center justify-center space-x-2">
            <Trophy className="w-5 h-5" />
            <span>Tabela de Pagamentos Premium</span>
            <Trophy className="w-5 h-5" />
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {symbols.map(symbol => (
              <div key={symbol.name} className="flex items-center justify-between p-2 bg-black/30 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className={`${symbol.color} text-lg`}>{symbol.emoji}</span>
                  <span className="text-gray-300 text-xs">{symbol.name}</span>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${symbol.color}`}>{symbol.multiplier}x</div>
                  <div className="text-xs text-gray-400 capitalize">{symbol.rarity}</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-3 pt-3 border-t border-pgbet-gold/20 text-center">
            <div className="text-xs text-gray-400 mb-1">
              Total de Giros: {totalSpins} | Sequência Atual: {winStreak}
            </div>
            <div className="text-xs text-gray-400">
              Conquistas Desbloqueadas: {achievements.length}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};