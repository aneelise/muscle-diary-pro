export interface Week {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  days: Day[];
}

export interface Day {
  id: string;
  date: string; // ISO string
  dayName: string; // Segunda-feira, Terça-feira, etc.
  weekId: string;
  exercises: Exercise[];
}

export interface Exercise {
  id: string;
  exerciseId: string; // Reference to exercise database
  exerciseName: string;
  muscleGroup: string;
  sets: number;
  reps: number;
  weight: number; // Carga em kg
  notes?: string;
  dayId: string;
  createdAt: string;
}

export interface WeekContextType {
  weeks: Week[];
  isLoading: boolean;
  addWeek: (name: string, description?: string) => Promise<void>;
  updateWeek: (id: string, updates: Partial<Week>) => Promise<void>;
  deleteWeek: (id: string) => Promise<void>;
  addDay: (weekId: string, date: string, dayName: string) => Promise<void>;
  updateDay: (dayId: string, updates: Partial<Day>) => Promise<void>;
  deleteDay: (dayId: string) => Promise<void>;
  addExercise: (dayId: string, exercise: Omit<Exercise, 'id' | 'dayId' | 'createdAt'>) => Promise<void>;
  updateExercise: (exerciseId: string, updates: Partial<Exercise>) => Promise<void>;
  deleteExercise: (exerciseId: string) => Promise<void>;
  getWeekById: (id: string) => Week | undefined;
  getDayById: (id: string) => Day | undefined;
}