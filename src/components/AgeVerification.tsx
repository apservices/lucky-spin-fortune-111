/**
 * Age Verification System
 * Ensures only users 18+ can access the game
 */

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertTriangle, Shield, Calendar, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

interface AgeVerificationProps {
  onVerified: () => void;
}

interface VerificationData {
  birthDate: string;
  confirmed: boolean;
  timestamp: number;
  deviceId: string;
}

export const AgeVerification: React.FC<AgeVerificationProps> = ({ onVerified }) => {
  const [birthDate, setBirthDate] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState('');
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    checkExistingVerification();
  }, []);

  const generateDeviceId = (): string => {
    let deviceId = localStorage.getItem('device_id');
    if (!deviceId) {
      deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('device_id', deviceId);
    }
    return deviceId;
  };

  const checkExistingVerification = () => {
    const verification = localStorage.getItem('age_verification');
    if (verification) {
      try {
        const data: VerificationData = JSON.parse(verification);
        const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
        
        // Re-verify every 30 days or if device changed
        if (data.timestamp > thirtyDaysAgo && data.deviceId === generateDeviceId()) {
          if (calculateAge(data.birthDate) >= 18) {
            onVerified();
            return;
          } else {
            setIsBlocked(true);
          }
        }
      } catch (error) {
        console.error('Error parsing verification data:', error);
        localStorage.removeItem('age_verification');
      }
    }
  };

  const calculateAge = (birthDateString: string): number => {
    const birth = new Date(birthDateString);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleVerification = () => {
    setError('');

    if (!birthDate) {
      setError('Por favor, informe sua data de nascimento');
      return;
    }

    if (!confirmed) {
      setError('Você deve confirmar que tem 18 anos ou mais');
      return;
    }

    const age = calculateAge(birthDate);

    if (age < 18) {
      setIsBlocked(true);
      setError('Este aplicativo é destinado apenas para maiores de 18 anos');
      
      // Block the device
      const blockData = {
        birthDate,
        blocked: true,
        timestamp: Date.now(),
        deviceId: generateDeviceId()
      };
      localStorage.setItem('age_verification', JSON.stringify(blockData));
      return;
    }

    // Save verification
    const verificationData: VerificationData = {
      birthDate,
      confirmed: true,
      timestamp: Date.now(),
      deviceId: generateDeviceId()
    };
    
    localStorage.setItem('age_verification', JSON.stringify(verificationData));
    onVerified();
  };

  if (isBlocked) {
    return (
      <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md"
        >
          <Card className="p-8 text-center border-destructive">
            <div className="mb-6">
              <Lock className="w-16 h-16 text-destructive mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-destructive mb-2">
                Acesso Restrito
              </h2>
              <p className="text-muted-foreground">
                Este aplicativo é destinado apenas para maiores de 18 anos.
                Você não pode acessar este conteúdo.
              </p>
            </div>
            
            <div className="p-4 bg-destructive/10 rounded-lg mb-6">
              <p className="text-sm text-destructive font-medium">
                Se você acredita que houve um erro, entre em contato com o suporte.
              </p>
            </div>

            <Button
              onClick={() => window.location.href = 'https://www.google.com'}
              variant="outline"
              className="w-full"
            >
              Sair do Aplicativo
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md"
      >
        <Card className="p-8">
          <div className="text-center mb-6">
            <Shield className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-primary mb-2">
              Verificação de Idade
            </h2>
            <p className="text-muted-foreground">
              Para continuar, precisamos verificar que você tem 18 anos ou mais
            </p>
          </div>

          <div className="space-y-6">
            <div className="p-4 bg-primary/10 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-primary mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-primary mb-1">
                    Este é um jogo recreativo
                  </p>
                  <p className="text-muted-foreground">
                    Moedas virtuais sem valor monetário real. Apenas para entretenimento.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="birthDate" className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Data de Nascimento</span>
                </Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="mt-2"
                />
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="confirm"
                  checked={confirmed}
                  onCheckedChange={(checked) => setConfirmed(checked as boolean)}
                />
                <Label htmlFor="confirm" className="text-sm leading-relaxed">
                  Confirmo que tenho 18 anos ou mais e entendo que este é um jogo 
                  recreativo com moedas virtuais sem valor monetário real
                </Label>
              </div>

              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-sm text-destructive font-medium">{error}</p>
                </div>
              )}

              <Button
                onClick={handleVerification}
                className="w-full"
                size="lg"
              >
                Verificar e Continuar
              </Button>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t text-center">
            <p className="text-xs text-muted-foreground">
              Esta verificação está em conformidade com as leis brasileiras de proteção ao menor
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};