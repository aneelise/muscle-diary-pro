export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      cardio: {
        Row: {
          cardio_type: string
          created_at: string
          day_id: string
          duration_minutes: number
          id: string
          user_id: string
        }
        Insert: {
          cardio_type: string
          created_at?: string
          day_id: string
          duration_minutes: number
          id?: string
          user_id: string
        }
        Update: {
          cardio_type?: string
          created_at?: string
          day_id?: string
          duration_minutes?: number
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cardio_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_meal_types: {
        Row: {
          created_at: string
          id: string
          name: string
          order_index: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          order_index: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          order_index?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "custom_meal_types_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      days: {
        Row: {
          date: string | null
          dayName: string | null
          id: string
          user_id: string | null
          weekId: string
        }
        Insert: {
          date?: string | null
          dayName?: string | null
          id?: string
          user_id?: string | null
          weekId: string
        }
        Update: {
          date?: string | null
          dayName?: string | null
          id?: string
          user_id?: string | null
          weekId?: string
        }
        Relationships: [
          {
            foreignKeyName: "days_weekId_fkey"
            columns: ["weekId"]
            isOneToOne: false
            referencedRelation: "weeks"
            referencedColumns: ["id"]
          },
        ]
      }
      diary_entries: {
        Row: {
          cardio_done: boolean | null
          created_at: string | null
          date: string
          diary_text: string | null
          diet_followed: boolean | null
          free_meal: boolean | null
          free_meal_description: string | null
          id: string
          notes: string | null
          user_id: string
          water_goal: boolean | null
          workout_done: boolean | null
        }
        Insert: {
          cardio_done?: boolean | null
          created_at?: string | null
          date: string
          diary_text?: string | null
          diet_followed?: boolean | null
          free_meal?: boolean | null
          free_meal_description?: string | null
          id?: string
          notes?: string | null
          user_id: string
          water_goal?: boolean | null
          workout_done?: boolean | null
        }
        Update: {
          cardio_done?: boolean | null
          created_at?: string | null
          date?: string
          diary_text?: string | null
          diet_followed?: boolean | null
          free_meal?: boolean | null
          free_meal_description?: string | null
          id?: string
          notes?: string | null
          user_id?: string
          water_goal?: boolean | null
          workout_done?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "diary_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      evolution_exercise_sets: {
        Row: {
          created_at: string
          evolution_exercise_id: string
          id: string
          reps: number
          set_number: number
          user_id: string
          weight: number
        }
        Insert: {
          created_at?: string
          evolution_exercise_id: string
          id?: string
          reps: number
          set_number: number
          user_id: string
          weight: number
        }
        Update: {
          created_at?: string
          evolution_exercise_id?: string
          id?: string
          reps?: number
          set_number?: number
          user_id?: string
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "evolution_exercise_sets_evolution_exercise_id_fkey"
            columns: ["evolution_exercise_id"]
            isOneToOne: false
            referencedRelation: "evolution_exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evolution_exercise_sets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      evolution_exercises: {
        Row: {
          created_at: string
          day_of_week: string
          evolution_week_id: string
          id: string
          name: string
          notes: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          day_of_week: string
          evolution_week_id: string
          id?: string
          name: string
          notes?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          day_of_week?: string
          evolution_week_id?: string
          id?: string
          name?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "evolution_exercises_evolution_week_id_fkey"
            columns: ["evolution_week_id"]
            isOneToOne: false
            referencedRelation: "evolution_weeks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evolution_exercises_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      evolution_weeks: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          order_index: number
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          order_index?: number
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          order_index?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "evolution_weeks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      exercise_sets: {
        Row: {
          created_at: string
          exercise_id: string
          id: string
          reps: number
          set_number: number
          user_id: string
          weight: number
        }
        Insert: {
          created_at?: string
          exercise_id: string
          id?: string
          reps: number
          set_number: number
          user_id: string
          weight: number
        }
        Update: {
          created_at?: string
          exercise_id?: string
          id?: string
          reps?: number
          set_number?: number
          user_id?: string
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "exercise_sets_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_sets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      exercises: {
        Row: {
          createdAt: string | null
          dayId: string | null
          exerciseId: string | null
          exerciseName: string | null
          id: string
          muscleGroup: string | null
          notes: string | null
          reps: number | null
          sets: number | null
          user_id: string | null
          weight: number | null
        }
        Insert: {
          createdAt?: string | null
          dayId?: string | null
          exerciseId?: string | null
          exerciseName?: string | null
          id?: string
          muscleGroup?: string | null
          notes?: string | null
          reps?: number | null
          sets?: number | null
          user_id?: string | null
          weight?: number | null
        }
        Update: {
          createdAt?: string | null
          dayId?: string | null
          exerciseId?: string | null
          exerciseName?: string | null
          id?: string
          muscleGroup?: string | null
          notes?: string | null
          reps?: number | null
          sets?: number | null
          user_id?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "exercises_dayId_fkey"
            columns: ["dayId"]
            isOneToOne: false
            referencedRelation: "days"
            referencedColumns: ["id"]
          },
        ]
      }
      food_substitutions: {
        Row: {
          created_at: string
          id: string
          meal_id: string
          quantity: string
          substitute_name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          meal_id: string
          quantity: string
          substitute_name: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          meal_id?: string
          quantity?: string
          substitute_name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "food_substitutions_meal_id_fkey"
            columns: ["meal_id"]
            isOneToOne: false
            referencedRelation: "meals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "food_substitutions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      meals: {
        Row: {
          created_at: string | null
          food_name: string
          id: string
          meal_type: string
          quantity: string
          time: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          food_name: string
          id?: string
          meal_type: string
          quantity: string
          time?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          food_name?: string
          id?: string
          meal_type?: string
          quantity?: string
          time?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      weeks: {
        Row: {
          createdAt: string | null
          description: string | null
          id: string
          name: string
          user_id: string | null
        }
        Insert: {
          createdAt?: string | null
          description?: string | null
          id?: string
          name: string
          user_id?: string | null
        }
        Update: {
          createdAt?: string | null
          description?: string | null
          id?: string
          name?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "weeks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      uid: {
        Args: {}
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}