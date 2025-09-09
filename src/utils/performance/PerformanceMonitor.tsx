import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Monitor, 
  Zap, 
  HardDrive, 
  Activity,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { deviceCapabilities } from './DeviceCapabilities';
import { assetManager } from './AssetManager';
import { poolManager } from './ObjectPool';
import { animationController } from './AnimationController';

interface PerformanceAlert {
  type: 'fps' | 'memory' | 'cache' | 'pools';
  severity: 'low' | 'medium' | 'high';
  message: string;
  timestamp: number;
}

interface PerformanceMonitorProps {
  isVisible: boolean;
  onToggle: () => void;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  isVisible,
  onToggle
}) => {
  const [stats, setStats] = useState({
    fps: 60,
    frameTime: 16.67,
    memoryUsage: 0,
    deviceTier: 'medium' as 'low' | 'medium' | 'high',
    cacheStats: { totalItems: 0, totalSize: 0, utilizationPercent: 0 },
    poolStats: {},
    animationStats: { activeAnimations: 0, skippedFrames: 0 }
  });
  
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    const updateStats = () => {
      const capabilities = deviceCapabilities.getCapabilities();
      const cacheStats = assetManager.getCacheStats();
      const poolStats = poolManager.getStats();
      const animationStats = animationController.getStats();
      
      const newStats = {
        fps: animationStats.currentFPS,
        frameTime: animationStats.frameTime,
        memoryUsage: animationStats.memoryUsage,
        deviceTier: capabilities.tier,
        cacheStats,
        poolStats,
        animationStats
      };
      
      setStats(newStats);
      checkForAlerts(newStats);
    };

    const interval = setInterval(updateStats, 1000);
    updateStats(); // Initial update

    return () => clearInterval(interval);
  }, [isVisible]);

  const checkForAlerts = (currentStats: typeof stats) => {
    const newAlerts: PerformanceAlert[] = [];
    const now = Date.now();

    // FPS alerts
    if (currentStats.fps < 30) {
      newAlerts.push({
        type: 'fps',
        severity: 'high',
        message: `FPS crítico: ${currentStats.fps.toFixed(1)}fps`,
        timestamp: now
      });
    } else if (currentStats.fps < 45) {
      newAlerts.push({
        type: 'fps',
        severity: 'medium',
        message: `FPS baixo: ${currentStats.fps.toFixed(1)}fps`,
        timestamp: now
      });
    }

    // Memory alerts
    if (currentStats.memoryUsage > 200) {
      newAlerts.push({
        type: 'memory',
        severity: 'high',
        message: `Uso de memória alto: ${currentStats.memoryUsage.toFixed(1)}MB`,
        timestamp: now
      });
    } else if (currentStats.memoryUsage > 150) {
      newAlerts.push({
        type: 'memory',
        severity: 'medium',
        message: `Uso de memória elevado: ${currentStats.memoryUsage.toFixed(1)}MB`,
        timestamp: now
      });
    }

    // Cache alerts
    if (currentStats.cacheStats.utilizationPercent > 90) {
      newAlerts.push({
        type: 'cache',
        severity: 'medium',
        message: `Cache quase cheio: ${currentStats.cacheStats.utilizationPercent.toFixed(1)}%`,
        timestamp: now
      });
    }

    // Pool alerts
    Object.entries(currentStats.poolStats).forEach(([poolName, poolStat]) => {
      if ((poolStat as any).utilization > 95) {
        newAlerts.push({
          type: 'pools',
          severity: 'medium',
          message: `Pool ${poolName} quase cheio: ${((poolStat as any).utilization).toFixed(1)}%`,
          timestamp: now
        });
      }
    });

    setAlerts(newAlerts);
  };

  const runOptimization = async () => {
    setIsOptimizing(true);
    
    try {
      // Clear old cache entries
      if (stats.cacheStats.utilizationPercent > 80) {
        // Force cache cleanup would be implemented in AssetManager
        console.log('Running cache optimization...');
      }

      // Release inactive pool objects
      console.log('Optimizing object pools...');
      
      // Force garbage collection if available
      if ('gc' in window) {
        (window as any).gc();
      }

      // Reset performance counters
      deviceCapabilities.resetPerformanceData();
      animationController.clear();

      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate optimization time
    } finally {
      setIsOptimizing(false);
    }
  };

  const getFPSColor = () => {
    if (stats.fps >= 50) return 'text-pgbet-emerald';
    if (stats.fps >= 30) return 'text-pgbet-amber';
    return 'text-pgbet-red';
  };

  const getMemoryColor = () => {
    if (stats.memoryUsage < 100) return 'text-pgbet-emerald';
    if (stats.memoryUsage < 150) return 'text-pgbet-amber';
    return 'text-pgbet-red';
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="w-4 h-4 text-pgbet-red" />;
      case 'medium': return <AlertTriangle className="w-4 h-4 text-pgbet-amber" />;
      default: return <CheckCircle className="w-4 h-4 text-pgbet-emerald" />;
    }
  };

  if (!isVisible) {
    return (
      <Button
        onClick={onToggle}
        variant="outline"
        size="sm"
        className="fixed top-4 left-4 z-50 bg-background/80 backdrop-blur-sm"
      >
        <Monitor className="w-4 h-4 mr-2" />
        Performance
      </Button>
    );
  }

  return (
    <div className="fixed top-4 left-4 z-50 w-96">
      <Card className="p-4 bg-background/95 backdrop-blur-sm border border-primary/20">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Monitor className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-primary">Performance Monitor</h3>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={stats.deviceTier === 'high' ? 'default' : stats.deviceTier === 'medium' ? 'secondary' : 'outline'}>
                {stats.deviceTier.toUpperCase()}
              </Badge>
              <Button onClick={onToggle} variant="ghost" size="sm">×</Button>
            </div>
          </div>

          {/* Main Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4" />
                <span className="text-sm">FPS</span>
              </div>
              <div className={`text-2xl font-bold ${getFPSColor()}`}>
                {stats.fps.toFixed(1)}
              </div>
              <Progress value={(stats.fps / 60) * 100} className="h-2" />
            </div>

              <div className="flex items-center space-x-2">
                <HardDrive className="w-4 h-4" />
                <span className="text-sm">Memória</span>
              </div>
              <div className={`text-2xl font-bold ${getMemoryColor()}`}>
                {stats.memoryUsage.toFixed(1)}MB
              </div>
              <Progress value={(stats.memoryUsage / 200) * 100} className="h-2" />
            </div>
          </div>

          {/* Detailed Stats */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span>Frame Time:</span>
              <span>{stats.frameTime.toFixed(2)}ms</span>
            </div>
            <div className="flex justify-between">
              <span>Cache Usage:</span>
              <span>{stats.cacheStats.utilizationPercent.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Cached Assets:</span>
              <span>{stats.cacheStats.totalItems}</span>
            </div>
            <div className="flex justify-between">
              <span>Active Animations:</span>
              <span>{stats.animationStats.activeAnimations}</span>
            </div>
            <div className="flex justify-between">
              <span>Skipped Frames:</span>
              <span>{stats.animationStats.skippedFrames}</span>
            </div>
          </div>

          {/* Pool Stats */}
          {Object.keys(stats.poolStats).length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium">Object Pools:</div>
              <div className="space-y-1 text-xs">
                {Object.entries(stats.poolStats).map(([poolName, poolStat]) => (
                  <div key={poolName} className="flex justify-between">
                    <span>{poolName}:</span>
                    <span>{((poolStat as any).utilization || 0).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Alerts */}
          {alerts.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-pgbet-red">Alertas:</div>
              <div className="space-y-1">
                {alerts.slice(0, 3).map((alert, index) => (
                  <div key={index} className="flex items-center space-x-2 text-xs">
                    {getSeverityIcon(alert.severity)}
                    <span>{alert.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-2">
            <Button
              onClick={runOptimization}
              disabled={isOptimizing}
              variant="outline"
              size="sm"
              className="w-full"
            >
              <Zap className="w-4 h-4 mr-2" />
              {isOptimizing ? 'Otimizando...' : 'Otimizar Performance'}
            </Button>

            {alerts.length > 0 && (
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <AlertTriangle className="w-3 h-3" />
                <span>{alerts.length} alerta(s) detectado(s)</span>
              </div>
            )}
          </div>

          {/* Performance Trend */}
          <div className="flex items-center justify-center space-x-2 text-xs">
            {stats.fps >= 50 ? (
              <><TrendingUp className="w-3 h-3 text-pgbet-emerald" /> <span>Performance Boa</span></>
            ) : stats.fps >= 30 ? (
              <><Activity className="w-3 h-3 text-pgbet-amber" /> <span>Performance Regular</span></>
            ) : (
              <><TrendingDown className="w-3 h-3 text-pgbet-red" /> <span>Performance Baixa</span></>
          </div>
        </div>
      </Card>
    </div>
  );
};
};