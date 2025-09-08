import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Star, Crown, Sparkles } from 'lucide-react';

export type GameTheme = 'classic' | 'phoenix' | 'panda' | 'dragon' | 'jade' | 'celestial';

interface ThemeConfig {
  id: GameTheme;
  name: string;
  description: string;
  unlockLevel: number;
  preview: string;
  bgClass: string;
  accentColor: string;
  symbolSet: string[];
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const themes: ThemeConfig[] = [
  {
    id: 'classic',
    name: 'Clássico Dourado',
    description: 'O tema tradicional com símbolos da sorte',
    unlockLevel: 1,
    preview: '🐯🦊🐸',
    bgClass: 'bg-gradient-to-br from-yellow-600 via-yellow-500 to-orange-500',
    accentColor: '#FFD700',
    symbolSet: ['🐯', '🦊', '🐸', '🧧', '🍊', '📜'],
    rarity: 'common',
  },
  {
    id: 'phoenix',
    name: 'Fênix Imperial',
    description: 'Majestade e renascimento em chamas douradas',
    unlockLevel: 5,
    preview: '🔥🕊️⭐',
    bgClass: 'bg-gradient-to-br from-red-600 via-orange-500 to-yellow-500',
    accentColor: '#FF4500',
    symbolSet: ['🔥', '🕊️', '⭐', '🌟', '💎', '👑'],
    rarity: 'rare',
  },
  {
    id: 'panda',
    name: 'Panda Zen',
    description: 'Harmonia e equilíbrio da natureza',
    unlockLevel: 10,
    preview: '🐼🎋🌸',
    bgClass: 'bg-gradient-to-br from-green-600 via-emerald-500 to-teal-500',
    accentColor: '#10B981',
    symbolSet: ['🐼', '🎋', '🌸', '🍃', '🌿', '🧘'],
    rarity: 'epic',
  },
  {
    id: 'dragon',
    name: 'Dragão Celestial',
    description: 'Poder ancestral dos céus orientais',
    unlockLevel: 15,
    preview: '🐲⚡🌊',
    bgClass: 'bg-gradient-to-br from-blue-700 via-purple-600 to-indigo-600',
    accentColor: '#3B82F6',
    symbolSet: ['🐲', '⚡', '🌊', '☁️', '🌙', '🔮'],
    rarity: 'epic',
  },
  {
    id: 'jade',
    name: 'Jade Místico',
    description: 'Tesouros milenares do Oriente',
    unlockLevel: 20,
    preview: '💚🏯🌺',
    bgClass: 'bg-gradient-to-br from-emerald-700 via-green-600 to-jade-500',
    accentColor: '#059669',
    symbolSet: ['💚', '🏯', '🌺', '🎭', '🪷', '🕉️'],
    rarity: 'legendary',
  },
  {
    id: 'celestial',
    name: 'Celestial Supremo',
    description: 'Poderes cósmicos do universo infinito',
    unlockLevel: 30,
    preview: '🌌✨🪐',
    bgClass: 'bg-gradient-to-br from-purple-800 via-violet-700 to-fuchsia-600',
    accentColor: '#8B5CF6',
    symbolSet: ['🌌', '✨', '🪐', '🌟', '💫', '🔯'],
    rarity: 'legendary',
  },
];

interface ThemeSystemProps {
  currentTheme: GameTheme;
  playerLevel: number;
  onThemeChange: (theme: GameTheme) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeSystem: React.FC<ThemeSystemProps> = ({
  currentTheme,
  playerLevel,
  onThemeChange,
  isOpen,
  onClose,
}) => {
  const [selectedTheme, setSelectedTheme] = useState<GameTheme>(currentTheme);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    setSelectedTheme(currentTheme);
  }, [currentTheme]);

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'rare': return <Star className="text-blue-400" size={16} />;
      case 'epic': return <Crown className="text-purple-400" size={16} />;
      case 'legendary': return <Sparkles className="text-yellow-400" size={16} />;
      default: return null;
    }
  };

  const getRarityColor = (rarity: string): string => {
    switch (rarity) {
      case 'rare': return 'border-blue-400 bg-blue-50';
      case 'epic': return 'border-purple-400 bg-purple-50';
      case 'legendary': return 'border-yellow-400 bg-yellow-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const isThemeUnlocked = (theme: ThemeConfig): boolean => {
    return playerLevel >= theme.unlockLevel;
  };

  const handleThemeSelect = (themeId: GameTheme) => {
    const theme = themes.find(t => t.id === themeId);
    if (theme && isThemeUnlocked(theme)) {
      setSelectedTheme(themeId);
      onThemeChange(themeId);
    }
  };

  const getUnlockProgress = (requiredLevel: number): number => {
    return Math.min(100, (playerLevel / requiredLevel) * 100);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-yellow-400/30">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Crown className="text-yellow-400" />
              Temas & Skins da Máquina
            </h2>
            <Button 
              variant="ghost" 
              onClick={onClose}
              className="text-white hover:bg-white/10"
            >
              ✕
            </Button>
          </div>

          {/* Current Theme Info */}
          <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-400/30">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{themes.find(t => t.id === currentTheme)?.preview}</div>
              <div>
                <div className="text-white font-semibold">
                  Tema Atual: {themes.find(t => t.id === currentTheme)?.name}
                </div>
                <div className="text-gray-300 text-sm">
                  {themes.find(t => t.id === currentTheme)?.description}
                </div>
              </div>
            </div>
          </div>

          {/* Theme Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {themes.map((theme) => {
              const isUnlocked = isThemeUnlocked(theme);
              const isSelected = selectedTheme === theme.id;
              const progress = getUnlockProgress(theme.unlockLevel);

              return (
                <Card
                  key={theme.id}
                  className={`
                    relative overflow-hidden cursor-pointer transition-all duration-300
                    ${isSelected ? 'ring-2 ring-yellow-400 scale-105' : ''}
                    ${isUnlocked ? 'hover:scale-105 hover:shadow-xl' : 'opacity-60'}
                    ${getRarityColor(theme.rarity)}
                  `}
                  onClick={() => isUnlocked && handleThemeSelect(theme.id)}
                >
                  {/* Background Preview */}
                  <div className={`h-24 ${theme.bgClass} relative`}>
                    <div className="absolute inset-0 bg-black/20" />
                    
                    {/* Lock Overlay */}
                    {!isUnlocked && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Lock className="text-white" size={24} />
                      </div>
                    )}
                    
                    {/* Rarity Badge */}
                    <div className="absolute top-2 right-2 flex items-center gap-1">
                      {getRarityIcon(theme.rarity)}
                    </div>
                    
                    {/* Selected Indicator */}
                    {isSelected && (
                      <div className="absolute top-2 left-2">
                        <div className="bg-yellow-400 text-yellow-900 rounded-full p-1">
                          <Star size={16} fill="currentColor" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Theme Info */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-gray-800">{theme.name}</h3>
                      <Badge variant={theme.rarity === 'legendary' ? 'default' : 'secondary'}>
                        Nv. {theme.unlockLevel}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {theme.description}
                    </p>
                    
                    {/* Symbol Preview */}
                    <div className="text-2xl space-x-1">
                      {theme.symbolSet.slice(0, 3).map((symbol, idx) => (
                        <span key={idx}>{symbol}</span>
                      ))}
                    </div>
                    
                    {/* Unlock Progress */}
                    {!isUnlocked && (
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500">
                          Progresso: Nível {playerLevel}/{theme.unlockLevel}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Theme Benefits Info */}
          <div className="mt-6 p-4 bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-lg border border-green-400/30">
            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
              <Sparkles className="text-green-400" size={16} />
              Benefícios dos Temas
            </h3>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• Símbolos únicos com animações exclusivas</li>
              <li>• Efeitos visuais e sonoros temáticos</li>
              <li>• Multiplicadores de XP para temas raros</li>
              <li>• Unlocks de conquistas especiais</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Export the themes configuration for use in other components
export { themes };
export type { ThemeConfig };