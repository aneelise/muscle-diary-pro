import React, { useState } from 'react';
import { Plus, BookOpen, Calendar, Utensils, TrendingUp } from 'lucide-react';
import { useDiet } from '@/contexts/DietContext';
import { DiaryEntryCard } from '@/components/diet/DiaryEntryCard';
import { NavBar } from '@/components/layout/NavBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const Diary = () => {
  const { diaryEntries, addDiaryEntry, getFreeMealHistory, isLoading } = useDiet();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Form states
  const getLocalDate = () => {
    const now = new Date();
    const tz = now.getTimezoneOffset() * 60000;
    return new Date(Date.now() - tz).toISOString().slice(0, 10);
  };
  
  const [date, setDate] = useState(getLocalDate());
  const [diaryText, setDiaryText] = useState('');
  const [freeMeal, setFreeMeal] = useState(false);
  const [freeMealDescription, setFreeMealDescription] = useState('');
  const [waterGoal, setWaterGoal] = useState(false);
  const [workoutDone, setWorkoutDone] = useState(false);
  const [cardioDone, setCardioDone] = useState(false);
  const [dietFollowed, setDietFollowed] = useState(false);
  const [notes, setNotes] = useState('');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if entry already exists for this date
    const existingEntry = diaryEntries.find(entry => entry.date === date);
    if (existingEntry) {
      toast({
        title: "Entrada já existe",
        description: "Já existe uma entrada para esta data. Edite a entrada existente.",
        variant: "destructive",
      });
      return;
    }

    await addDiaryEntry(date, {
      diary_text: diaryText.trim() || undefined,
      free_meal: freeMeal,
      free_meal_description: freeMeal ? freeMealDescription.trim() || undefined : undefined,
      water_goal: waterGoal,
      workout_done: workoutDone,
      cardio_done: cardioDone,
      diet_followed: dietFollowed,
      notes: notes.trim() || undefined,
    });
    
    // Reset form
    setDate(getLocalDate());
    setDiaryText('');
    setFreeMeal(false);
    setFreeMealDescription('');
    setWaterGoal(false);
    setWorkoutDone(false);
    setCardioDone(false);
    setDietFollowed(false);
    setNotes('');
    setIsAddDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary-lightest/30 to-primary-cream/40 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Carregando diário...</p>
        </div>
      </div>
    );
  }

  const freeMealHistory = getFreeMealHistory();
  const totalEntries = diaryEntries.length;
  const completedGoalsTotal = diaryEntries.reduce((total, entry) => {
    return total + 
      (entry.water_goal ? 1 : 0) +
      (entry.workout_done ? 1 : 0) +
      (entry.cardio_done ? 1 : 0) +
      (entry.diet_followed ? 1 : 0);
  }, 0);
  const totalPossibleGoals = totalEntries * 4;
  const overallAdherence = totalPossibleGoals > 0 ? Math.round((completedGoalsTotal / totalPossibleGoals) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-lightest/30 to-primary-cream/40">
      <NavBar />
      
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-primary-light text-primary-foreground shadow-[var(--shadow-soft)]">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-foreground/10 rounded-xl">
                <BookOpen className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Diário da Dieta
                </h1>
                <p className="text-primary-foreground/80 text-sm">
                  Acompanhe seu progresso diário e metas
                </p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{totalEntries} dias</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span>{overallAdherence}% adesão</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="workout-header text-center mb-2">
            Seu Diário Alimentar
          </h2>
          <p className="text-center text-muted-foreground">
            Registre seu dia a dia, metas e evolução
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="workout-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{totalEntries}</div>
                <div className="text-xs text-muted-foreground">Dias Registrados</div>
              </div>
            </div>
          </div>
          
          <div className="workout-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <Utensils className="h-4 w-4 text-accent" />
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">{freeMealHistory.length}</div>
                <div className="text-xs text-muted-foreground">Refeições Livres</div>
              </div>
            </div>
          </div>
          
          <div className="workout-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <TrendingUp className="h-4 w-4 text-success" />
              </div>
              <div>
                <div className="text-2xl font-bold text-success">{overallAdherence}%</div>
                <div className="text-xs text-muted-foreground">Adesão Geral</div>
              </div>
            </div>
          </div>
          
          <div className="workout-card p-4">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full h-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Dia
                </Button>
              </DialogTrigger>
              
              <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Adicionar Dia ao Diário
                  </DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleAdd} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Data</Label>
                    <Input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="diaryText">Diário do Dia</Label>
                    <Textarea
                      id="diaryText"
                      value={diaryText}
                      onChange={(e) => setDiaryText(e.target.value)}
                      placeholder="Como foi seu dia? O que você comeu? Como se sentiu?"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="freeMeal"
                        checked={freeMeal}
                        onCheckedChange={(checked) => setFreeMeal(checked as boolean)}
                      />
                      <Label htmlFor="freeMeal">Tive refeição livre</Label>
                    </div>
                    
                    {freeMeal && (
                      <div className="ml-6 space-y-2">
                        <Label htmlFor="freeMealDescription">Descreva a refeição livre</Label>
                        <Input
                          id="freeMealDescription"
                          value={freeMealDescription}
                          onChange={(e) => setFreeMealDescription(e.target.value)}
                          placeholder="Ex: Pizza, hambúrguer, sorvete..."
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Metas do Dia</Label>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="waterGoal"
                          checked={waterGoal}
                          onCheckedChange={(checked) => setWaterGoal(checked as boolean)}
                        />
                        <Label htmlFor="waterGoal" className="text-sm">💧 Água (4L)</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="workoutDone"
                          checked={workoutDone}
                          onCheckedChange={(checked) => setWorkoutDone(checked as boolean)}
                        />
                        <Label htmlFor="workoutDone" className="text-sm">🏋️ Treino</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="cardioDone"
                          checked={cardioDone}
                          onCheckedChange={(checked) => setCardioDone(checked as boolean)}
                        />
                        <Label htmlFor="cardioDone" className="text-sm">🏃 Cardio</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="dietFollowed"
                          checked={dietFollowed}
                          onCheckedChange={(checked) => setDietFollowed(checked as boolean)}
                        />
                        <Label htmlFor="dietFollowed" className="text-sm">🍎 Dieta</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notas e Observações</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Erros, acertos, como se sentiu, dificuldades..."
                      rows={2}
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddDialogOpen(false)}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" className="flex-1">
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Dia
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Diary Entries */}
        {diaryEntries.length === 0 ? (
          <div className="text-center py-12 px-4 border-2 border-dashed border-border rounded-2xl bg-background/50">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Nenhuma entrada no diário
            </h3>
            <p className="text-muted-foreground mb-4">
              Comece registrando seu primeiro dia para acompanhar sua evolução
            </p>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Primeiro Dia
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        ) : (
          <div className="space-y-6">
            {diaryEntries.map((entry) => (
              <DiaryEntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Diary;