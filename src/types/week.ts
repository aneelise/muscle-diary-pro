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
  cardio: Cardio[];
}

export interface Cardio {
  id: string;
  dayId: string;
  cardioType: 'esteira' | 'escada' | 'bike' | 'eliptico';
  durationMinutes: number;
  createdAt: string;
}

export interface Exercise {
  id: string;
  exerciseId: string; // Reference to exercise database
  exerciseName: string;
  muscleGroup: string;
  sets: ExerciseSet[];
  notes?: string;
  dayId: string;
  createdAt: string;
}

export interface ExerciseSet {
  id: string;
  exercise_id: string;
  set_number: number;
  reps: number;
  weight: number;
  user_id: string;
  created_at: string;
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
  
  // Exercise Sets
  addExerciseSet: (exerciseId: string, setNumber: number, reps: number, weight: number) => Promise<void>;
  updateExerciseSet: (id: string, updates: Partial<ExerciseSet>) => Promise<void>;
  deleteExerciseSet: (id: string) => Promise<void>;
  
  addCardio: (dayId: string, cardioType: Cardio['cardioType'], durationMinutes: number) => Promise<void>;
  updateCardio: (cardioId: string, updates: Partial<Cardio>) => Promise<void>;
  deleteCardio: (cardioId: string) => Promise<void>;
  getWeekById: (id: string) => Week | undefined;
  getDayById: (id: string) => Day | undefined;
}