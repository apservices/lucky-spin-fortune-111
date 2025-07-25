import React, { useEffect, useState } from 'react';

interface FloatingCoin {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export const FloatingCoinsBackground: React.FC = () => {
  const [coins, setCoins] = useState<FloatingCoin[]>([]);

  useEffect(() => {
    const generateCoins = () => {
      const newCoins: FloatingCoin[] = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 0.5 + 0.8, // 0.8 to 1.3
        duration: Math.random() * 10 + 15, // 15-25 seconds
        delay: Math.random() * 5
      }));
      setCoins(newCoins);
    };

    generateCoins();
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {coins.map(coin => (
        <div
          key={coin.id}
          className="absolute opacity-10 animate-pgbet-coin-float"
          style={{
            left: `${coin.x}%`,
            top: `${coin.y}%`,
            fontSize: `${coin.size * 2}rem`,
            animationDuration: `${coin.duration}s`,
            animationDelay: `${coin.delay}s`
          }}
        >
          🪙
        </div>
      ))}
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-pgbet-gold/5 via-transparent to-pgbet-purple/5 pointer-events-none"></div>
    </div>
  );
};