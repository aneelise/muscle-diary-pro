import React, { createContext, useContext, useState, useEffect } from 'react';
import { Week, Day, Exercise, WeekContextType } from '@/types/week';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

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
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  // Load data from Supabase and migrate from localStorage if needed
  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const init = async () => {
      try {
        const { data: existingWeeks, error } = await supabase
          .from('weeks')
          .select('id')
          .eq('user_id', user.id)
          .limit(1);
        if (error) throw error;

        if (existingWeeks && existingWeeks.length > 0) {
          await loadData();
        } else {
          const savedWeeks = localStorage.getItem('workout-weeks');
          if (savedWeeks) {
            const localWeeks = JSON.parse(savedWeeks);
            if (localWeeks.length > 0) {
              await migrateLocalDataToSupabase(localWeeks);
              localStorage.removeItem('workout-weeks');
            }
          }
          await loadData();
        }
      } catch (error) {
        console.error('Error initializing data:', error);
        toast.error('Erro ao carregar dados');
      }
    };

    init();
  }, [user]);

  const migrateLocalDataToSupabase = async (localWeeks: Week[]) => {
    try {
      for (const week of localWeeks) {
        // Insert week (use upsert to avoid conflicts)
        const { data: newWeek, error: weekError } = await supabase
          .from('weeks')
          .upsert({
            id: week.id,
            name: week.name,
            description: week.description,
            createdAt: week.createdAt,
            user_id: user?.id
          })
          .select()
          .single();

        if (weekError) throw weekError;

        // Insert days
        for (const day of week.days) {
          const { data: newDay, error: dayError } = await supabase
            .from('days')
            .upsert({
              id: day.id,
              weekId: newWeek.id,
              date: (day.date.includes('T') ? day.date.split('T')[0] : day.date),
              dayName: day.dayName,
              user_id: user?.id
            })
            .select()
            .single();

          if (dayError) throw dayError;

          // Insert exercises
          for (const exercise of day.exercises) {
            const { error: exerciseError } = await supabase
              .from('exercises')
              .upsert({
                id: exercise.id,
                exerciseId: exercise.exerciseId,
                exerciseName: exercise.exerciseName,
                muscleGroup: exercise.muscleGroup,
                sets: exercise.sets,
                reps: exercise.reps,
                weight: exercise.weight,
                notes: exercise.notes,
                dayId: newDay.id,
                createdAt: exercise.createdAt,
                user_id: user?.id
              });

            if (exerciseError) throw exerciseError;
          }
        }
      }

      // Reload data after migration
      await loadData();

      toast.success('Dados migrados com sucesso!');
    } catch (error) {
      console.error('Migration error:', error);
      toast.error('Erro na migração dos dados');
    }
  };

  const loadData = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const { data: weeksData, error: weeksError } = await supabase
        .from('weeks')
        .select('*')
        .eq('user_id', user.id)
        .order('createdAt', { ascending: true });
      if (weeksError) throw weeksError;

      const weekIds = (weeksData || []).map((w) => w.id);
      let daysData: any[] = [];
      let exercisesData: any[] = [];

      if (weekIds.length > 0) {
        const { data: dData, error: daysError } = await supabase
          .from('days')
          .select('*')
          .in('weekId', weekIds)
          .eq('user_id', user.id)
          .order('date', { ascending: true });
        if (daysError) throw daysError;
        daysData = dData || [];

        const dayIds = daysData.map((d) => d.id);
        if (dayIds.length > 0) {
          const { data: eData, error: exError } = await supabase
            .from('exercises')
            .select('*')
            .in('dayId', dayIds)
            .eq('user_id', user.id);
          if (exError) throw exError;
          exercisesData = eData || [];
        }
      }

      const exercisesByDay = exercisesData.reduce((acc: Record<string, any[]>, ex: any) => {
        acc[ex.dayId] = acc[ex.dayId] || [];
        acc[ex.dayId].push(ex);
        return acc;
      }, {});

      const daysByWeek = daysData.reduce((acc: Record<string, any[]>, d: any) => {
        acc[d.weekId] = acc[d.weekId] || [];
        acc[d.weekId].push({ ...d, exercises: exercisesByDay[d.id] || [] });
        return acc;
      }, {});

      const formattedWeeks = (weeksData || []).map((w) => ({
        ...w,
        days: daysByWeek[w.id] || [],
      }));

      setWeeks(formattedWeeks);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setIsLoading(false);
    }
  };

  const addWeek = async (name: string, description?: string) => {
    if (!user) return;

    try {
      const newWeek = {
        name,
        description,
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('weeks')
        .insert(newWeek)
        .select()
        .single();

      if (error) throw error;

      setWeeks(prev => [...prev, { ...data, days: [] }]);
      toast.success('Semana criada com sucesso!');
    } catch (error) {
      console.error('Error adding week:', error);
      toast.error('Erro ao criar semana');
    }
  };

  const updateWeek = async (id: string, updates: Partial<Week>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('weeks')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setWeeks(prev => prev.map(week => 
        week.id === id ? { ...week, ...updates } : week
      ));
      toast.success('Semana atualizada!');
    } catch (error) {
      console.error('Error updating week:', error);
      toast.error('Erro ao atualizar semana');
    }
  };

  const deleteWeek = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('weeks')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setWeeks(prev => prev.filter(week => week.id !== id));
      toast.success('Semana removida!');
    } catch (error) {
      console.error('Error deleting week:', error);
      toast.error('Erro ao remover semana');
    }
  };

  const addDay = async (weekId: string, date: string, dayName: string) => {
    if (!user) return;

    try {
      const newDay = {
        weekId,
        date,
        dayName,
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('days')
        .insert(newDay)
        .select()
        .single();

      if (error) throw error;

      setWeeks(prev => prev.map(week => 
        week.id === weekId 
          ? { ...week, days: [...week.days, { ...data, exercises: [] }] }
          : week
      ));
      toast.success('Dia adicionado!');
    } catch (error) {
      console.error('Error adding day:', error);
      toast.error('Erro ao adicionar dia');
    }
  };

  const updateDay = async (dayId: string, updates: Partial<Day>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('days')
        .update(updates)
        .eq('id', dayId)
        .eq('user_id', user.id);

      if (error) throw error;

      setWeeks(prev => prev.map(week => ({
        ...week,
        days: week.days.map(day => 
          day.id === dayId ? { ...day, ...updates } : day
        )
      })));
      toast.success('Dia atualizado!');
    } catch (error) {
      console.error('Error updating day:', error);
      toast.error('Erro ao atualizar dia');
    }
  };

  const deleteDay = async (dayId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('days')
        .delete()
        .eq('id', dayId)
        .eq('user_id', user.id);

      if (error) throw error;

      setWeeks(prev => prev.map(week => ({
        ...week,
        days: week.days.filter(day => day.id !== dayId)
      })));
      toast.success('Dia removido!');
    } catch (error) {
      console.error('Error deleting day:', error);
      toast.error('Erro ao remover dia');
    }
  };

  const addExercise = async (dayId: string, exercise: Omit<Exercise, 'id' | 'dayId' | 'createdAt'>) => {
    if (!user) return;

    try {
      const newExercise = {
        ...exercise,
        dayId,
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('exercises')
        .insert(newExercise)
        .select()
        .single();

      if (error) throw error;

      setWeeks(prev => prev.map(week => ({
        ...week,
        days: week.days.map(day => 
          day.id === dayId 
            ? { ...day, exercises: [...day.exercises, data] }
            : day
        )
      })));
      toast.success('Exercício adicionado!');
    } catch (error) {
      console.error('Error adding exercise:', error);
      toast.error('Erro ao adicionar exercício');
    }
  };

  const updateExercise = async (exerciseId: string, updates: Partial<Exercise>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('exercises')
        .update(updates)
        .eq('id', exerciseId)
        .eq('user_id', user.id);

      if (error) throw error;

      setWeeks(prev => prev.map(week => ({
        ...week,
        days: week.days.map(day => ({
          ...day,
          exercises: day.exercises.map(exercise => 
            exercise.id === exerciseId ? { ...exercise, ...updates } : exercise
          )
        }))
      })));
      toast.success('Exercício atualizado!');
    } catch (error) {
      console.error('Error updating exercise:', error);
      toast.error('Erro ao atualizar exercício');
    }
  };

  const deleteExercise = async (exerciseId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('exercises')
        .delete()
        .eq('id', exerciseId)
        .eq('user_id', user.id);

      if (error) throw error;

      setWeeks(prev => prev.map(week => ({
        ...week,
        days: week.days.map(day => ({
          ...day,
          exercises: day.exercises.filter(exercise => exercise.id !== exerciseId)
        }))
      })));
      toast.success('Exercício removido!');
    } catch (error) {
      console.error('Error deleting exercise:', error);
      toast.error('Erro ao remover exercício');
    }
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
      isLoading,
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