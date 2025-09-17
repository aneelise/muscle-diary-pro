import React from 'react';
import { Utensils, Apple, TrendingUp } from 'lucide-react';
import { useDiet } from '@/contexts/DietContext';
import { MealSection } from '@/components/diet/MealSection';
import { MEAL_TYPES } from '@/types/diet';

const Diet = () => {
  const { meals, isLoading } = useDiet();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary-lightest/30 to-primary-cream/40 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Carregando dieta...</p>
        </div>
      </div>
    );
  }

  const mealsByType = MEAL_TYPES.reduce((acc, mealType) => {
    acc[mealType] = meals.filter(meal => meal.meal_type === mealType);
    return acc;
  }, {} as Record<string, typeof meals>);

  const totalFoods = meals.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-lightest/30 to-primary-cream/40">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-primary-light text-primary-foreground shadow-[var(--shadow-soft)]">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-foreground/10 rounded-xl">
                <Apple className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Minha Dieta
                </h1>
                <p className="text-primary-foreground/80 text-sm">
                  Organize suas refeições e mantenha o foco
                </p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Utensils className="h-4 w-4" />
                <span>{totalFoods} alimentos</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span>5 refeições</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="workout-header text-center mb-2">
            Plano Alimentar
          </h2>
          <p className="text-center text-muted-foreground">
            Configure seus alimentos por refeição e mantenha sua dieta organizada
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="workout-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Utensils className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{totalFoods}</div>
                <div className="text-xs text-muted-foreground">Total de Alimentos</div>
              </div>
            </div>
          </div>
          
          <div className="workout-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <Apple className="h-4 w-4 text-accent" />
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">{MEAL_TYPES.length}</div>
                <div className="text-xs text-muted-foreground">Refeições</div>
              </div>
            </div>
          </div>
          
          <div className="workout-card p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <TrendingUp className="h-4 w-4 text-success" />
              </div>
              <div>
                <div className="text-2xl font-bold text-success">
                  {MEAL_TYPES.filter(type => mealsByType[type].length > 0).length}
                </div>
                <div className="text-xs text-muted-foreground">Configuradas</div>
              </div>
            </div>
          </div>
        </div>

        {/* Meal Sections */}
        <div className="space-y-6">
          {MEAL_TYPES.map((mealType) => (
            <MealSection
              key={mealType}
              mealType={mealType}
              meals={mealsByType[mealType]}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Diet;