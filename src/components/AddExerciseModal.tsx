import React, { useState } from 'react';
import { Plus, Search, Target, Dumbbell } from 'lucide-react';
import { exerciseDatabase } from '@/data/exercises';
import { useWorkout } from '@/contexts/WorkoutContext';
import { DayOfWeek } from '@/types/workout';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AddExerciseModalProps {
  dayOfWeek: DayOfWeek;
  muscleCategory: string;
}

export const AddExerciseModal: React.FC<AddExerciseModalProps> = ({ 
  dayOfWeek, 
  muscleCategory 
}) => {
  const { addWorkout } = useWorkout();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredExercises = exerciseDatabase.filter(exercise =>
    exercise.muscleGroup.toLowerCase() === muscleCategory.toLowerCase() &&
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedExercise || !sets || !reps) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    const exercise = exerciseDatabase.find(ex => ex.id === selectedExercise);
    if (!exercise) return;

    addWorkout({
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      sets: parseInt(sets),
      reps: parseInt(reps),
      dayOfWeek,
      muscleCategory,
    });

    // Reset form
    setSelectedExercise('');
    setSets('');
    setReps('');
    setSearchTerm('');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Exercício
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Novo Exercício - {muscleCategory}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="space-y-2">
            <Label htmlFor="exercise">Exercício</Label>
            <Select value={selectedExercise} onValueChange={setSelectedExercise}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um exercício" />
              </SelectTrigger>
              <SelectContent>
                {filteredExercises.map((exercise) => (
                  <SelectItem key={exercise.id} value={exercise.id}>
                    <div className="flex items-center gap-2">
                      <Dumbbell className="h-4 w-4 text-primary" />
                      <span>{exercise.name}</span>
                      {exercise.equipment && (
                        <span className="text-xs text-muted-foreground">
                          ({exercise.equipment})
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sets">Séries</Label>
              <Input
                id="sets"
                type="number"
                min="1"
                max="20"
                placeholder="Ex: 3"
                value={sets}
                onChange={(e) => setSets(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reps">Repetições</Label>
              <Input
                id="reps"
                type="number"
                min="1"
                max="100"
                placeholder="Ex: 12"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
              Salvar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};