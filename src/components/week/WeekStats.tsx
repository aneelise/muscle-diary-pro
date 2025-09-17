import React from 'react';
import { TrendingUp, Target, Award } from 'lucide-react';
import { useDiet } from '@/contexts/DietContext';

interface WeekStatsProps {
  weekStartDate: string;
}

export const WeekStats: React.FC<WeekStatsProps> = ({ weekStartDate }) => {
  const { getWeeklyAdherence } = useDiet();
  
  const adherence = getWeeklyAdherence(weekStartDate);
  
  const getAdherenceColor = (percentage: number) => {
    if (percentage >= 80) return 'text-success';
    if (percentage >= 60) return 'text-accent';
    return 'text-destructive';
  };

  const getAdherenceMessage = (percentage: number) => {
    if (percentage >= 90) return 'Excelente! 🏆';
    if (percentage >= 80) return 'Muito bom! 🎯';
    if (percentage >= 60) return 'Bom progresso 📈';
    if (percentage >= 40) return 'Continue tentando 💪';
    return 'Vamos melhorar! 🚀';
  };

  if (adherence === 0) return null;

  return (
    <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 rounded-lg border border-primary/20 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/20 rounded-full">
            <Award className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">Adesão da Semana</h4>
            <p className="text-xs text-muted-foreground">Baseado nas metas do diário</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className={`text-2xl font-bold ${getAdherenceColor(adherence)}`}>
            {adherence}%
          </div>
          <div className="text-xs text-muted-foreground">
            {getAdherenceMessage(adherence)}
          </div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mt-3">
        <div className="w-full bg-muted/30 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              adherence >= 80 ? 'bg-success' : 
              adherence >= 60 ? 'bg-accent' : 'bg-destructive'
            }`}
            style={{ width: `${adherence}%` }}
          />
        </div>
      </div>
    </div>
  );
};