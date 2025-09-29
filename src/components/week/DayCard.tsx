import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Calendar, Plus, CreditCard as Edit3, Trash2 } from 'lucide-react';
import { Day } from '@/types/week';
import { useWeek } from '@/contexts/WeekContext';
import { ExerciseCard } from './ExerciseCard';
import { ExerciseForm } from './ExerciseForm';
import { CardioForm } from './CardioForm';
import { CardioCard } from './CardioCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

interface DayCardProps {
  day: Day;
}

export const DayCard: React.FC<DayCardProps> = ({ day }) => {
  const { updateDay, deleteDay } = useWeek();
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isExerciseFormOpen, setIsExerciseFormOpen] = useState(false);
  
  // Edit states
  const initialEditDate = day.date.includes('T') ? day.date.split('T')[0] : day.date;
  const [editDate, setEditDate] = useState(initialEditDate);
  const [editName, setEditName] = useState(day.dayName);

  const handleEditDay = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, insira um nome para o dia.",
        variant: "destructive",
      });
      return;
    }

    updateDay(day.id, {
      date: editDate,
      dayName: editName.trim(),
    });

    toast({
      title: "Dia atualizado!",
      description: "As alterações foram salvas com sucesso.",
    });

    setIsEditDialogOpen(false);
  };

  const handleDeleteDay = () => {
    deleteDay(day.id);
    toast({
      title: "Dia excluído",
      description: `${day.dayName} foi removido com sucesso.`,
    });
  };

  const formatDate = (dateString: string) => {
    const base = dateString.includes('T') ? dateString.split('T')[0] : dateString;
    // Parse as local time to avoid timezone shifting one day back/forward
    const date = new Date(`${base}T12:00:00`);
    return date.toLocaleDateString('pt-BR', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
    });
  };

  return (
    <div className="workout-card bg-gradient-to-br from-card-accent to-card">
      {/* Day Header */}
      <div className="p-4 border-b border-border/30">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="hover:bg-primary/10 h-8 w-8"
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </Button>
            
            <div>
              <h4 className="font-semibold text-foreground">{day.dayName}</h4>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(day.date)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right mr-2">
              <div className="text-xs font-medium text-foreground">
                {day.exercises.reduce((total, ex) => total + (ex.sets || 1), 0)} série{day.exercises.reduce((total, ex) => total + (ex.sets || 1), 0) !== 1 ? 's' : ''}
              </div>
              {day.cardio && day.cardio.length > 0 && (
                <div className="text-xs text-accent font-medium">
                  {day.cardio.reduce((total, c) => total + c.durationMinutes, 0)} min cardio
                </div>
              )}
            </div>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={(e) => e.stopPropagation()}
                  variant="ghost"
                  size="icon"
                  className="hover:bg-accent/10 hover:text-accent h-8 w-8"
                >
                  <Edit3 className="h-3 w-3" />
                </Button>
              </DialogTrigger>
              
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Editar Dia</DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleEditDay} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="editDate">Data</Label>
                    <Input
                      id="editDate"
                      type="date"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="editName">Nome do Dia</Label>
                    <Input
                      id="editName"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      required
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
                  onClick={(e) => e.stopPropagation()}
                  variant="ghost"
                  size="icon"
                  className="hover:bg-destructive/10 hover:text-destructive h-8 w-8"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir Dia</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir "{day.dayName}"? 
                    Todos os exercícios deste dia serão perdidos.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteDay}
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

      {/* Expandable Content */}
      {isExpanded && (
        <div className="p-4 space-y-3 animate-fade-in">
          {/* Add Exercise and Cardio Buttons */}
          <div className="flex gap-2">
            <Button 
              onClick={() => setIsExerciseFormOpen(true)}
              className="flex-1 bg-primary hover:bg-primary/90 text-sm"
            >
              <Plus className="h-3 w-3 mr-2" />
              Exercício
            </Button>
            <div className="flex-1">
              <CardioForm dayId={day.id} />
            </div>
          </div>

          {/* Cardio Section */}
          {day.cardio && day.cardio.length > 0 && (
            <div className="space-y-2">
              <h5 className="text-xs font-semibold text-accent uppercase tracking-wide">
                Cardio
              </h5>
              <div className="space-y-2">
                {day.cardio.map((cardio) => (
                  <CardioCard key={cardio.id} cardio={cardio} />
                ))}
              </div>
            </div>
          )}

          {/* Exercises Section */}
          {day.exercises.length > 0 && (
            <div className="space-y-2">
              <h5 className="text-xs font-semibold text-foreground uppercase tracking-wide">
                Exercícios
              </h5>
              <div className="space-y-2">
                {day.exercises.map((exercise) => (
                  <ExerciseCard key={exercise.id} exercise={exercise} />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {day.exercises.length === 0 && (!day.cardio || day.cardio.length === 0) && (
            <div className="text-center py-6 px-4 border border-dashed border-border rounded-lg bg-background/50">
              <p className="text-xs text-muted-foreground">
                Nenhum exercício ou cardio cadastrado
              </p>
            </div>
          )}

          {/* Exercise Form Modal */}
          <ExerciseForm
            isOpen={isExerciseFormOpen}
            onClose={() => setIsExerciseFormOpen(false)}
            dayId={day.id}
          />
        </div>
      )}
    </div>
  );
};