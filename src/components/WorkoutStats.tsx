import React from 'react';
import { BarChart3, Target, Calendar, TrendingUp } from 'lucide-react';
import { useWorkout } from '@/contexts/WorkoutContext';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

export const WorkoutStats: React.FC = () => {
  const { workouts } = useWorkout();

  const totalExercises = workouts.length;
  const totalSets = workouts.reduce((sum, workout) => sum + workout.sets, 0);
  const totalReps = workouts.reduce((sum, workout) => sum + (workout.sets * workout.reps), 0);
  
  const exercisesThisWeek = workouts.filter(workout => {
    const workoutDate = new Date(workout.date);
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    return workoutDate >= weekAgo;
  }).length;

  const stats = [
    {
      icon: Target,
      label: 'Total de Exercícios',
      value: totalExercises,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: BarChart3,
      label: 'Total de Séries',
      value: totalSets,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      icon: TrendingUp,
      label: 'Total de Reps',
      value: totalReps,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      icon: Calendar,
      label: 'Esta Semana',
      value: exercisesThisWeek,
      color: 'text-primary-light',
      bgColor: 'bg-primary-light/10',
    },
  ];

  if (totalExercises === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 stats-appear">
      {stats.map((stat, index) => (
        <Card key={index} className="workout-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <div>
                <div className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};