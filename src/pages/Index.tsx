import React from 'react';
import { WeekProvider } from '@/contexts/WeekContext';
import { WeekList } from '@/components/week/WeekList';
import { Dumbbell, Calendar, TrendingUp } from 'lucide-react';

const Index = () => {
  return (
    <WeekProvider>
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
                    Workout Tracker Pro
                  </h1>
                  <p className="text-primary-foreground/80 text-sm">
                    Evolução de cargas por semanas - Acompanhe seu progresso
                  </p>
                </div>
              </div>
              
              <div className="hidden md:flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Semanas</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Evolução</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h2 className="workout-header text-center mb-2">
              Suas Semanas de Treino
            </h2>
            <p className="text-center text-muted-foreground">
              Organize por semanas, adicione dias e acompanhe a evolução das suas cargas
            </p>
          </div>

          <WeekList />
        </main>

        {/* Footer */}
        <footer className="bg-primary/5 border-t border-border/50 mt-12">
          <div className="container mx-auto px-4 py-6">
            <div className="text-center text-sm text-muted-foreground">
              <p>© 2024 Workout Tracker Pro - Evolua suas cargas, conquiste seus objetivos</p>
            </div>
          </div>
        </footer>
      </div>
    </WeekProvider>
  );
};

export default Index;
