import React, { useState } from 'react';
import { Plus, Utensils, Trash2 } from 'lucide-react';
import { Meal, CustomMealType } from '@/types/diet';
import { useDiet } from '@/contexts/DietContext';
import { MealCard } from './MealCard';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface MealSectionProps {
  mealType: CustomMealType;
  meals: Meal[];
}

export const MealSection: React.FC<MealSectionProps> = ({ mealType, meals }) => {
  const { addMeal, deleteCustomMealType } = useDiet();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [foodName, setFoodName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [time, setTime] = useState('');

  const handleDeleteMealType = async () => {
    await deleteCustomMealType(mealType.id);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!foodName.trim() || !quantity.trim()) return;

    await addMeal(mealType.name, foodName.trim(), quantity.trim(), time.trim() || undefined);
    
    setFoodName('');
    setQuantity('');
    setTime('');
    setIsAddDialogOpen(false);
  };

  const mealTypeLabel = mealType.name;

  return (
    <div className="workout-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Utensils className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{mealTypeLabel}</h3>
            <p className="text-sm text-muted-foreground">
              {meals.length} {meals.length === 1 ? 'alimento' : 'alimentos'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar Alimento - {mealTypeLabel}</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="foodName">Alimento</Label>
                <Input
                  id="foodName"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  placeholder="Ex: Aveia, Frango, Batata doce..."
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantidade</Label>
                <Input
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Ex: 2 fatias, 200g, 1 xícara..."
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time">Horário (opcional)</Label>
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
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

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" variant="destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir Refeição</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir "{mealTypeLabel}"? Todos os alimentos associados também serão removidos. Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteMealType} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        </div>
      </div>

      <div className="space-y-3">
        {meals.length === 0 ? (
          <div className="text-center py-8 px-4 border border-dashed border-border rounded-lg bg-background/50">
            <Utensils className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Nenhum alimento cadastrado para {mealTypeLabel.toLowerCase()}
            </p>
          </div>
        ) : (
          meals.map((meal) => (
            <MealCard key={meal.id} meal={meal} />
          ))
        )}
      </div>
    </div>
  );
};