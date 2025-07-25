import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Gift, Users, Star } from 'lucide-react';
import dragonWheel from '@/assets/dragon-wheel.jpg';

interface GameHeaderProps {
  playerName: string;
  level: number;
  onOpenSettings: () => void;
  onOpenRewards: () => void;
  onOpenLeaderboard: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  playerName,
  level,
  onOpenSettings,
  onOpenRewards,
  onOpenLeaderboard
}) => {
  return (
    <header className="bg-gradient-to-r from-card/80 to-card/60 backdrop-blur-md border-b border-border/50 p-4">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        {/* Logo and Title */}
        <div className="flex items-center space-x-3">
          <div 
            className="w-12 h-12 rounded-full bg-cover bg-center animate-glow-pulse border-2 border-primary"
            style={{ backgroundImage: `url(${dragonWheel})` }}
          />
          <div>
            <h1 className="text-2xl font-bold bg-gradient-gold bg-clip-text text-transparent">
              Lucky Spin Fortune
            </h1>
            <p className="text-sm text-muted-foreground">
              Bem-vindo, <span className="text-primary font-medium">{playerName}</span>
            </p>
          </div>
        </div>

        {/* Player Level */}
        <div className="hidden md:flex items-center space-x-2">
          <Star className="w-5 h-5 text-primary" />
          <Badge variant="outline" className="bg-primary/10 border-primary/30">
            Nível {level}
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenRewards}
            className="hidden sm:flex hover:bg-primary/10"
          >
            <Gift className="w-4 h-4 mr-2" />
            Recompensas
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenLeaderboard}
            className="hidden sm:flex hover:bg-secondary/10"
          >
            <Users className="w-4 h-4 mr-2" />
            Ranking
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenSettings}
            className="hover:bg-accent/10"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};