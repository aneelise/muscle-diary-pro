import React from 'react';
import { TrendingUp, Calendar, Camera, Dumbbell } from 'lucide-react';
import { EvolutionProvider, useEvolution } from '@/contexts/EvolutionContext';
import { DaySection } from '@/components/evolution/DaySection';
import { PhotoGallery } from '@/components/evolution/PhotoGallery';
import { NavBar } from '@/components/layout/NavBar';
import { DayOfWeek } from '@/types/evolution';

const DAYS_OF_WEEK: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const EvolutionContent: React.FC = () => {
  const { exercises, photos, isLoading } = useEvolution();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary-lightest/30 to-primary-cream/40 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Carregando evolução...</p>
        </div>
      </div>
    );
  }

  const totalExercises = exercises.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-lightest/30 to-primary-cream/40">
      <NavBar />
      
      {/* Header */}
      <header className="bg-gradient-to-r from-accent to-accent/80 text-accent-foreground shadow-[var(--shadow-soft)]">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent-foreground/10 rounded-xl">
                <TrendingUp className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Evolução e Progresso
                </h1>
                <p className="text-accent-foreground/80 text-sm">
                  Acompanhe seus treinos semanais e evolução corporal
                </p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Dumbbell className="h-4 w-4" />
                <span>{totalExercises} exercícios</span>
              </div>
              <div className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                <span>{photos.length} fotos</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="workout-header text-center mb-2">
            Seu Treino Semanal
          </h2>
          <p className="text-center text-muted-foreground">
            Organize seus exercícios por dia da semana e acompanhe sua evolução
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="workout-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">7</div>
                <div className="text-xs text-muted-foreground">Dias da Semana</div>
              </div>
            </div>
          </div>
          
          <div className="workout-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <Dumbbell className="h-4 w-4 text-accent" />
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">{totalExercises}</div>
                <div className="text-xs text-muted-foreground">Exercícios Cadastrados</div>
              </div>
            </div>
          </div>
          
          <div className="workout-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <Camera className="h-4 w-4 text-success" />
              </div>
              <div>
                <div className="text-2xl font-bold text-success">{photos.length}</div>
                <div className="text-xs text-muted-foreground">Fotos de Evolução</div>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Training Schedule */}
        <div className="space-y-6 mb-12">
          <h3 className="text-xl font-semibold text-foreground text-center">
            Cronograma Semanal de Treinos
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {DAYS_OF_WEEK.map((day) => (
              <DaySection key={day} dayOfWeek={day} />
            ))}
          </div>
        </div>

        {/* Photo Gallery */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-foreground text-center">
            Galeria de Evolução
          </h3>
          
          <PhotoGallery />
        </div>
      </main>
    </div>
  );
};

const Evolution: React.FC = () => {
  return (
    <EvolutionProvider>
      <EvolutionContent />
    </EvolutionProvider>
  );
};

export default Evolution;