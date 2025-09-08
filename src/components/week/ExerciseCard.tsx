import React, { useState } from 'react';
import { Weight, Hash, Edit3, Trash2, Target } from 'lucide-react';
import { Exercise } from '@/types/week';
import { useWeek } from '@/contexts/WeekContext';
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
import { useToast } from '@/hooks/use-toast';

interface ExerciseCardProps {
  exercise: Exercise;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise }) => {
  const { updateExercise, deleteExercise } = useWeek();
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Edit states
  const [editSets, setEditSets] = useState(exercise.sets.toString());
  const [editReps, setEditReps] = useState(exercise.reps.toString());
  const [editWeight, setEditWeight] = useState(exercise.weight.toString());
  const [editNotes, setEditNotes] = useState(exercise.notes || '');

  const handleEditExercise = (e: React.FormEvent) => {
    e.preventDefault();
    
    const sets = parseInt(editSets);
    const reps = parseInt(editReps);
    const weight = parseFloat(editWeight);

    if (sets < 1 || reps < 1 || weight < 0) {
      toast({
        title: "Valores inválidos",
        description: "Por favor, insira valores válidos para séries, repetições e carga.",
        variant: "destructive",
      });
      return;
    }

    updateExercise(exercise.id, {
      sets,
      reps,
      weight,
      notes: editNotes.trim() || undefined,
    });

    toast({
      title: "Exercício atualizado!",
      description: "As alterações foram salvas com sucesso.",
    });

    setIsEditDialogOpen(false);
  };

  const handleDeleteExercise = () => {
    deleteExercise(exercise.id);
    toast({
      title: "Exercício excluído",
      description: `${exercise.exerciseName} foi removido com sucesso.`,
    });
  };

  return (
    <div className="workout-card bg-gradient-to-r from-background to-card-accent p-3 group">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h5 className="font-medium text-sm text-foreground">
              {exercise.exerciseName}
            </h5>
            <div className="muscle-category text-xs">
              <Target className="h-2 w-2 mr-1" />
              {exercise.muscleGroup}
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="text-center">
              <div className="flex items-center justify-center text-muted-foreground mb-1">
                <Hash className="h-2 w-2 mr-1" />
                <span>Séries</span>
              </div>
              <div className="text-sm font-bold text-primary">
                {exercise.sets}
              </div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center text-muted-foreground mb-1">
                <Target className="h-2 w-2 mr-1" />
                <span>Reps</span>
              </div>
              <div className="text-sm font-bold text-primary">
                {exercise.reps}
              </div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center text-muted-foreground mb-1">
                <Weight className="h-2 w-2 mr-1" />
                <span>Carga</span>
              </div>
              <div className="text-sm font-bold text-accent">
                {exercise.weight}kg
              </div>
            </div>
          </div>

          {exercise.notes && (
            <div className="mt-2 text-xs text-muted-foreground bg-muted/30 p-2 rounded">
              {exercise.notes}
            </div>
          )}
        </div>

        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-accent/10 hover:text-accent h-7 w-7"
              >
                <Edit3 className="h-3 w-3" />
              </Button>
            </DialogTrigger>
            
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Weight className="h-4 w-4 text-primary" />
                  Editar - {exercise.exerciseName}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleEditExercise} className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="editSets">Séries</Label>
                    <Input
                      id="editSets"
                      type="number"
                      min="1"
                      max="20"
                      value={editSets}
                      onChange={(e) => setEditSets(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="editReps">Reps</Label>
                    <Input
                      id="editReps"
                      type="number"
                      min="1"
                      max="100"
                      value={editReps}
                      onChange={(e) => setEditReps(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="editWeight">Carga (kg)</Label>
                    <Input
                      id="editWeight"
                      type="number"
                      min="0"
                      step="0.5"
                      value={editWeight}
                      onChange={(e) => setEditWeight(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="editNotes">Observações</Label>
                  <Textarea
                    id="editNotes"
                    placeholder="Ex: Carga muito pesada, próxima vez tentar 15kg..."
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
                    Salvar Alterações
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
                className="hover:bg-destructive/10 hover:text-destructive h-7 w-7"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir Exercício</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir "{exercise.exerciseName}"? 
                  Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteExercise}
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