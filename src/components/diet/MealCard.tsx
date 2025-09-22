import React, { useState } from 'react';
import { Edit3, Trash2, Plus, Clock, ChevronDown, ChevronRight } from 'lucide-react';
import { Meal, FoodSubstitution } from '@/types/diet';
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
  const { updateMeal, deleteMeal, addFoodSubstitution, updateFoodSubstitution, deleteFoodSubstitution } = useDiet();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAddSubstitutionDialogOpen, setIsAddSubstitutionDialogOpen] = useState(false);
  const [editFoodName, setEditFoodName] = useState(meal.food_name);
  const [editQuantity, setEditQuantity] = useState(meal.quantity);
  const [editTime, setEditTime] = useState(meal.time || '');
  
  // Add substitution states
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
  };

  const handleAddSubstitution = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newSubstituteName.trim() || !newSubstituteQuantity.trim()) return;
    
    await addFoodSubstitution(meal.id, newSubstituteName.trim(), newSubstituteQuantity.trim());
    
    setNewSubstituteName('');
    setNewSubstituteQuantity('');
    setIsAddSubstitutionDialogOpen(false);
  };

  const handleUpdateSubstitution = async (id: string, updates: Partial<FoodSubstitution>) => {
    await updateFoodSubstitution(id, updates);
  };

  const handleDeleteSubstitution = async (id: string) => {
    await deleteFoodSubstitution(id);
  };

  const substitutions = meal.substitutions || [];

  return (
    <div className="workout-card group hover:shadow-md transition-all">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3 flex-1">
          {substitutions.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </Button>
          )}
          
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
        </div>

        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Dialog open={isAddSubstitutionDialogOpen} onOpenChange={setIsAddSubstitutionDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={(e) => e.stopPropagation()}
                variant="ghost"
                size="icon"
                className="hover:bg-success/10 hover:text-success h-8 w-8"
                title="Gerenciar substituições"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </DialogTrigger>
            
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Adicionar Substituição - {meal.food_name}</DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleAddSubstitution} className="space-y-4">
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
                
                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddSubstitutionDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1">
                    <Plus className="h-3 w-3 mr-2" />
                    Adicionar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={(e) => e.stopPropagation()}
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
                onClick={(e) => e.stopPropagation()}
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
      
      {/* Substitutions List */}
      {isExpanded && substitutions.length > 0 && (
        <div className="px-4 pb-4 space-y-2 border-t border-border/30">
          <h5 className="text-sm font-medium text-foreground mt-3 mb-2">Substituições:</h5>
          {substitutions.map((substitution) => (
            <div key={substitution.id} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
              <div>
                <span className="text-sm font-medium text-foreground">{substitution.substitute_name}</span>
                <span className="text-xs text-muted-foreground ml-2">({substitution.quantity})</span>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-destructive/10 hover:text-destructive h-6 w-6"
                  onClick={() => handleDeleteSubstitution(substitution.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};