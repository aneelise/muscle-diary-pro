import React, { useState } from 'react';
import { CreditCard as Edit3, Trash2, Dumbbell, Plus, Hash } from 'lucide-react';
import { EvolutionExercise, EvolutionExerciseSet } from '@/types/evolution';
import { useEvolution } from '@/contexts/EvolutionContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
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
  const { updateExercise, deleteExercise, addExerciseSet, updateExerciseSet, deleteExerciseSet } = useEvolution();
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddSetDialogOpen, setIsAddSetDialogOpen] = useState(false);

  // Edit states
  const [editName, setEditName] = useState(exercise.name);
  const [editNotes, setEditNotes] = useState(exercise.notes || '');

  // Add set states
  const [newReps, setNewReps] = useState('');

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editName.trim()) return;

    await updateExercise(exercise.id, {
      name: editName.trim(),
      notes: editNotes.trim() || undefined,
    });

    setIsEditDialogOpen(false);
  };

  const handleAddSet = async (e: React.FormEvent) => {
    e.preventDefault();

    const reps = parseInt(newReps);

    if (reps < 1) {
      toast({
        title: "Valor inválido",
        description: "Por favor, insira um valor válido para repetições.",
        variant: "destructive",
      });
      return;
    }

    const setNumber = exercise.sets.length + 1;
    await addExerciseSet(exercise.id, setNumber, reps);

    setNewReps('');
    setIsAddSetDialogOpen(false);
  };

  const handleDeleteSet = async (setId: string) => {
    await deleteExerciseSet(setId);
  };

  const handleDelete = async () => {
    await deleteExercise(exercise.id);
  };

  return (
    <div className="workout-card group hover:shadow-md transition-all">
      <div className="p-4 border-b border-border/30">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Dumbbell className="h-4 w-4 text-primary" />
              <h4 className="font-medium text-foreground">{exercise.name}</h4>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{exercise.sets.length} série{exercise.sets.length !== 1 ? 's' : ''}</span>
            </div>
          </div>

          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Dialog open={isAddSetDialogOpen} onOpenChange={setIsAddSetDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-success/10 hover:text-success h-8 w-8"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </DialogTrigger>
              
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Adicionar Série - {exercise.name}</DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleAddSet} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newReps">Repetições</Label>
                    <Input
                      id="newReps"
                      type="number"
                      min="1"
                      value={newReps}
                      onChange={(e) => setNewReps(e.target.value)}
                      placeholder="Ex: 12"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Cadastre apenas séries e repetições. O peso será registrado na aba "Semanas".
                    </p>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddSetDialogOpen(false)}
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
      
      {/* Sets List */}
      <div className="p-4 space-y-3">
        {exercise.notes && (
          <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded mb-3">
            {exercise.notes}
          </div>
        )}
        
        {exercise.sets.length === 0 ? (
          <div className="text-center py-4 px-4 border border-dashed border-border rounded-lg bg-background/50">
            <p className="text-sm text-muted-foreground">
              Nenhuma série cadastrada
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <h5 className="text-sm font-medium text-foreground">Séries:</h5>
            {exercise.sets.map((set, index) => (
              <div key={set.id} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-foreground">
                    {index + 1}ª série
                  </span>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Hash className="h-3 w-3" />
                      <span>{set.reps} reps</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-destructive/10 hover:text-destructive h-6 w-6"
                  onClick={() => handleDeleteSet(set.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};