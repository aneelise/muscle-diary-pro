import React, { createContext, useContext, useState, useEffect } from 'react';
import { Week, Day, Exercise, Cardio, WeekContextType } from '@/types/week';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  // Load data from Supabase and migrate from localStorage if needed, with fast cache hydration
  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    // Try hydrate from local cache first to avoid loading flash when returning to the app
    const cacheKey = `weeks-cache-${user.id}`;
    const cached = localStorage.getItem(cacheKey);
    let usedCache = false;
    if (cached) {
      try {
        const cachedWeeks = JSON.parse(cached) as Week[];
        if (Array.isArray(cachedWeeks)) {
          setWeeks(cachedWeeks);
          setIsLoading(false);
          usedCache = true;
        }
      } catch (e) {
        console.warn('Invalid weeks cache, ignoring');
      }
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
          await loadData(usedCache);
        } else {
          const savedWeeks = localStorage.getItem('workout-weeks');
          if (savedWeeks) {
            const localWeeks = JSON.parse(savedWeeks);
            if (localWeeks.length > 0) {
              await migrateLocalDataToSupabase(localWeeks);
              localStorage.removeItem('workout-weeks');
            }
          }
          await loadData(usedCache);
        }
      } catch (error) {
        console.error('Error initializing data:', error);
        toast({ title: 'Erro ao carregar dados', variant: 'destructive' });
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

      toast({ title: 'Dados migrados com sucesso!' });
    } catch (error) {
      console.error('Migration error:', error);
      toast({ title: 'Erro na migração dos dados', variant: 'destructive' });
    }
  };

  const loadData = async (silent = false) => {
    if (!user) return;
    try {
      if (!silent) setIsLoading(true);
      const { data: weeksData, error: weeksError } = await supabase
        .from('weeks')
        .select('*')
        .eq('user_id', user.id)
        .order('createdAt', { ascending: true });
      if (weeksError) throw weeksError;

      const weekIds = (weeksData || []).map((w) => w.id);
      let daysData: any[] = [];
      let exercisesData: any[] = [];
      let cardioData: any[] = [];

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
          // Load exercises
          const { data: eData, error: exError } = await supabase
            .from('exercises')
            .select('*')
            .in('dayId', dayIds)
            .eq('user_id', user.id);
          if (exError) throw exError;
          exercisesData = eData || [];

          // Load cardio
          const { data: cData, error: cardioError } = await supabase
            .from('cardio')
            .select('*')
            .in('day_id', dayIds)
            .eq('user_id', user.id);
          if (cardioError) throw cardioError;
          cardioData = cData || [];
        }
      }

      const exercisesByDay = exercisesData.reduce((acc: Record<string, any[]>, ex: any) => {
        acc[ex.dayId] = acc[ex.dayId] || [];
        acc[ex.dayId].push(ex);
        return acc;
      }, {});

      const cardioByDay = cardioData.reduce((acc: Record<string, any[]>, c: any) => {
        acc[c.day_id] = acc[c.day_id] || [];
        acc[c.day_id].push({
          id: c.id,
          dayId: c.day_id,
          cardioType: c.cardio_type,
          durationMinutes: c.duration_minutes,
          createdAt: c.created_at
        });
        return acc;
      }, {});

      const daysByWeek = daysData.reduce((acc: Record<string, any[]>, d: any) => {
        acc[d.weekId] = acc[d.weekId] || [];
        acc[d.weekId].push({ 
          ...d, 
          exercises: exercisesByDay[d.id] || [],
          cardio: cardioByDay[d.id] || []
        });
        return acc;
      }, {});

      const formattedWeeks = (weeksData || []).map((w) => ({
        ...w,
        days: daysByWeek[w.id] || [],
      }));

      setWeeks(formattedWeeks);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({ title: 'Erro ao carregar dados', variant: 'destructive' });
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  // Persist weeks to local cache for fast hydration on return visits
  useEffect(() => {
    if (!user) return;
    try {
      localStorage.setItem(`weeks-cache-${user.id}`, JSON.stringify(weeks));
    } catch {}
  }, [weeks, user]);

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
      toast({ title: 'Semana criada com sucesso!' });
    } catch (error) {
      console.error('Error adding week:', error);
      toast({ title: 'Erro ao criar semana', variant: 'destructive' });
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
      toast({ title: 'Semana atualizada!' });
    } catch (error) {
      console.error('Error updating week:', error);
      toast({ title: 'Erro ao atualizar semana', variant: 'destructive' });
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
      toast({ title: 'Semana removida!' });
    } catch (error) {
      console.error('Error deleting week:', error);
      toast({ title: 'Erro ao remover semana', variant: 'destructive' });
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
          ? { ...week, days: [...week.days, { ...data, exercises: [], cardio: [] }] }
          : week
      ));
      toast({ title: 'Dia adicionado!' });
    } catch (error) {
      console.error('Error adding day:', error);
      toast({ title: 'Erro ao adicionar dia', variant: 'destructive' });
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
      toast({ title: 'Dia atualizado!' });
    } catch (error) {
      console.error('Error updating day:', error);
      toast({ title: 'Erro ao atualizar dia', variant: 'destructive' });
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
      toast({ title: 'Dia removido!' });
    } catch (error) {
      console.error('Error deleting day:', error);
      toast({ title: 'Erro ao remover dia', variant: 'destructive' });
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
      toast({ title: 'Exercício adicionado!' });
    } catch (error) {
      console.error('Error adding exercise:', error);
      toast({ title: 'Erro ao adicionar exercício', variant: 'destructive' });
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
      toast({ title: 'Exercício atualizado!' });
    } catch (error) {
      console.error('Error updating exercise:', error);
      toast({ title: 'Erro ao atualizar exercício', variant: 'destructive' });
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
      toast({ title: 'Exercício removido!' });
    } catch (error) {
      console.error('Error deleting exercise:', error);
      toast({ title: 'Erro ao remover exercício', variant: 'destructive' });
    }
  };

  const addCardio = async (dayId: string, cardioType: Cardio['cardioType'], durationMinutes: number) => {
    if (!user) return;

    try {
      const newCardio = {
        day_id: dayId,
        cardio_type: cardioType,
        duration_minutes: durationMinutes,
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('cardio')
        .insert(newCardio)
        .select()
        .single();

      if (error) throw error;

      setWeeks(prev => prev.map(week => ({
        ...week,
        days: week.days.map(day => 
          day.id === dayId 
            ? { 
                ...day, 
                cardio: [...(day.cardio || []), {
                  id: data.id,
                  dayId: data.day_id,
                  cardioType: data.cardio_type as Cardio['cardioType'],
                  durationMinutes: data.duration_minutes,
                  createdAt: data.created_at
                }]
              }
            : day
        )
      })));
    } catch (error) {
      console.error('Error adding cardio:', error);
      toast({ title: 'Erro ao adicionar cardio', variant: 'destructive' });
    }
  };

  const updateCardio = async (cardioId: string, updates: Partial<Cardio>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('cardio')
        .update({
          cardio_type: updates.cardioType,
          duration_minutes: updates.durationMinutes
        })
        .eq('id', cardioId)
        .eq('user_id', user.id);

      if (error) throw error;

      setWeeks(prev => prev.map(week => ({
        ...week,
        days: week.days.map(day => ({
          ...day,
          cardio: (day.cardio || []).map(cardio => 
            cardio.id === cardioId ? { ...cardio, ...updates } : cardio
          )
        }))
      })));
    } catch (error) {
      console.error('Error updating cardio:', error);
      toast({ title: 'Erro ao atualizar cardio', variant: 'destructive' });
    }
  };

  const deleteCardio = async (cardioId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('cardio')
        .delete()
        .eq('id', cardioId)
        .eq('user_id', user.id);

      if (error) throw error;

      setWeeks(prev => prev.map(week => ({
        ...week,
        days: week.days.map(day => ({
          ...day,
          cardio: (day.cardio || []).filter(cardio => cardio.id !== cardioId)
        }))
      })));
    } catch (error) {
      console.error('Error deleting cardio:', error);
      toast({ title: 'Erro ao remover cardio', variant: 'destructive' });
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
      addCardio,
      updateCardio,
      deleteCardio,
      getWeekById,
      getDayById,
    }}>
      {children}
    </WeekContext.Provider>
  );
};