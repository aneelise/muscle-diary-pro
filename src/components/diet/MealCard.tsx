import React, { useState } from 'react';
import { Edit3, Trash2, Plus, Clock } from 'lucide-react';
import { Meal, MEAL_TYPE_LABELS } from '@/types/diet';
import { useDiet } from '@/contexts/DietContext';
import { SubstitutionCard } from './SubstitutionCard';
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
  const [isSubstitutionsDialogOpen, setIsSubstitutionsDialogOpen] = useState(false);
  const [editFoodName, setEditFoodName] = useState(meal.food_name);
  const [editQuantity, setEditQuantity] = useState(meal.quantity);
  const [editTime, setEditTime] = useState(meal.time || '');
  
  // Substitutions state (using localStorage for now)
  const [substitutions, setSubstitutions] = useState(() => {
    const saved = localStorage.getItem(`substitutions-${meal.id}`);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [newSubstituteName, setNewSubstituteName] = useState('');
  const [newSubstituteQuantity, setNewSubstituteQuantity] = useState('');

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editFoodName.trim() || !editQuantity.trim()) return;

    await updateMeal(meal.id, {
      food_name: editFoodName.trim(),
      quantity: editQuantity.trim(),
      time: editTime.trim() || undefined,
    });

    setIsEditDialogOpen(false);
  };

  const handleDelete = async () => {
    await deleteMeal(meal.id);
    // Clean up substitutions
    localStorage.removeItem(`substitutions-${meal.id}`);
  };

  const handleAddSubstitution = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newSubstituteName.trim() || !newSubstituteQuantity.trim()) return;
    
    const newSubstitution = {
      id: crypto.randomUUID(),
      originalFoodId: meal.id,
      substituteName: newSubstituteName.trim(),
      quantity: newSubstituteQuantity.trim(),
      userId: meal.user_id,
      createdAt: new Date().toISOString()
    };
    
    const updated = [...substitutions, newSubstitution];
    setSubstitutions(updated);
    localStorage.setItem(`substitutions-${meal.id}`, JSON.stringify(updated));
    
    setNewSubstituteName('');
    setNewSubstituteQuantity('');
  };

  const handleUpdateSubstitution = (id: string, updates: any) => {
    const updated = substitutions.map((sub: any) => 
      sub.id === id ? { ...sub, ...updates } : sub
    );
    setSubstitutions(updated);
    localStorage.setItem(`substitutions-${meal.id}`, JSON.stringify(updated));
  };

  const handleDeleteSubstitution = (id: string) => {
    const updated = substitutions.filter((sub: any) => sub.id !== id);
    setSubstitutions(updated);
    localStorage.setItem(`substitutions-${meal.id}`, JSON.stringify(updated));
  };

  return (
    <div className="workout-card p-4 group hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h4 className="font-medium text-foreground">{meal.food_name}</h4>
          <p className="text-sm text-muted-foreground">{meal.quantity}</p>
          {meal.time && (
            <div className="flex items-center gap-1 text-xs text-accent mt-1">
              <Clock className="h-3 w-3" />
              <span>{meal.time}</span>
            </div>
          )}
          {substitutions.length > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              {substitutions.length} substituição{substitutions.length !== 1 ? 'ões' : ''}
            </p>
          )}
        </div>

        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Dialog open={isSubstitutionsDialogOpen} onOpenChange={setIsSubstitutionsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-success/10 hover:text-success h-8 w-8"
                title="Gerenciar substituições"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </DialogTrigger>
            
            <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Substituições - {meal.food_name}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                {/* Add new substitution */}
                <form onSubmit={handleAddSubstitution} className="space-y-3 p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium text-sm">Adicionar Substituição</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="substituteName">Alimento</Label>
                      <Input
                        id="substituteName"
                        value={newSubstituteName}
                        onChange={(e) => setNewSubstituteName(e.target.value)}
                        placeholder="Ex: torrada"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="substituteQuantity">Quantidade</Label>
                      <Input
                        id="substituteQuantity"
                        value={newSubstituteQuantity}
                        onChange={(e) => setNewSubstituteQuantity(e.target.value)}
                        placeholder="Ex: 2 fatias"
                      />
                    </div>
                  </div>
                  <Button type="submit" size="sm" className="w-full">
                    <Plus className="h-3 w-3 mr-2" />
                    Adicionar
                  </Button>
                </form>
                
                {/* List substitutions */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Substituições Cadastradas</h4>
                  {substitutions.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Nenhuma substituição cadastrada
                    </p>
                  ) : (
                    substitutions.map((substitution: any) => (
                      <SubstitutionCard
                        key={substitution.id}
                        substitution={substitution}
                        onUpdate={handleUpdateSubstitution}
                        onDelete={handleDeleteSubstitution}
                      />
                    ))
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
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
                
                <div className="space-y-2">
                  <Label htmlFor="editTime">Horário (opcional)</Label>
                  <Input
                    id="editTime"
                    type="time"
                    value={editTime}
                    onChange={(e) => setEditTime(e.target.value)}
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