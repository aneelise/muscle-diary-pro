import React, { createContext, useContext, useState, useEffect } from 'react';
import { EvolutionWeek, EvolutionExercise, EvolutionExerciseSet, EvolutionPhoto, DayOfWeek, EvolutionContextType } from '@/types/evolution';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const EvolutionContext = createContext<EvolutionContextType | undefined>(undefined);

export const useEvolution = () => {
  const context = useContext(EvolutionContext);
  if (!context) {
    throw new Error('useEvolution must be used within an EvolutionProvider');
  }
  return context;
};

export const EvolutionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [weeks, setWeeks] = useState<EvolutionWeek[]>([]);
  const [exercises, setExercises] = useState<EvolutionExercise[]>([]);
  const [photos, setPhotos] = useState<EvolutionPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Verificar se o usuário existe na tabela usuarios
      const { data: existingUser, error: userError } = await supabase
        .from('usuarios')
        .select('id')
        .eq('id', user.id)
        .single();

      // Se o usuário não existe, criar
      if (userError && userError.code === 'PGRST116') {
        const { error: insertUserError } = await supabase
          .from('usuarios')
          .insert({
            id: user.id,
            name: user.user_metadata?.first_name || user.email?.split('@')[0] || 'Usuário',
            email: user.email
          });
        
        if (insertUserError) {
          console.error('Error creating user:', insertUserError);
        }
      }

      // Load weeks with exercises and sets
      const { data: weeksData, error: weeksError } = await supabase
        .from('evolution_weeks')
        .select(`
          *,
          exercises:evolution_exercises(
            *,
            sets:evolution_exercise_sets(*)
          )
        `)
        .eq('user_id', user.id)
        .order('order_index', { ascending: true });
      
      if (weeksError) throw weeksError;
      
      setWeeks(weeksData || []);
      
      // Flatten exercises for backward compatibility
      const allExercises = (weeksData || []).flatMap(week => 
        week.exercises.map(exercise => ({
          ...exercise,
          evolution_week_id: week.id
        }))
      );
      setExercises(allExercises);
      
      // Load photos from localStorage for now
      const savedPhotos = localStorage.getItem(`evolution-photos-${user.id}`);
      
      if (savedPhotos) {
        setPhotos(JSON.parse(savedPhotos));
      }
    } catch (error) {
      console.error('Error loading evolution data:', error);
      toast({ title: 'Erro ao carregar dados de evolução', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && photos.length >= 0) {
      localStorage.setItem(`evolution-photos-${user.id}`, JSON.stringify(photos));
    }
  }, [photos, user]);

  // Weeks functions
  const addWeek = async (name: string, description?: string) => {
    if (!user) return;

    try {
      const maxOrder = Math.max(...weeks.map(w => w.order_index), -1);
      
      const { data, error } = await supabase
        .from('evolution_weeks')
        .insert({
          user_id: user.id,
          name,
          description,
          order_index: maxOrder + 1
        })
        .select()
        .single();

      if (error) throw error;

      setWeeks(prev => [...prev, { ...data, exercises: [] }]);
      toast({ title: 'Semana adicionada!' });
    } catch (error) {
      console.error('Error adding week:', error);
      toast({ title: 'Erro ao adicionar semana', variant: 'destructive' });
    }
  };

  const updateWeek = async (id: string, updates: Partial<EvolutionWeek>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('evolution_weeks')
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
        .from('evolution_weeks')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setWeeks(prev => prev.filter(week => week.id !== id));
      setExercises(prev => prev.filter(exercise => exercise.evolution_week_id !== id));
      toast({ title: 'Semana removida!' });
    } catch (error) {
      console.error('Error deleting week:', error);
      toast({ title: 'Erro ao remover semana', variant: 'destructive' });
    }
  };

  // Exercises functions
  const addExercise = async (weekId: string, dayOfWeek: DayOfWeek, name: string, notes?: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('evolution_exercises')
        .insert({
          user_id: user.id,
          evolution_week_id: weekId,
          day_of_week: dayOfWeek,
          name,
          notes
        })
        .select()
        .single();

      if (error) throw error;

      const newExercise = { ...data, sets: [] };
      
      setExercises(prev => [...prev, newExercise]);
      setWeeks(prev => prev.map(week => 
        week.id === weekId 
          ? { ...week, exercises: [...week.exercises, newExercise] }
          : week
      ));
      toast({ title: 'Exercício adicionado!' });
    } catch (error) {
      console.error('Error adding exercise:', error);
      toast({ title: 'Erro ao adicionar exercício', variant: 'destructive' });
    }
  };

  const updateExercise = async (id: string, updates: Partial<EvolutionExercise>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('evolution_exercises')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setExercises(prev => prev.map(exercise => 
        exercise.id === id ? { ...exercise, ...updates } : exercise
      ));
      setWeeks(prev => prev.map(week => ({
        ...week,
        exercises: week.exercises.map(exercise => 
          exercise.id === id ? { ...exercise, ...updates } : exercise
        )
      })));
      toast({ title: 'Exercício atualizado!' });
    } catch (error) {
      console.error('Error updating exercise:', error);
      toast({ title: 'Erro ao atualizar exercício', variant: 'destructive' });
    }
  };

  const deleteExercise = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('evolution_exercises')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setExercises(prev => prev.filter(exercise => exercise.id !== id));
      setWeeks(prev => prev.map(week => ({
        ...week,
        exercises: week.exercises.filter(exercise => exercise.id !== id)
      })));
      toast({ title: 'Exercício removido!' });
    } catch (error) {
      console.error('Error deleting exercise:', error);
      toast({ title: 'Erro ao remover exercício', variant: 'destructive' });
    }
  };

  // Exercise Sets functions
  const addExerciseSet = async (exerciseId: string, setNumber: number, reps: number, weight: number) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('evolution_exercise_sets')
        .insert({
          user_id: user.id,
          evolution_exercise_id: exerciseId,
          set_number: setNumber,
          reps,
          weight
        })
        .select()
        .single();

      if (error) throw error;

      setExercises(prev => prev.map(exercise => 
        exercise.id === exerciseId 
          ? { ...exercise, sets: [...exercise.sets, data] }
          : exercise
      ));
      setWeeks(prev => prev.map(week => ({
        ...week,
        exercises: week.exercises.map(exercise => 
          exercise.id === exerciseId 
            ? { ...exercise, sets: [...exercise.sets, data] }
            : exercise
        )
      })));
      toast({ title: 'Série adicionada!' });
    } catch (error) {
      console.error('Error adding exercise set:', error);
      toast({ title: 'Erro ao adicionar série', variant: 'destructive' });
    }
  };

  const updateExerciseSet = async (id: string, updates: Partial<EvolutionExerciseSet>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('evolution_exercise_sets')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      const updateSets = (sets: EvolutionExerciseSet[]) => 
        sets.map(set => set.id === id ? { ...set, ...updates } : set);

      setExercises(prev => prev.map(exercise => ({
        ...exercise,
        sets: updateSets(exercise.sets)
      })));
      setWeeks(prev => prev.map(week => ({
        ...week,
        exercises: week.exercises.map(exercise => ({
          ...exercise,
          sets: updateSets(exercise.sets)
        }))
      })));
      toast({ title: 'Série atualizada!' });
    } catch (error) {
      console.error('Error updating exercise set:', error);
      toast({ title: 'Erro ao atualizar série', variant: 'destructive' });
    }
  };

  const deleteExerciseSet = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('evolution_exercise_sets')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      const filterSets = (sets: EvolutionExerciseSet[]) => 
        sets.filter(set => set.id !== id);

      setExercises(prev => prev.map(exercise => ({
        ...exercise,
        sets: filterSets(exercise.sets)
      })));
      setWeeks(prev => prev.map(week => ({
        ...week,
        exercises: week.exercises.map(exercise => ({
          ...exercise,
          sets: filterSets(exercise.sets)
        }))
      })));
      toast({ title: 'Série removida!' });
    } catch (error) {
      console.error('Error deleting exercise set:', error);
      toast({ title: 'Erro ao remover série', variant: 'destructive' });
    }
  };

  const addPhoto = async (file: File, description?: string) => {
    if (!user) return;

    try {
      // Create a local URL for the image (in a real app, you'd upload to Supabase Storage)
      const url = URL.createObjectURL(file);
      
      const newPhoto: EvolutionPhoto = {
        id: crypto.randomUUID(),
        url,
        description,
        date: new Date().toISOString().split('T')[0],
        userId: user.id,
        createdAt: new Date().toISOString()
      };

      setPhotos(prev => [newPhoto, ...prev]);
      toast({ title: 'Foto adicionada!' });
    } catch (error) {
      console.error('Error adding photo:', error);
      toast({ title: 'Erro ao adicionar foto', variant: 'destructive' });
    }
  };

  const deletePhoto = async (id: string) => {
    const photo = photos.find(p => p.id === id);
    if (photo) {
      URL.revokeObjectURL(photo.url); // Clean up the object URL
    }
    
    setPhotos(prev => prev.filter(photo => photo.id !== id));
    toast({ title: 'Foto removida!' });
  };

  return (
    <EvolutionContext.Provider value={{
      weeks,
      exercises,
      photos,
      isLoading,
      addWeek,
      updateWeek,
      deleteWeek,
      addExercise,
      updateExercise,
      deleteExercise,
      addExerciseSet,
      updateExerciseSet,
      deleteExerciseSet,
      addPhoto,
      deletePhoto,
    }}>
      {children}
    </EvolutionContext.Provider>
  );
};