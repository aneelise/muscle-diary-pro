import React, { useState } from 'react';
import { Calendar, Edit3, Trash2, CheckCircle, XCircle, Utensils } from 'lucide-react';
import { DiaryEntry } from '@/types/diet';
import { useDiet } from '@/contexts/DietContext';
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

interface DiaryEntryCardProps {
  entry: DiaryEntry;
}

export const DiaryEntryCard: React.FC<DiaryEntryCardProps> = ({ entry }) => {
  const { updateDiaryEntry, deleteDiaryEntry } = useDiet();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Edit states
  const [editDiaryText, setEditDiaryText] = useState(entry.diary_text || '');
  const [editFreeMeal, setEditFreeMeal] = useState(entry.free_meal);
  const [editFreeMealDescription, setEditFreeMealDescription] = useState(entry.free_meal_description || '');
  const [editWaterGoal, setEditWaterGoal] = useState(entry.water_goal);
  const [editWorkoutDone, setEditWorkoutDone] = useState(entry.workout_done);
  const [editCardioDone, setEditCardioDone] = useState(entry.cardio_done);
  const [editDietFollowed, setEditDietFollowed] = useState(entry.diet_followed);
  const [editNotes, setEditNotes] = useState(entry.notes || '');

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await updateDiaryEntry(entry.id, {
      diary_text: editDiaryText.trim() || undefined,
      free_meal: editFreeMeal,
      free_meal_description: editFreeMeal ? editFreeMealDescription.trim() || undefined : undefined,
      water_goal: editWaterGoal,
      workout_done: editWorkoutDone,
      cardio_done: editCardioDone,
      diet_followed: editDietFollowed,
      notes: editNotes.trim() || undefined,
    });

    setIsEditDialogOpen(false);
  };

  const handleDelete = async () => {
    await deleteDiaryEntry(entry.id);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(`${dateString}T12:00:00`);
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const completedGoals = [
    entry.water_goal,
    entry.workout_done,
    entry.cardio_done,
    entry.diet_followed
  ].filter(Boolean).length;

  const goalPercentage = (completedGoals / 4) * 100;

  return (
    <div className={`workout-card p-6 ${entry.free_meal ? 'border-l-4 border-l-accent' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground capitalize">
              {formatDate(entry.date)}
            </h3>
            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">
                {completedGoals}/4 metas concluídas ({Math.round(goalPercentage)}%)
              </div>
              {entry.free_meal && (
                <div className="flex items-center gap-1 text-xs text-accent font-medium">
                  <Utensils className="h-3 w-3" />
                  Refeição livre
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-accent/10 hover:text-accent"
              >
                <Edit3 className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Editar Diário - {formatDate(entry.date)}</DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleEdit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="editDiaryText">Diário do Dia</Label>
                  <Textarea
                    id="editDiaryText"
                    value={editDiaryText}
                    onChange={(e) => setEditDiaryText(e.target.value)}
                    placeholder="Como foi seu dia? O que você comeu? Como se sentiu?"
                    rows={3}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="editFreeMeal"
                      checked={editFreeMeal}
                      onCheckedChange={(checked) => setEditFreeMeal(checked as boolean)}
                    />
                    <Label htmlFor="editFreeMeal">Tive refeição livre</Label>
                  </div>
                  
                  {editFreeMeal && (
                    <div className="ml-6 space-y-2">
                      <Label htmlFor="editFreeMealDescription">Descreva a refeição livre</Label>
                      <Input
                        id="editFreeMealDescription"
                        value={editFreeMealDescription}
                        onChange={(e) => setEditFreeMealDescription(e.target.value)}
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
                        id="editWaterGoal"
                        checked={editWaterGoal}
                        onCheckedChange={(checked) => setEditWaterGoal(checked as boolean)}
                      />
                      <Label htmlFor="editWaterGoal" className="text-sm">💧 Água (4L)</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="editWorkoutDone"
                        checked={editWorkoutDone}
                        onCheckedChange={(checked) => setEditWorkoutDone(checked as boolean)}
                      />
                      <Label htmlFor="editWorkoutDone" className="text-sm">🏋️ Treino</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="editCardioDone"
                        checked={editCardioDone}
                        onCheckedChange={(checked) => setEditCardioDone(checked as boolean)}
                      />
                      <Label htmlFor="editCardioDone" className="text-sm">🏃 Cardio</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="editDietFollowed"
                        checked={editDietFollowed}
                        onCheckedChange={(checked) => setEditDietFollowed(checked as boolean)}
                      />
                      <Label htmlFor="editDietFollowed" className="text-sm">🍎 Dieta</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="editNotes">Notas e Observações</Label>
                  <Textarea
                    id="editNotes"
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Erros, acertos, como se sentiu, dificuldades..."
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
                className="hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir Entrada do Diário</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir a entrada do dia {formatDate(entry.date)}?
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

      {/* Goals Progress */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className={`text-center p-2 rounded-lg ${entry.water_goal ? 'bg-success/10 text-success' : 'bg-muted/50 text-muted-foreground'}`}>
          <div className="text-lg">{entry.water_goal ? <CheckCircle className="h-5 w-5 mx-auto" /> : <XCircle className="h-5 w-5 mx-auto" />}</div>
          <div className="text-xs">💧 Água</div>
        </div>
        
        <div className={`text-center p-2 rounded-lg ${entry.workout_done ? 'bg-success/10 text-success' : 'bg-muted/50 text-muted-foreground'}`}>
          <div className="text-lg">{entry.workout_done ? <CheckCircle className="h-5 w-5 mx-auto" /> : <XCircle className="h-5 w-5 mx-auto" />}</div>
          <div className="text-xs">🏋️ Treino</div>
        </div>
        
        <div className={`text-center p-2 rounded-lg ${entry.cardio_done ? 'bg-success/10 text-success' : 'bg-muted/50 text-muted-foreground'}`}>
          <div className="text-lg">{entry.cardio_done ? <CheckCircle className="h-5 w-5 mx-auto" /> : <XCircle className="h-5 w-5 mx-auto" />}</div>
          <div className="text-xs">🏃 Cardio</div>
        </div>
        
        <div className={`text-center p-2 rounded-lg ${entry.diet_followed ? 'bg-success/10 text-success' : 'bg-muted/50 text-muted-foreground'}`}>
          <div className="text-lg">{entry.diet_followed ? <CheckCircle className="h-5 w-5 mx-auto" /> : <XCircle className="h-5 w-5 mx-auto" />}</div>
          <div className="text-xs">🍎 Dieta</div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        {entry.diary_text && (
          <div className="bg-background/50 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-foreground mb-1">Diário:</h4>
            <p className="text-sm text-muted-foreground">{entry.diary_text}</p>
          </div>
        )}

        {entry.free_meal && entry.free_meal_description && (
          <div className="bg-accent/10 p-3 rounded-lg border border-accent/20">
            <h4 className="text-sm font-medium text-accent mb-1 flex items-center gap-1">
              <Utensils className="h-3 w-3" />
              Refeição Livre:
            </h4>
            <p className="text-sm text-foreground">{entry.free_meal_description}</p>
          </div>
        )}

        {entry.notes && (
          <div className="bg-muted/30 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-foreground mb-1">Observações:</h4>
            <p className="text-sm text-muted-foreground">{entry.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};