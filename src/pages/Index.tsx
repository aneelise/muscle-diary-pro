import React from 'react';
import { WorkoutProvider } from '@/contexts/WorkoutContext';
import { DaySection } from '@/components/DaySection';
import { WorkoutStats } from '@/components/WorkoutStats';
import { Dumbbell, Target, Calendar, TrendingUp } from 'lucide-react';

const weekSchedule = [
  { day: 'monday' as const, label: 'Segunda-feira', muscle: 'Quadríceps' },
  { day: 'tuesday' as const, label: 'Terça-feira', muscle: 'Costas' },
  { day: 'wednesday' as const, label: 'Quarta-feira', muscle: 'Peito' },
  { day: 'thursday' as const, label: 'Quinta-feira', muscle: 'Ombros' },
  { day: 'friday' as const, label: 'Sexta-feira', muscle: 'Bíceps' },
  { day: 'saturday' as const, label: 'Sábado', muscle: 'Tríceps' },
  { day: 'sunday' as const, label: 'Domingo', muscle: 'Posterior' },
];

const Index = () => {
  return (
    <WorkoutProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-primary-lightest/30 to-primary-cream/40">
        {/* Header */}
        <header className="bg-gradient-to-r from-primary to-primary-light text-primary-foreground shadow-[var(--shadow-soft)]">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-foreground/10 rounded-xl">
                  <Dumbbell className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">
                    Workout Tracker
                  </h1>
                  <p className="text-primary-foreground/80 text-sm">
                    Acompanhe seus treinos de forma simples e elegante
                  </p>
                </div>
              </div>
              
              <div className="hidden md:flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>7 Dias</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  <span>7 Grupos</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Progresso</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h2 className="workout-header text-center mb-2">
              Sua Semana de Treinos
            </h2>
            <p className="text-center text-muted-foreground">
              Organize seus exercícios por dia e categoria muscular
            </p>
          </div>

          <WorkoutStats />

          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {weekSchedule.map((schedule) => (
              <DaySection
                key={schedule.day}
                day={schedule.day}
                dayLabel={schedule.label}
                muscleCategory={schedule.muscle}
              />
            ))}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-primary/5 border-t border-border/50 mt-12">
          <div className="container mx-auto px-4 py-6">
            <div className="text-center text-sm text-muted-foreground">
              <p>© 2024 Workout Tracker - Construa seu físico, um treino por vez</p>
            </div>
          </div>
        </footer>
      </div>
    </WorkoutProvider>
  );
};

export default Index;
