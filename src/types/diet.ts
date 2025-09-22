export interface Meal {
  id: string;
  user_id: string;
  meal_type: string;
  food_name: string;
  quantity: string;
  time?: string;
  substitutions?: FoodSubstitution[];
  created_at: string;
}

export interface FoodSubstitution {
  id: string;
  user_id: string;
  meal_id: string;
  substitute_name: string;
  quantity: string;
  created_at: string;
}

export interface CustomMealType {
  id: string;
  user_id: string;
  name: string;
  order_index: number;
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
  customMealTypes: CustomMealType[];
  diaryEntries: DiaryEntry[];
  isLoading: boolean;
  
  // Meals
  addMeal: (meal_type: string, food_name: string, quantity: string, time?: string) => Promise<void>;
  updateMeal: (id: string, updates: Partial<Meal>) => Promise<void>;
  deleteMeal: (id: string) => Promise<void>;
  
  // Custom Meal Types
  addCustomMealType: (name: string) => Promise<void>;
  updateCustomMealType: (id: string, updates: Partial<CustomMealType>) => Promise<void>;
  deleteCustomMealType: (id: string) => Promise<void>;
  
  // Food Substitutions
  addFoodSubstitution: (mealId: string, substituteName: string, quantity: string) => Promise<void>;
  updateFoodSubstitution: (id: string, updates: Partial<FoodSubstitution>) => Promise<void>;
  deleteFoodSubstitution: (id: string) => Promise<void>;
  
  // Diary
  addDiaryEntry: (date: string, entry: Partial<DiaryEntry>) => Promise<void>;
  updateDiaryEntry: (id: string, updates: Partial<DiaryEntry>) => Promise<void>;
  deleteDiaryEntry: (id: string) => Promise<void>;
  getDiaryEntryByDate: (date: string) => DiaryEntry | undefined;
  
  // Stats
  getWeeklyAdherence: (startDate: string) => number;
  getFreeMealHistory: () => DiaryEntry[];
}

export const DEFAULT_MEAL_TYPES = [
  { name: 'Café da manhã', order_index: 0 },
  { name: 'Pré-treino', order_index: 1 },
  { name: 'Almoço', order_index: 2 },
  { name: 'Café da tarde', order_index: 3 },
  { name: 'Jantar', order_index: 4 }
];