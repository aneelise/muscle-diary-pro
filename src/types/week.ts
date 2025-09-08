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
  addWeek: (name: string, description?: string) => void;
  updateWeek: (id: string, updates: Partial<Week>) => void;
  deleteWeek: (id: string) => void;
  addDay: (weekId: string, date: string, dayName: string) => void;
  updateDay: (dayId: string, updates: Partial<Day>) => void;
  deleteDay: (dayId: string) => void;
  addExercise: (dayId: string, exercise: Omit<Exercise, 'id' | 'dayId' | 'createdAt'>) => void;
  updateExercise: (exerciseId: string, updates: Partial<Exercise>) => void;
  deleteExercise: (exerciseId: string) => void;
  getWeekById: (id: string) => Week | undefined;
  getDayById: (id: string) => Day | undefined;
}