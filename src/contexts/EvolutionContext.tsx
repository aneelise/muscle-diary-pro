import React, { createContext, useContext, useState, useEffect } from 'react';
import { EvolutionExercise, EvolutionPhoto, DayOfWeek, EvolutionContextType } from '@/types/evolution';
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
      
      // Load exercises from localStorage for now (can be migrated to Supabase later)
      const savedExercises = localStorage.getItem(`evolution-exercises-${user.id}`);
      const savedPhotos = localStorage.getItem(`evolution-photos-${user.id}`);
      
      if (savedExercises) {
        setExercises(JSON.parse(savedExercises));
      }
      
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

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (user && exercises.length >= 0) {
      localStorage.setItem(`evolution-exercises-${user.id}`, JSON.stringify(exercises));
    }
  }, [exercises, user]);

  useEffect(() => {
    if (user && photos.length >= 0) {
      localStorage.setItem(`evolution-photos-${user.id}`, JSON.stringify(photos));
    }
  }, [photos, user]);

  const addExercise = async (dayOfWeek: DayOfWeek, name: string, sets: number, reps: number, notes?: string) => {
    if (!user) return;

    const newExercise: EvolutionExercise = {
      id: crypto.randomUUID(),
      name,
      sets,
      reps,
      notes,
      dayOfWeek,
      userId: user.id,
      createdAt: new Date().toISOString()
    };

    setExercises(prev => [...prev, newExercise]);
    toast({ title: 'Exercício adicionado!' });
  };

  const updateExercise = async (id: string, updates: Partial<EvolutionExercise>) => {
    setExercises(prev => prev.map(exercise => 
      exercise.id === id ? { ...exercise, ...updates } : exercise
    ));
    toast({ title: 'Exercício atualizado!' });
  };

  const deleteExercise = async (id: string) => {
    setExercises(prev => prev.filter(exercise => exercise.id !== id));
    toast({ title: 'Exercício removido!' });
  };

  const getExercisesByDay = (dayOfWeek: DayOfWeek) => {
    return exercises.filter(exercise => exercise.dayOfWeek === dayOfWeek);
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
      exercises,
      photos,
      isLoading,
      addExercise,
      updateExercise,
      deleteExercise,
      getExercisesByDay,
      addPhoto,
      deletePhoto,
    }}>
      {children}
    </EvolutionContext.Provider>
  );
};