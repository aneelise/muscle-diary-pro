import React, { createContext, useContext, useState, useEffect } from 'react';
import { WorkoutSet, WorkoutContextType, DayOfWeek } from '@/types/workout';

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workouts, setWorkouts] = useState<WorkoutSet[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedWorkouts = localStorage.getItem('workouts');
    if (savedWorkouts) {
      setWorkouts(JSON.parse(savedWorkouts));
    }
  }, []);

  // Save to localStorage whenever workouts change
  useEffect(() => {
    localStorage.setItem('workouts', JSON.stringify(workouts));
  }, [workouts]);

  const addWorkout = (workout: Omit<WorkoutSet, 'id' | 'date'>) => {
    const newWorkout: WorkoutSet = {
      ...workout,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    setWorkouts(prev => [...prev, newWorkout]);
  };

  const deleteWorkout = (id: string) => {
    setWorkouts(prev => prev.filter(workout => workout.id !== id));
  };

  const getWorkoutsByDay = (day: DayOfWeek) => {
    return workouts.filter(workout => workout.dayOfWeek === day);
  };

  return (
    <WorkoutContext.Provider value={{
      workouts,
      addWorkout,
      deleteWorkout,
      getWorkoutsByDay
    }}>
      {children}
    </WorkoutContext.Provider>
  );
};