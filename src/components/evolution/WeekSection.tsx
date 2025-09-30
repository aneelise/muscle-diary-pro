import React, { useState } from 'react';
import { ChevronDown, ChevronRight, TrendingUp, Plus, Edit3, Trash2, Calendar } from 'lucide-react';
import { EvolutionWeek, DayOfWeek, DAY_LABELS } from '@/types/evolution';
import { useEvolution } from '@/contexts/EvolutionContext';
import { DaySection } from './DaySection';
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

interface WeekSectionProps {
  week: EvolutionWeek;
}

const DAYS_OF_WEEK: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export const WeekSection: React.FC<WeekSectionProps> = ({ week }) => {
  const { updateWeek, deleteWeek } = useEvolution();
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Edit states
  const [editName, setEditName] = useState(week.name);
  const [editDescription, setEditDescription] = useState(week.description || '');

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, insira um nome para a semana.",
        variant: "destructive",
      });
      return;
    }

    await updateWeek(week.id, {
      name: editName.trim(),
      description: editDescription.trim() || undefined,
    });

    setIsEditDialogOpen(false);
  };

  const handleDelete = async () => {
    await deleteWeek(week.id);
  };

  const totalSets = week.exercises.reduce((total, exercise) => total + exercise.sets.length, 0);

  return (
    <div className="workout-card">
      {/* Week Header */}
      <div 
        className="p-6 border-b border-border/50 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="hover:bg-primary/10"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
            
            <div>
              <h3 className="text-xl font-semibold text-foreground">{week.name}</h3>
              {week.description && (
                <p className="text-sm text-muted-foreground">{week.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right mr-4">
              <div className="text-sm font-medium text-foreground">
                {week.exercises.length} exercício{week.exercises.length !== 1 ? 's' : ''}
              </div>
              <div className="text-xs text-muted-foreground">
                {totalSets} série{totalSets !== 1 ? 's' : ''}
              </div>
            </div>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={(e) => e.stopPropagation()}
                  variant="ghost"
                  size="icon"
                  className="hover:bg-accent/10 hover:text-accent"
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Editar Semana</DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleEdit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="editName">Nome da Semana</Label>
                    <Input
                      id="editName"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="editDescription">Descrição</Label>
                    <Textarea
                      id="editDescription"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
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
                  onClick={(e) => e.stopPropagation()}
                  variant="ghost"
                  size="icon"
                  className="hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir Semana</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir "{week.name}"? 
                    Todos os exercícios desta semana serão perdidos.
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

      {/* Expandable Content */}
      {isExpanded && (
        <div className="p-6 space-y-6 animate-fade-in">
          <div className="space-y-4">
            {DAYS_OF_WEEK.map((day) => (
              <DaySection 
                key={day} 
                dayOfWeek={day} 
                weekId={week.id}
                exercises={week.exercises.filter(ex => ex.day_of_week === day)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};