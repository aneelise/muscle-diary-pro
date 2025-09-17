import React, { createContext, useContext, useState, useEffect } from 'react';
import { Meal, DiaryEntry, DietContextType } from '@/types/diet';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const DietContext = createContext<DietContextType | undefined>(undefined);

export const useDiet = () => {
  const context = useContext(DietContext);
  if (!context) {
    throw new Error('useDiet must be used within a DietProvider');
  }
  return context;
};

export const DietProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
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
      
      // Load meals
      const { data: mealsData, error: mealsError } = await supabase
        .from('meals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });
      
      if (mealsError) throw mealsError;
      
      // Load diary entries
      const { data: diaryData, error: diaryError } = await supabase
        .from('diary_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });
      
      if (diaryError) throw diaryError;
      
      setMeals(mealsData || []);
      setDiaryEntries(diaryData || []);
    } catch (error) {
      console.error('Error loading diet data:', error);
      toast({ title: 'Erro ao carregar dados da dieta', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  // Meals functions
  const addMeal = async (meal_type: Meal['meal_type'], food_name: string, quantity: string) => {
    if (!user) return;

    try {
      const newMeal = {
        user_id: user.id,
        meal_type,
        food_name,
        quantity
      };

      const { data, error } = await supabase
        .from('meals')
        .insert(newMeal)
        .select()
        .single();

      if (error) throw error;

      setMeals(prev => [...prev, data]);
      toast({ title: 'Alimento adicionado!' });
    } catch (error) {
      console.error('Error adding meal:', error);
      toast({ title: 'Erro ao adicionar alimento', variant: 'destructive' });
    }
  };

  const updateMeal = async (id: string, updates: Partial<Meal>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('meals')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setMeals(prev => prev.map(meal => 
        meal.id === id ? { ...meal, ...updates } : meal
      ));
      toast({ title: 'Alimento atualizado!' });
    } catch (error) {
      console.error('Error updating meal:', error);
      toast({ title: 'Erro ao atualizar alimento', variant: 'destructive' });
    }
  };

  const deleteMeal = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('meals')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setMeals(prev => prev.filter(meal => meal.id !== id));
      toast({ title: 'Alimento removido!' });
    } catch (error) {
      console.error('Error deleting meal:', error);
      toast({ title: 'Erro ao remover alimento', variant: 'destructive' });
    }
  };

  // Diary functions
  const addDiaryEntry = async (date: string, entry: Partial<DiaryEntry>) => {
    if (!user) return;

    try {
      const newEntry = {
        user_id: user.id,
        date,
        diary_text: entry.diary_text || '',
        free_meal: entry.free_meal || false,
        free_meal_description: entry.free_meal_description || '',
        water_goal: entry.water_goal || false,
        workout_done: entry.workout_done || false,
        cardio_done: entry.cardio_done || false,
        diet_followed: entry.diet_followed || false,
        notes: entry.notes || ''
      };

      const { data, error } = await supabase
        .from('diary_entries')
        .upsert(newEntry)
        .select()
        .single();

      if (error) throw error;

      setDiaryEntries(prev => {
        const filtered = prev.filter(e => e.date !== date);
        return [data, ...filtered].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      });
      
      toast({ title: 'Diário atualizado!' });
    } catch (error) {
      console.error('Error adding diary entry:', error);
      toast({ title: 'Erro ao salvar diário', variant: 'destructive' });
    }
  };

  const updateDiaryEntry = async (id: string, updates: Partial<DiaryEntry>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('diary_entries')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setDiaryEntries(prev => prev.map(entry => 
        entry.id === id ? { ...entry, ...updates } : entry
      ));
    } catch (error) {
      console.error('Error updating diary entry:', error);
      toast({ title: 'Erro ao atualizar diário', variant: 'destructive' });
    }
  };

  const deleteDiaryEntry = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('diary_entries')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setDiaryEntries(prev => prev.filter(entry => entry.id !== id));
      toast({ title: 'Entrada do diário removida!' });
    } catch (error) {
      console.error('Error deleting diary entry:', error);
      toast({ title: 'Erro ao remover entrada', variant: 'destructive' });
    }
  };

  const getDiaryEntryByDate = (date: string) => {
    return diaryEntries.find(entry => entry.date === date);
  };

  const getWeeklyAdherence = (startDate: string) => {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const weekEntries = diaryEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= start && entryDate <= end;
    });

    if (weekEntries.length === 0) return 0;

    const totalGoals = weekEntries.length * 4; // 4 goals per day
    const completedGoals = weekEntries.reduce((total, entry) => {
      return total + 
        (entry.water_goal ? 1 : 0) +
        (entry.workout_done ? 1 : 0) +
        (entry.cardio_done ? 1 : 0) +
        (entry.diet_followed ? 1 : 0);
    }, 0);

    return Math.round((completedGoals / totalGoals) * 100);
  };

  const getFreeMealHistory = () => {
    return diaryEntries.filter(entry => entry.free_meal);
  };

  return (
    <DietContext.Provider value={{
      meals,
      diaryEntries,
      isLoading,
      addMeal,
      updateMeal,
      deleteMeal,
      addDiaryEntry,
      updateDiaryEntry,
      deleteDiaryEntry,
      getDiaryEntryByDate,
      getWeeklyAdherence,
      getFreeMealHistory,
    }}>
      {children}
    </DietContext.Provider>
  );
};