import React from 'react';
import { Timer, Trash2 } from 'lucide-react';
import { Cardio } from '@/types/week';
import { useWeek } from '@/contexts/WeekContext';
import { Button } from '@/components/ui/button';
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

interface CardioCardProps {
  cardio: Cardio;
}

const cardioTypeLabels = {
  esteira: 'Esteira',
  escada: 'Escada', 
  bike: 'Bike',
  eliptico: 'Elíptico'
};

export const CardioCard: React.FC<CardioCardProps> = ({ cardio }) => {
  const { deleteCardio } = useWeek();

  const handleDelete = () => {
    deleteCardio(cardio.id);
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-accent/5 to-accent/10 rounded-lg border border-accent/20">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-accent/20 rounded-full">
          <Timer className="h-3 w-3 text-accent" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">
            {cardioTypeLabels[cardio.cardioType]}
          </p>
          <p className="text-xs text-muted-foreground">
            {cardio.durationMinutes} minutos
          </p>
        </div>
      </div>

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
            <AlertDialogTitle>Excluir Cardio</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este cardio de {cardioTypeLabels[cardio.cardioType]} ({cardio.durationMinutes} min)?
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
  );
};