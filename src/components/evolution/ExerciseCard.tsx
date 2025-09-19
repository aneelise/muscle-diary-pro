import React, { useState } from 'react';
import { Edit3, Trash2, Dumbbell } from 'lucide-react';
import { EvolutionExercise } from '@/types/evolution';
import { useEvolution } from '@/contexts/EvolutionContext';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ExerciseCardProps {
  exercise: EvolutionExercise;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise }) => {
  const { updateExercise, deleteExercise } = useEvolution();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Edit states
  const [editName, setEditName] = useState(exercise.name);
  const [editSets, setEditSets] = useState(exercise.sets.toString());
  const [editReps, setEditReps] = useState(exercise.reps.toString());
  const [editNotes, setEditNotes] = useState(exercise.notes || '');

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const sets = parseInt(editSets);
    const reps = parseInt(editReps);

    if (!editName.trim() || sets < 1 || reps < 1) return;

    await updateExercise(exercise.id, {
      name: editName.trim(),
      sets,
      reps,
      notes: editNotes.trim() || undefined,
    });

    setIsEditDialogOpen(false);
  };

  const handleDelete = async () => {
    await deleteExercise(exercise.id);
  };

  return (
    <div className="workout-card p-4 group hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Dumbbell className="h-4 w-4 text-primary" />
            <h4 className="font-medium text-foreground">{exercise.name}</h4>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
            <span>{exercise.sets} séries</span>
            <span>{exercise.reps} repetições</span>
          </div>

          {exercise.notes && (
            <p className="text-xs text-muted-foreground bg-muted/30 p-2 rounded">
              {exercise.notes}
            </p>
          )}
        </div>

        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-accent/10 hover:text-accent h-8 w-8"
              >
                <Edit3 className="h-3 w-3" />
              </Button>
            </DialogTrigger>
            
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Editar Exercício</DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleEdit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="editName">Nome do Exercício</Label>
                  <Input
                    id="editName"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="editSets">Séries</Label>
                    <Input
                      id="editSets"
                      type="number"
                      min="1"
                      value={editSets}
                      onChange={(e) => setEditSets(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="editReps">Repetições</Label>
                    <Input
                      id="editReps"
                      type="number"
                      min="1"
                      value={editReps}
                      onChange={(e) => setEditReps(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="editNotes">Observações</Label>
                  <Textarea
                    id="editNotes"
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    rows={2}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1">
                    Salvar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-destructive/10 hover:text-destructive h-8 w-8"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir Exercício</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir "{exercise.name}"?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};