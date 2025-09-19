export interface Meal {
  id: string;
  user_id: string;
  meal_type: 'breakfast' | 'pre_workout' | 'lunch' | 'afternoon_snack' | 'dinner';
  food_name: string;
  quantity: string;
  time?: string;
  created_at: string;
}

export interface DiaryEntry {
  id: string;
  user_id: string;
  date: string; // YYYY-MM-DD format
  diary_text?: string;
  free_meal: boolean;
  free_meal_description?: string;
  water_goal: boolean;
  workout_done: boolean;
  cardio_done: boolean;
  diet_followed: boolean;
  notes?: string;
  created_at: string;
}

export interface DietContextType {
  meals: Meal[];
  diaryEntries: DiaryEntry[];
  isLoading: boolean;
  
  // Meals
  addMeal: (meal_type: Meal['meal_type'], food_name: string, quantity: string) => Promise<void>;
  updateMeal: (id: string, updates: Partial<Meal>) => Promise<void>;
  deleteMeal: (id: string) => Promise<void>;
  
  // Diary
  addDiaryEntry: (date: string, entry: Partial<DiaryEntry>) => Promise<void>;
  updateDiaryEntry: (id: string, updates: Partial<DiaryEntry>) => Promise<void>;
  deleteDiaryEntry: (id: string) => Promise<void>;
  getDiaryEntryByDate: (date: string) => DiaryEntry | undefined;
  
  // Stats
  getWeeklyAdherence: (startDate: string) => number;
  getFreeMealHistory: () => DiaryEntry[];
}

export const MEAL_TYPE_LABELS = {
  breakfast: 'Café da manhã',
  pre_workout: 'Pré-treino',
  lunch: 'Almoço',
  afternoon_snack: 'Café da tarde',
  dinner: 'Jantar'
} as const;

export const MEAL_TYPES = Object.keys(MEAL_TYPE_LABELS) as Array<keyof typeof MEAL_TYPE_LABELS>;