import React, { useState, useEffect } from 'react';
import { Utensils, Apple, TrendingUp, Plus } from 'lucide-react';
import { useDiet } from '@/contexts/DietContext';
import { MealSection } from '@/components/diet/MealSection';
import { NavBar } from '@/components/layout/NavBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const Diet = () => {
  const { meals, customMealTypes, addCustomMealType, isLoading } = useDiet();
  const { toast } = useToast();
  const [isAddMealTypeDialogOpen, setIsAddMealTypeDialogOpen] = useState(false);
  const [newMealTypeName, setNewMealTypeName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAddMealType = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMealTypeName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, insira um nome para o tipo de refeição.",
        variant: "destructive",
      });
      return;
    }

    await addCustomMealType(newMealTypeName.trim());
    setNewMealTypeName('');
    setIsAddMealTypeDialogOpen(false);
  };

  // Error boundary for diet page
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary-lightest/30 to-primary-cream/40 flex items-center justify-center">
        <div className="text-center space-y-4 p-8">
          <div className="text-destructive text-lg font-semibold">Erro ao carregar dieta</div>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

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

  const mealsByType = customMealTypes.reduce((acc, mealType) => {
    acc[mealType.name] = meals.filter(meal => meal.meal_type === mealType.name);
    return acc;
  }, {} as Record<string, typeof meals>);

  const totalFoods = meals.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-lightest/30 to-primary-cream/40">
      <NavBar />
      
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
                <span>{customMealTypes.length} refeições</span>
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
                <div className="text-2xl font-bold text-accent">{customMealTypes.length}</div>
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
                  {customMealTypes.filter(type => mealsByType[type.name]?.length > 0).length}
                </div>
                <div className="text-xs text-muted-foreground">Configuradas</div>
              </div>
            </div>
          </div>
          
          <div className="workout-card p-4">
            <Dialog open={isAddMealTypeDialogOpen} onOpenChange={setIsAddMealTypeDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full h-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Refeição
                </Button>
              </DialogTrigger>
              
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Adicionar Tipo de Refeição</DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleAddMealType} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="mealTypeName">Nome da Refeição</Label>
                    <Input
                      id="mealTypeName"
                      value={newMealTypeName}
                      onChange={(e) => setNewMealTypeName(e.target.value)}
                      placeholder="Ex: Lanche da manhã, Ceia..."
                      required
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddMealTypeDialogOpen(false)}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" className="flex-1">
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Meal Sections */}
        <div className="space-y-6">
          {customMealTypes.map((mealType) => (
            <MealSection
              key={mealType.name}
              mealType={mealType}
              meals={mealsByType[mealType.name] || []}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Diet;