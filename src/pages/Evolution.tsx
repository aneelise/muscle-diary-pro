import React, { useState } from 'react';
import { TrendingUp, Calendar, Camera, Dumbbell, Plus } from 'lucide-react';
import { EvolutionProvider, useEvolution } from '@/contexts/EvolutionContext';
import { WeekSection } from '@/components/evolution/WeekSection';
import { PhotoGallery } from '@/components/evolution/PhotoGallery';
import { NavBar } from '@/components/layout/NavBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const EvolutionContent: React.FC = () => {
  const { weeks, exercises, photos, addWeek, isLoading } = useEvolution();
  const { toast } = useToast();
  const [isAddWeekDialogOpen, setIsAddWeekDialogOpen] = useState(false);
  const [weekName, setWeekName] = useState('');
  const [weekDescription, setWeekDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAddWeek = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!weekName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, insira um nome para a semana.",
        variant: "destructive",
      });
      return;
    }

    await addWeek(weekName.trim(), weekDescription.trim() || undefined);
    setWeekName('');
    setWeekDescription('');
    setIsAddWeekDialogOpen(false);
  };

  // Error boundary for evolution page
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary-lightest/30 to-primary-cream/40 flex items-center justify-center">
        <div className="text-center space-y-4 p-8">
          <div className="text-destructive text-lg font-semibold">Erro ao carregar evolução</div>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

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
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{weeks.length}</div>
                <div className="text-xs text-muted-foreground">Semanas</div>
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
          
          <div className="workout-card p-4">
            <Dialog open={isAddWeekDialogOpen} onOpenChange={setIsAddWeekDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full h-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Semana
                </Button>
              </DialogTrigger>
              
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Adicionar Semana de Evolução</DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleAddWeek} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="weekName">Nome da Semana</Label>
                    <Input
                      id="weekName"
                      value={weekName}
                      onChange={(e) => setWeekName(e.target.value)}
                      placeholder="Ex: Semana 1, Semana de Força..."
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="weekDescription">Descrição (opcional)</Label>
                    <Textarea
                      id="weekDescription"
                      value={weekDescription}
                      onChange={(e) => setWeekDescription(e.target.value)}
                      placeholder="Ex: Foco em hipertrofia, aumento de cargas..."
                      rows={2}
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddWeekDialogOpen(false)}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" className="flex-1">
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Evolution Weeks */}
        <div className="space-y-6 mb-12">
          {weeks.length === 0 ? (
            <div className="text-center py-12 px-4 border-2 border-dashed border-border rounded-2xl bg-background/50">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Nenhuma semana cadastrada
              </h3>
              <p className="text-muted-foreground mb-4">
                Crie sua primeira semana para começar a acompanhar sua evolução
              </p>
              <Dialog open={isAddWeekDialogOpen} onOpenChange={setIsAddWeekDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeira Semana
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>
          ) : (
            <div className="space-y-6">
              {weeks.map((week) => (
                <WeekSection key={week.id} week={week} />
              ))}
            </div>
          )}
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