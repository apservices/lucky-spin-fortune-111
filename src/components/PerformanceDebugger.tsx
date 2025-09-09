import React, { useState } from 'react';
import { PerformanceMonitor } from '@/utils/performance/PerformanceMonitor';
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';

export const PerformanceDebugger: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { metrics, optimizeNow } = usePerformanceOptimization();

  // Only show in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <PerformanceMonitor
      isVisible={isVisible}
      onToggle={() => setIsVisible(!isVisible)}
    />
  );
};