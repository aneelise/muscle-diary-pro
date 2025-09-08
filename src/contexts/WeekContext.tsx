import React, { createContext, useContext, useState, useEffect } from 'react';
import { Week, Day, Exercise, WeekContextType } from '@/types/week';

const WeekContext = createContext<WeekContextType | undefined>(undefined);

export const useWeek = () => {
  const context = useContext(WeekContext);
  if (!context) {
    throw new Error('useWeek must be used within a WeekProvider');
  }
  return context;
};

export const WeekProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [weeks, setWeeks] = useState<Week[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedWeeks = localStorage.getItem('workout-weeks');
    if (savedWeeks) {
      setWeeks(JSON.parse(savedWeeks));
    }
  }, []);

  // Save to localStorage whenever weeks change
  useEffect(() => {
    localStorage.setItem('workout-weeks', JSON.stringify(weeks));
  }, [weeks]);

  const addWeek = (name: string, description?: string) => {
    const newWeek: Week = {
      id: Date.now().toString(),
      name,
      description,
      createdAt: new Date().toISOString(),
      days: [],
    };
    setWeeks(prev => [...prev, newWeek]);
  };

  const updateWeek = (id: string, updates: Partial<Week>) => {
    setWeeks(prev => prev.map(week => 
      week.id === id ? { ...week, ...updates } : week
    ));
  };

  const deleteWeek = (id: string) => {
    setWeeks(prev => prev.filter(week => week.id !== id));
  };

  const addDay = (weekId: string, date: string, dayName: string) => {
    const newDay: Day = {
      id: Date.now().toString(),
      date,
      dayName,
      weekId,
      exercises: [],
    };

    setWeeks(prev => prev.map(week => 
      week.id === weekId 
        ? { ...week, days: [...week.days, newDay] }
        : week
    ));
  };

  const updateDay = (dayId: string, updates: Partial<Day>) => {
    setWeeks(prev => prev.map(week => ({
      ...week,
      days: week.days.map(day => 
        day.id === dayId ? { ...day, ...updates } : day
      )
    })));
  };

  const deleteDay = (dayId: string) => {
    setWeeks(prev => prev.map(week => ({
      ...week,
      days: week.days.filter(day => day.id !== dayId)
    })));
  };

  const addExercise = (dayId: string, exercise: Omit<Exercise, 'id' | 'dayId' | 'createdAt'>) => {
    const newExercise: Exercise = {
      ...exercise,
      id: Date.now().toString(),
      dayId,
      createdAt: new Date().toISOString(),
    };

    setWeeks(prev => prev.map(week => ({
      ...week,
      days: week.days.map(day => 
        day.id === dayId 
          ? { ...day, exercises: [...day.exercises, newExercise] }
          : day
      )
    })));
  };

  const updateExercise = (exerciseId: string, updates: Partial<Exercise>) => {
    setWeeks(prev => prev.map(week => ({
      ...week,
      days: week.days.map(day => ({
        ...day,
        exercises: day.exercises.map(exercise => 
          exercise.id === exerciseId ? { ...exercise, ...updates } : exercise
        )
      }))
    })));
  };

  const deleteExercise = (exerciseId: string) => {
    setWeeks(prev => prev.map(week => ({
      ...week,
      days: week.days.map(day => ({
        ...day,
        exercises: day.exercises.filter(exercise => exercise.id !== exerciseId)
      }))
    })));
  };

  const getWeekById = (id: string) => {
    return weeks.find(week => week.id === id);
  };

  const getDayById = (id: string) => {
    for (const week of weeks) {
      const day = week.days.find(day => day.id === id);
      if (day) return day;
    }
    return undefined;
  };

  return (
    <WeekContext.Provider value={{
      weeks,
      addWeek,
      updateWeek,
      deleteWeek,
      addDay,
      updateDay,
      deleteDay,
      addExercise,
      updateExercise,
      deleteExercise,
      getWeekById,
      getDayById,
    }}>
      {children}
    </WeekContext.Provider>
  );
};