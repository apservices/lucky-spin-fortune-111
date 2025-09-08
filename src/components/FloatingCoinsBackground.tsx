import React from 'react';
import { ParallaxCoinsBackground } from './ParallaxCoinsBackground';

export const FloatingCoinsBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Advanced 3D parallax background */}
      <ParallaxCoinsBackground 
        enabled={true}
        width={window.innerWidth}
        height={window.innerHeight}
      />
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-pgbet-gold/5 via-transparent to-pgbet-purple/5 pointer-events-none"></div>
    </div>
  );
};