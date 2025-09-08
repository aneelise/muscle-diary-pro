export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  equipment?: string;
}

export interface WorkoutSet {
  id: string;
  exerciseId: string;
  exerciseName: string;
  sets: number;
  reps: number;
  weight?: number;
  date: string;
  dayOfWeek: DayOfWeek;
  muscleCategory: string;
}

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface DaySchedule {
  day: DayOfWeek;
  muscleCategory: string;
  exercises: WorkoutSet[];
}

export interface WorkoutContextType {
  workouts: WorkoutSet[];
  addWorkout: (workout: Omit<WorkoutSet, 'id' | 'date'>) => void;
  deleteWorkout: (id: string) => void;
  getWorkoutsByDay: (day: DayOfWeek) => WorkoutSet[];
}