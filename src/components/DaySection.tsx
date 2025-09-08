import React from 'react';
import { Calendar, Target, Plus } from 'lucide-react';
import { DayOfWeek } from '@/types/workout';
import { useWorkout } from '@/contexts/WorkoutContext';
import { ExerciseCard } from './ExerciseCard';
import { AddExerciseModal } from './AddExerciseModal';

interface DaySectionProps {
  day: DayOfWeek;
  dayLabel: string;
  muscleCategory: string;
}

const dayColors = {
  monday: 'from-primary-pale to-primary-cream',
  tuesday: 'from-primary-soft to-primary-pale',
  wednesday: 'from-primary-light to-primary-soft',
  thursday: 'from-primary to-primary-light',
  friday: 'from-primary-cream to-primary-lightest',
  saturday: 'from-primary-lightest to-background',
  sunday: 'from-accent to-primary-cream',
};

export const DaySection: React.FC<DaySectionProps> = ({ 
  day, 
  dayLabel, 
  muscleCategory 
}) => {
  const { getWorkoutsByDay } = useWorkout();
  const workouts = getWorkoutsByDay(day);

  return (
    <div className={`day-container bg-gradient-to-br ${dayColors[day]}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <h2 className="workout-header">{dayLabel}</h2>
          </div>
          <div className="muscle-category">
            <Target className="h-3 w-3 mr-1" />
            {muscleCategory}
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground font-medium">
          {workouts.length} exercício{workouts.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="space-y-3 mb-4">
        {workouts.length === 0 ? (
          <div className="text-center py-8 px-4 border-2 border-dashed border-border rounded-xl bg-background/50">
            <Target className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">
              Nenhum exercício cadastrado para {dayLabel.toLowerCase()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Adicione seu primeiro exercício de {muscleCategory.toLowerCase()}
            </p>
          </div>
        ) : (
          workouts.map((workout) => (
            <ExerciseCard key={workout.id} workout={workout} />
          ))
        )}
      </div>

      <AddExerciseModal dayOfWeek={day} muscleCategory={muscleCategory} />
    </div>
  );
};