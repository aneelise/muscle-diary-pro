export interface EvolutionWeek {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  order_index: number;
  exercises: EvolutionExercise[];
  created_at: string;
}

export interface EvolutionExercise {
  id: string;
  evolution_week_id: string;
  day_of_week: DayOfWeek;
  name: string;
  sets: EvolutionExerciseSet[];
  notes?: string;
  user_id: string;
  created_at: string;
}

export interface EvolutionExerciseSet {
  id: string;
  evolution_exercise_id: string;
  set_number: number;
  reps: number;
  user_id: string;
  created_at: string;
}

export interface EvolutionPhoto {
  id: string;
  url: string;
  description?: string;
  date: string;
  userId: string;
  createdAt: string;
}

export interface FoodSubstitution {
  id: string;
  originalFoodId: string;
  substituteName: string;
  quantity: string;
  userId: string;
  createdAt: string;
}

export interface MealWithSubstitutions {
  id: string;
  user_id: string;
  meal_type: 'breakfast' | 'pre_workout' | 'lunch' | 'afternoon_snack' | 'dinner';
  food_name: string;
  quantity: string;
  time?: string;
  substitutions: FoodSubstitution[];
  created_at: string;
}

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export const DAY_LABELS: Record<DayOfWeek, string> = {
  monday: 'Segunda-feira',
  tuesday: 'Terça-feira',
  wednesday: 'Quarta-feira',
  thursday: 'Quinta-feira',
  friday: 'Sexta-feira',
  saturday: 'Sábado',
  sunday: 'Domingo'
};

export interface EvolutionContextType {
  weeks: EvolutionWeek[];
  exercises: EvolutionExercise[];
  photos: EvolutionPhoto[];
  isLoading: boolean;
  
  // Weeks
  addWeek: (name: string, description?: string) => Promise<void>;
  updateWeek: (id: string, updates: Partial<EvolutionWeek>) => Promise<void>;
  deleteWeek: (id: string) => Promise<void>;
  
  // Exercises
  addExercise: (weekId: string, dayOfWeek: DayOfWeek, name: string, notes?: string) => Promise<void>;
  updateExercise: (id: string, updates: Partial<EvolutionExercise>) => Promise<void>;
  deleteExercise: (id: string) => Promise<void>;
  
  // Exercise Sets
  addExerciseSet: (exerciseId: string, setNumber: number, reps: number) => Promise<void>;
  updateExerciseSet: (id: string, updates: Partial<EvolutionExerciseSet>) => Promise<void>;
  deleteExerciseSet: (id: string) => Promise<void>;
  
  // Photos
  addPhoto: (file: File, description?: string) => Promise<void>;
  deletePhoto: (id: string) => Promise<void>;
}