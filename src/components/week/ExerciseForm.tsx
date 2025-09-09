import React, { useState } from 'react';
import { Search, Target, Dumbbell, Weight } from 'lucide-react';
import { exerciseDatabase, ExerciseDatabase } from '@/data/exercises';
import { useWeek } from '@/contexts/WeekContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface ExerciseFormProps {
  isOpen: boolean;
  onClose: () => void;
  dayId: string;
}

export const ExerciseForm: React.FC<ExerciseFormProps> = ({ 
  isOpen, 
  onClose, 
  dayId 
}) => {
  const { addExercise } = useWeek();
  const { toast } = useToast();
  
  const [selectedExercise, setSelectedExercise] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('');

  const filteredExercises = exerciseDatabase.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMuscle = !selectedMuscleGroup || selectedMuscleGroup === 'all' || exercise.muscleGroup === selectedMuscleGroup;
    return matchesSearch && matchesMuscle;
  });

  const muscleGroups = [...new Set(exerciseDatabase.map(ex => ex.muscleGroup))];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedExercise || !sets || !reps || !weight) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const exercise = exerciseDatabase.find(ex => ex.id === selectedExercise);
    if (!exercise) return;

    const setsNum = parseInt(sets);
    const repsNum = parseInt(reps);
    const weightNum = parseFloat(weight);

    if (setsNum < 1 || repsNum < 1 || weightNum < 0) {
      toast({
        title: "Valores inválidos",
        description: "Por favor, insira valores válidos para séries, repetições e carga.",
        variant: "destructive",
      });
      return;
    }

    addExercise(dayId, {
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      muscleGroup: exercise.muscleGroup,
      sets: setsNum,
      reps: repsNum,
      weight: weightNum,
      notes: notes.trim() || undefined,
    });

    toast({
      title: "Exercício adicionado!",
      description: `${exercise.name} foi adicionado com sucesso.`,
    });

    // Reset form
    setSelectedExercise('');
    setSets('');
    setReps('');
    setWeight('');
    setNotes('');
    setSearchTerm('');
    setSelectedMuscleGroup('all');
    onClose();
  };

  const handleClose = () => {
    // Reset form when closing
    setSelectedExercise('');
    setSets('');
    setReps('');
    setWeight('');
    setNotes('');
    setSearchTerm('');
    setSelectedMuscleGroup('all');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-primary" />
            Adicionar Exercício
          </DialogTitle>
          <DialogDescription>
            Selecione um exercício e configure as séries, repetições e carga utilizada.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Muscle Group Filter */}
          <div className="space-y-2">
            <Label htmlFor="muscleGroup">Filtrar por Grupo Muscular</Label>
            <Select value={selectedMuscleGroup} onValueChange={setSelectedMuscleGroup}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os grupos musculares" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os grupos</SelectItem>
                {muscleGroups.map((group) => (
                  <SelectItem key={group} value={group}>
                    {group}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search Exercise */}
          <div className="space-y-2">
            <Label htmlFor="search">Buscar Exercício</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Digite o nome do exercício..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Select Exercise */}
          <div className="space-y-2">
            <Label htmlFor="exercise">Exercício *</Label>
            <Select value={selectedExercise} onValueChange={setSelectedExercise}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um exercício" />
              </SelectTrigger>
              <SelectContent>
                {filteredExercises.map((exercise) => (
                  <SelectItem key={exercise.id} value={exercise.id}>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-primary" />
                      <div>
                        <span className="font-medium">{exercise.name}</span>
                        <div className="text-xs text-muted-foreground">
                          {exercise.muscleGroup}
                          {exercise.equipment && ` • ${exercise.equipment}`}
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sets, Reps, Weight */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="sets">Séries *</Label>
              <Input
                id="sets"
                type="number"
                min="1"
                max="20"
                placeholder="Ex: 3"
                value={sets}
                onChange={(e) => setSets(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reps">Reps *</Label>
              <Input
                id="reps"
                type="number"
                min="1"
                max="100"
                placeholder="Ex: 12"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="weight" className="flex items-center gap-1">
                <Weight className="h-3 w-3" />
                Carga (kg) *
              </Label>
              <Input
                id="weight"
                type="number"
                min="0"
                step="0.5"
                placeholder="Ex: 20"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Observações (opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Ex: Primeira vez fazendo este exercício, carga leve para testar..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
              Adicionar Exercício
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};