import React, { useState } from 'react';
import { Edit3, Trash2, Plus } from 'lucide-react';
import { Meal, MEAL_TYPE_LABELS } from '@/types/diet';
import { useDiet } from '@/contexts/DietContext';
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

interface MealCardProps {
  meal: Meal;
}

export const MealCard: React.FC<MealCardProps> = ({ meal }) => {
  const { updateMeal, deleteMeal } = useDiet();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editFoodName, setEditFoodName] = useState(meal.food_name);
  const [editQuantity, setEditQuantity] = useState(meal.quantity);

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editFoodName.trim() || !editQuantity.trim()) return;

    await updateMeal(meal.id, {
      food_name: editFoodName.trim(),
      quantity: editQuantity.trim(),
    });

    setIsEditDialogOpen(false);
  };

  const handleDelete = async () => {
    await deleteMeal(meal.id);
  };

  return (
    <div className="workout-card p-4 group hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h4 className="font-medium text-foreground">{meal.food_name}</h4>
          <p className="text-sm text-muted-foreground">{meal.quantity}</p>
        </div>

        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-accent/10 hover:text-accent h-8 w-8"
              >
                <Edit3 className="h-3 w-3" />
              </Button>
            </DialogTrigger>
            
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Editar Alimento</DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleEdit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="editFoodName">Alimento</Label>
                  <Input
                    id="editFoodName"
                    value={editFoodName}
                    onChange={(e) => setEditFoodName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="editQuantity">Quantidade</Label>
                  <Input
                    id="editQuantity"
                    value={editQuantity}
                    onChange={(e) => setEditQuantity(e.target.value)}
                    placeholder="Ex: 2 fatias, 200g, 1 xícara..."
                    required
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1">
                    Salvar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-destructive/10 hover:text-destructive h-8 w-8"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir Alimento</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir "{meal.food_name}"?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};