import React from 'react';
import { Trash2, Calendar, Target, Hash } from 'lucide-react';
import { WorkoutSet } from '@/types/workout';
import { useWorkout } from '@/contexts/WorkoutContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

interface ExerciseCardProps {
  workout: WorkoutSet;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ workout }) => {
  const { deleteWorkout } = useWorkout();

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir este exercício?')) {
      deleteWorkout(workout.id);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Card className="workout-card group">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground tracking-tight">
            {workout.exerciseName}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="muscle-category">
          <Target className="h-3 w-3 mr-1" />
          {workout.muscleCategory}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center text-muted-foreground mb-1">
              <Hash className="h-3 w-3 mr-1" />
              <span className="text-xs font-medium">Séries</span>
            </div>
            <div className="text-lg font-bold text-primary">
              {workout.sets}
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center text-muted-foreground mb-1">
              <Target className="h-3 w-3 mr-1" />
              <span className="text-xs font-medium">Reps</span>
            </div>
            <div className="text-lg font-bold text-primary">
              {workout.reps}
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center text-muted-foreground mb-1">
              <Calendar className="h-3 w-3 mr-1" />
              <span className="text-xs font-medium">Data</span>
            </div>
            <div className="text-xs font-medium text-muted-foreground">
              {formatDate(workout.date)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};