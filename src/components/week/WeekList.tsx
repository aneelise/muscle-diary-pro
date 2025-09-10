import React, { useState } from 'react';
import { Plus, Calendar, TrendingUp, Target } from 'lucide-react';
import { useWeek } from '@/contexts/WeekContext';
import { WeekCard } from './WeekCard';
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

export const WeekList: React.FC = () => {
  const { weeks, addWeek, isLoading } = useWeek();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [weekName, setWeekName] = useState('');
  const [weekDescription, setWeekDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

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

    setIsCreating(true);
    try {
      await addWeek(weekName.trim(), weekDescription.trim() || undefined);
      setWeekName('');
      setWeekDescription('');
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error creating week:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const totalExercises = weeks.reduce((total, week) => 
    total + week.days.reduce((dayTotal, day) => dayTotal + day.exercises.length, 0), 0
  );

  const totalDays = weeks.reduce((total, week) => total + week.days.length, 0);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando semanas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="workout-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Calendar className="h-4 w-4 text-primary" />
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
              <Target className="h-4 w-4 text-accent" />
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">{totalDays}</div>
              <div className="text-xs text-muted-foreground">Dias</div>
            </div>
          </div>
        </div>
        
        <div className="workout-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <TrendingUp className="h-4 w-4 text-success" />
            </div>
            <div>
              <div className="text-2xl font-bold text-success">{totalExercises}</div>
              <div className="text-xs text-muted-foreground">Exercícios</div>
            </div>
          </div>
        </div>
        
        <div className="workout-card p-4">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full h-full bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="h-4 w-4 mr-2" />
                Nova Semana
              </Button>
            </DialogTrigger>
            
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Criar Nova Semana
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleAddWeek} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="weekName">Nome da Semana*</Label>
                  <Input
                    id="weekName"
                    placeholder="Ex: Semana 1, Semana Peito/Costas..."
                    value={weekName}
                    onChange={(e) => setWeekName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="weekDescription">Descrição (opcional)</Label>
                  <Textarea
                    id="weekDescription"
                    placeholder="Ex: Foco em força, Semana de hipertrofia..."
                    value={weekDescription}
                    onChange={(e) => setWeekDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 bg-primary hover:bg-primary/90"
                    disabled={isCreating}
                  >
                    {isCreating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                        Criando...
                      </>
                    ) : (
                      'Criar Semana'
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Weeks List */}
      {weeks.length === 0 ? (
        <div className="text-center py-12 px-4 border-2 border-dashed border-border rounded-2xl bg-background/50">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Nenhuma semana cadastrada
          </h3>
          <p className="text-muted-foreground mb-4">
            Crie sua primeira semana de treinos para começar a acompanhar sua evolução
          </p>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
            <WeekCard key={week.id} week={week} />
          ))}
        </div>
      )}
    </div>
  );
};