import React, { useState } from 'react';
import { Plus, Calendar } from 'lucide-react';
import { DayOfWeek, DAY_LABELS } from '@/types/evolution';
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

interface DaySectionProps {
  dayOfWeek: DayOfWeek;
}

export const DaySection: React.FC<DaySectionProps> = ({ dayOfWeek }) => {
  const { getExercisesByDay, addExercise } = useEvolution();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Form states
  const [exerciseName, setExerciseName] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [notes, setNotes] = useState('');

  const exercises = getExercisesByDay(dayOfWeek);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!exerciseName.trim() || !sets || !reps) return;

    await addExercise(
      dayOfWeek,
      exerciseName.trim(),
      parseInt(sets),
      parseInt(reps),
      notes.trim() || undefined
    );
    
    // Reset form
    setExerciseName('');
    setSets('');
    setReps('');
    setNotes('');
    setIsAddDialogOpen(false);
  };

  return (
    <div className="workout-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{DAY_LABELS[dayOfWeek]}</h3>
            <p className="text-sm text-muted-foreground">
              {exercises.length} exercício{exercises.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
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
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="sets">Séries</Label>
                  <Input
                    id="sets"
                    type="number"
                    min="1"
                    value={sets}
                    onChange={(e) => setSets(e.target.value)}
                    placeholder="Ex: 3"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reps">Repetições</Label>
                  <Input
                    id="reps"
                    type="number"
                    min="1"
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                    placeholder="Ex: 12"
                    required
                  />
                </div>
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
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {exercises.length === 0 ? (
          <div className="text-center py-8 px-4 border border-dashed border-border rounded-lg bg-background/50">
            <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Nenhum exercício cadastrado para {DAY_LABELS[dayOfWeek].toLowerCase()}
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