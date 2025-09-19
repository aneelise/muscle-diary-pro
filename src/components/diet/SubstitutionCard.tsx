import React, { useState } from 'react';
import { Edit3, Trash2, ArrowRight } from 'lucide-react';
import { FoodSubstitution } from '@/types/evolution';
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

interface SubstitutionCardProps {
  substitution: FoodSubstitution;
  onUpdate: (id: string, updates: Partial<FoodSubstitution>) => void;
  onDelete: (id: string) => void;
}

export const SubstitutionCard: React.FC<SubstitutionCardProps> = ({ 
  substitution, 
  onUpdate, 
  onDelete 
}) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editName, setEditName] = useState(substitution.substituteName);
  const [editQuantity, setEditQuantity] = useState(substitution.quantity);

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editName.trim() || !editQuantity.trim()) return;

    onUpdate(substitution.id, {
      substituteName: editName.trim(),
      quantity: editQuantity.trim(),
    });

    setIsEditDialogOpen(false);
  };

  const handleDelete = () => {
    onDelete(substitution.id);
  };

  return (
    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-muted">
      <div className="flex items-center gap-2">
        <ArrowRight className="h-3 w-3 text-muted-foreground" />
        <div>
          <span className="text-sm font-medium text-foreground">{substitution.substituteName}</span>
          <span className="text-xs text-muted-foreground ml-2">({substitution.quantity})</span>
        </div>
      </div>

      <div className="flex gap-1">
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-accent/10 hover:text-accent h-7 w-7"
            >
              <Edit3 className="h-3 w-3" />
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Substituição</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleEdit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="editName">Alimento Substituto</Label>
                <Input
                  id="editName"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editQuantity">Quantidade</Label>
                <Input
                  id="editQuantity"
                  value={editQuantity}
                  onChange={(e) => setEditQuantity(e.target.value)}
                  placeholder="Ex: 2 fatias, 20g..."
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
              className="hover:bg-destructive/10 hover:text-destructive h-7 w-7"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir Substituição</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir "{substitution.substituteName}"?
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
  );
};