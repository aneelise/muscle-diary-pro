import React, { useState } from 'react';
import { Plus, Timer } from 'lucide-react';
import { useWeek } from '@/contexts/WeekContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Cardio } from '@/types/week';

interface CardioFormProps {
  dayId: string;
}

const cardioTypes = [
  { value: 'esteira', label: 'Esteira' },
  { value: 'escada', label: 'Escada' },
  { value: 'bike', label: 'Bike' },
  { value: 'eliptico', label: 'Elíptico' },
] as const;

export const CardioForm: React.FC<CardioFormProps> = ({ dayId }) => {
  const { addCardio } = useWeek();
  const [isOpen, setIsOpen] = useState(false);
  const [cardioType, setCardioType] = useState<Cardio['cardioType']>('esteira');
  const [durationMinutes, setDurationMinutes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const duration = parseInt(durationMinutes);
    if (!duration || duration <= 0) return;

    await addCardio(dayId, cardioType, duration);
    
    setCardioType('esteira');
    setDurationMinutes('');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="w-full border-accent/20 hover:border-accent hover:bg-accent/10"
        >
          <Timer className="h-3 w-3 mr-2" />
          Adicionar Cardio
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Cardio</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardioType">Tipo de Cardio</Label>
            <Select value={cardioType} onValueChange={(value: Cardio['cardioType']) => setCardioType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {cardioTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="duration">Duração (minutos)</Label>
            <Input
              id="duration"
              type="number"
              min="1"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
              placeholder="Ex: 30"
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
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
  );
};