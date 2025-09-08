import { useState, useEffect } from 'react';
import { useLazySpriteLoader } from '@/hooks/useLazySpriteLoader';

// Import all sprite assets
import tigerIdle from '@/assets/sprites/tiger-idle.webp';
import tigerWin from '@/assets/sprites/tiger-win.webp';
import foxIdle from '@/assets/sprites/fox-idle.webp';
import foxWin from '@/assets/sprites/fox-win.webp';
import frogIdle from '@/assets/sprites/frog-idle.webp';
import frogWin from '@/assets/sprites/frog-win.webp';
import envelopeIdle from '@/assets/sprites/envelope-idle.webp';
import envelopeWin from '@/assets/sprites/envelope-win.webp';
import orangeIdle from '@/assets/sprites/orange-idle.webp';
import orangeWin from '@/assets/sprites/orange-win.webp';
import scrollIdle from '@/assets/sprites/scroll-idle.webp';
import scrollWin from '@/assets/sprites/scroll-win.webp';

export interface SpriteSymbol {
  id: string;
  name: string;
  multiplier: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  color: string;
  idleSprite: string;
  winSprite: string;
}

export const SYMBOL_SPRITES: SpriteSymbol[] = [
  {
    id: 'tiger',
    name: 'Tigre Dourado',
    multiplier: 50,
    rarity: 'legendary',
    color: 'from-yellow-400 via-amber-500 to-orange-600',
    idleSprite: tigerIdle,
    winSprite: tigerWin
  },
  {
    id: 'fox',
    name: 'Raposa da Sorte', 
    multiplier: 25,
    rarity: 'epic',
    color: 'from-orange-400 via-red-500 to-pink-600',
    idleSprite: foxIdle,
    winSprite: foxWin
  },
  {
    id: 'frog',
    name: 'Sapo da Prosperidade',
    multiplier: 15,
    rarity: 'rare',
    color: 'from-green-400 via-emerald-500 to-teal-600',
    idleSprite: frogIdle,
    winSprite: frogWin
  },
  {
    id: 'envelope',
    name: 'Envelope Vermelho',
    multiplier: 10,
    rarity: 'rare',
    color: 'from-red-400 via-rose-500 to-pink-600',
    idleSprite: envelopeIdle,
    winSprite: envelopeWin
  },
  {
    id: 'orange',
    name: 'Laranja da Fortuna',
    multiplier: 5,
    rarity: 'common',
    color: 'from-orange-300 via-orange-400 to-orange-500',
    idleSprite: orangeIdle,
    winSprite: orangeWin
  },
  {
    id: 'scroll',
    name: 'Pergaminho Místico',
    multiplier: 3,
    rarity: 'common',
    color: 'from-amber-300 via-yellow-400 to-yellow-500',
    idleSprite: scrollIdle,
    winSprite: scrollWin
  }
];

interface SpriteComponentProps {
  symbol: SpriteSymbol;
  isWinning?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const SpriteComponent = ({ 
  symbol, 
  isWinning = false, 
  size = 'md',
  className = '' 
}: SpriteComponentProps) => {
  const { loadedSprites, loadSprite } = useLazySpriteLoader();
  const [imageError, setImageError] = useState(false);

  const spriteUrl = isWinning ? symbol.winSprite : symbol.idleSprite;
  const spriteKey = `${symbol.id}-${isWinning ? 'win' : 'idle'}`;

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  useEffect(() => {
    loadSprite(spriteKey, spriteUrl).catch(() => {
      setImageError(true);
    });
  }, [spriteKey, spriteUrl, loadSprite]);

  const spriteState = loadedSprites[spriteKey];
  const isLoaded = spriteState?.loaded && !imageError;

  return (
    <div className={`${sizeClasses[size]} ${className} relative overflow-hidden`}>
      {isLoaded ? (
        <img
          src={spriteUrl}
          alt={symbol.name}
          className={`w-full h-full object-cover transition-all duration-300 ${
            isWinning ? 'animate-pulse scale-110' : 'hover:scale-105'
          }`}
          draggable={false}
        />
      ) : (
        <div className={`w-full h-full bg-gradient-to-br ${symbol.color} animate-pulse rounded-lg flex items-center justify-center`}>
          <div className="text-white text-xs font-bold text-center px-1">
            {symbol.name.split(' ')[0]}
          </div>
        </div>
      )}
      
      {isWinning && isLoaded && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-300/30 via-white/40 to-yellow-300/30 animate-pulse" />
          <div className="absolute -inset-2 bg-yellow-400/20 blur-lg animate-pulse" />
        </div>
      )}
    </div>
  );
};

interface SpriteSystemProps {
  children: React.ReactNode;
}

export const SpriteSystem = ({ children }: SpriteSystemProps) => {
  const { preloadSprites, isLoading } = useLazySpriteLoader();

  useEffect(() => {
    // Preload all sprites on component mount
    const allSprites = SYMBOL_SPRITES.flatMap(symbol => [
      { key: `${symbol.id}-idle`, url: symbol.idleSprite },
      { key: `${symbol.id}-win`, url: symbol.winSprite }
    ]);

    preloadSprites(allSprites);
  }, [preloadSprites]);

  return (
    <div className="sprite-system">
      {isLoading && (
        <div className="fixed top-4 right-4 z-50 bg-black/80 text-white px-3 py-2 rounded-lg text-sm">
          Carregando sprites...
        </div>
      )}
      {children}
    </div>
  );
};