import React, { useState } from 'react';
import { Plus, Calendar } from 'lucide-react';
import { DayOfWeek, DAY_LABELS, EvolutionExercise } from '@/types/evolution';
import { useEvolution } from '@/contexts/EvolutionContext';
import { ExerciseCard } from './ExerciseCard';
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

interface DaySectionProps {
  dayOfWeek: DayOfWeek;
  weekId: string;
  exercises: EvolutionExercise[];
}

export const DaySection: React.FC<DaySectionProps> = ({ dayOfWeek, weekId, exercises }) => {
  const { addExercise } = useEvolution();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Form states
  const [exerciseName, setExerciseName] = useState('');
  const [notes, setNotes] = useState('');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!exerciseName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, insira um nome para o exercício.",
        variant: "destructive",
      });
      return;
    }

    await addExercise(
      weekId,
      dayOfWeek,
      exerciseName.trim(),
      notes.trim() || undefined
    );
    
    // Reset form
    setExerciseName('');
    setNotes('');
    setIsAddDialogOpen(false);
  };

  return (
    <div className="workout-card p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Calendar className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">{DAY_LABELS[dayOfWeek]}</h4>
            <p className="text-xs text-muted-foreground">
              {exercises.length} exercício{exercises.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              <Plus className="h-3 w-3 mr-1" />
              Adicionar
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar Exercício - {DAY_LABELS[dayOfWeek]}</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="exerciseName">Nome do Exercício</Label>
                <Input
                  id="exerciseName"
                  value={exerciseName}
                  onChange={(e) => setExerciseName(e.target.value)}
                  placeholder="Ex: Supino reto, Agachamento..."
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Observações (opcional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Aumentar carga na próxima semana..."
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
                  <Plus className="h-3 w-3 mr-2" />
                  Adicionar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {exercises.length === 0 ? (
          <div className="text-center py-6 px-4 border border-dashed border-border rounded-lg bg-background/50">
            <Calendar className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">
              Nenhum exercício para {DAY_LABELS[dayOfWeek].toLowerCase()}
            </p>
          </div>
        ) : (
          exercises.map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))
        )}
      </div>
    </div>
  );
};