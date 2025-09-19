export interface EvolutionExercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  notes?: string;
  dayOfWeek: DayOfWeek;
  userId: string;
  createdAt: string;
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
  exercises: EvolutionExercise[];
  photos: EvolutionPhoto[];
  isLoading: boolean;
  
  // Exercises
  addExercise: (dayOfWeek: DayOfWeek, name: string, sets: number, reps: number, notes?: string) => Promise<void>;
  updateExercise: (id: string, updates: Partial<EvolutionExercise>) => Promise<void>;
  deleteExercise: (id: string) => Promise<void>;
  getExercisesByDay: (dayOfWeek: DayOfWeek) => EvolutionExercise[];
  
  // Photos
  addPhoto: (file: File, description?: string) => Promise<void>;
  deletePhoto: (id: string) => Promise<void>;
}