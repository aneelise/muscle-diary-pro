import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Calendar, Plus, Edit3, Trash2, Timer } from 'lucide-react';
import { Week } from '@/types/week';
import { useWeek } from '@/contexts/WeekContext';
import { DayCard } from './DayCard';
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

interface WeekCardProps {
  week: Week;
}

export const WeekCard: React.FC<WeekCardProps> = ({ week }) => {
  const { updateWeek, deleteWeek, addDay } = useWeek();
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDayDialogOpen, setIsAddDayDialogOpen] = useState(false);
  
  // Edit week states
  const [editName, setEditName] = useState(week.name);
  const [editDescription, setEditDescription] = useState(week.description || '');
  
  // Add day states
  const getLocalDate = () => {
    const now = new Date();
    const tz = now.getTimezoneOffset() * 60000;
    return new Date(Date.now() - tz).toISOString().slice(0, 10);
  };
  const [dayDate, setDayDate] = useState(getLocalDate());
  const [dayName, setDayName] = useState('');

  const handleEditWeek = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, insira um nome para a semana.",
        variant: "destructive",
      });
      return;
    }

    updateWeek(week.id, {
      name: editName.trim(),
      description: editDescription.trim() || undefined,
    });

    toast({
      title: "Semana atualizada!",
      description: "As alterações foram salvas com sucesso.",
    });

    setIsEditDialogOpen(false);
  };

  const handleDeleteWeek = () => {
    deleteWeek(week.id);
    toast({
      title: "Semana excluída",
      description: `${week.name} foi removida com sucesso.`,
    });
  };

  const handleAddDay = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!dayName.trim()) {
      toast({
        title: "Nome do dia obrigatório",
        description: "Por favor, insira um nome para o dia.",
        variant: "destructive",
      });
      return;
    }

    addDay(week.id, dayDate, dayName.trim());
    
    toast({
      title: "Dia adicionado!",
      description: `${dayName} foi adicionado à ${week.name}.`,
    });

    setDayName('');
    setDayDate(getLocalDate());
    setIsAddDayDialogOpen(false);
  };

  const totalExercises = week.days.reduce((total, day) => total + day.exercises.length, 0);
  
  // Calculate cardio totals
  const cardioTotals = week.days.reduce((totals, day) => {
    (day.cardio || []).forEach(cardio => {
      totals[cardio.cardioType] = (totals[cardio.cardioType] || 0) + cardio.durationMinutes;
      totals.total += cardio.durationMinutes;
    });
    return totals;
  }, { esteira: 0, escada: 0, bike: 0, eliptico: 0, total: 0 });

  const cardioTypeLabels = {
    esteira: 'Esteira',
    escada: 'Escada',
    bike: 'Bike',
    eliptico: 'Elíptico'
  };

  return (
    <div className="workout-card animate-fade-in">
      {/* Week Header */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              className="hover:bg-primary/10"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
            
            <div>
              <h3 className="workout-header">{week.name}</h3>
              {week.description && (
                <p className="text-sm text-muted-foreground">{week.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right mr-4">
              <div className="text-sm font-medium text-foreground">
                {week.days.length} dia{week.days.length !== 1 ? 's' : ''}
              </div>
              <div className="text-xs text-muted-foreground">
                {totalExercises} exercício{totalExercises !== 1 ? 's' : ''}
              </div>
              {cardioTotals.total > 0 && (
                <div className="text-xs text-accent font-medium flex items-center gap-1 mt-1">
                  <Timer className="h-3 w-3" />
                  {cardioTotals.total} min cardio
                </div>
              )}
            </div>

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
              
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Editar Semana</DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleEditWeek} className="space-y-4">
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
                    <Input
                      id="editDescription"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
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
                    Esta ação não pode ser desfeita e todos os dias e exercícios serão perdidos.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteWeek}
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
        <div className="p-6 space-y-4 animate-fade-in">
          {/* Cardio Summary */}
          {cardioTotals.total > 0 && (
            <div className="bg-gradient-to-r from-accent/10 to-accent/5 p-4 rounded-lg border border-accent/20">
              <h4 className="text-sm font-semibold text-accent mb-3 flex items-center gap-2">
                <Timer className="h-4 w-4" />
                Resumo de Cardio da Semana
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(cardioTotals).map(([type, minutes]) => {
                  if (type === 'total' || minutes === 0) return null;
                  return (
                    <div key={type} className="text-center">
                      <div className="text-lg font-bold text-foreground">{minutes}</div>
                      <div className="text-xs text-muted-foreground">
                        {cardioTypeLabels[type as keyof typeof cardioTypeLabels]}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 pt-3 border-t border-accent/20 text-center">
                <div className="text-xl font-bold text-accent">{cardioTotals.total}</div>
                <div className="text-xs text-muted-foreground">Total de minutos</div>
              </div>
            </div>
          )}

          {/* Add Day Button */}
          <Dialog open={isAddDayDialogOpen} onOpenChange={setIsAddDayDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Dia
              </Button>
            </DialogTrigger>
            
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Adicionar Dia - {week.name}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleAddDay} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dayDate">Data</Label>
                  <Input
                    id="dayDate"
                    type="date"
                    value={dayDate}
                    onChange={(e) => setDayDate(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dayName">Nome do Dia</Label>
                  <Input
                    id="dayName"
                    placeholder="Ex: Segunda-feira, Treino A, Peito..."
                    value={dayName}
                    onChange={(e) => setDayName(e.target.value)}
                    required
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddDayDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1">
                    Adicionar Dia
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* Days List */}
          {week.days.length === 0 ? (
            <div className="text-center py-8 px-4 border-2 border-dashed border-border rounded-xl bg-background/50">
              <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">
                Nenhum dia cadastrado nesta semana
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Adicione o primeiro dia de treino
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {week.days.map((day) => (
                <DayCard key={day.id} day={day} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};