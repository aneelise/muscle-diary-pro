import { Exercise } from '@/types/week';

export interface ExerciseDatabase {
  id: string;
  name: string;
  muscleGroup: string;
  equipment?: string;
}

export const exerciseDatabase: ExerciseDatabase[] = [
  // Quadríceps
  { id: '1', name: 'Agachamento Livre', muscleGroup: 'Quadríceps', equipment: 'Barra' },
  { id: '2', name: 'Leg Press', muscleGroup: 'Quadríceps', equipment: 'Máquina' },
  { id: '3', name: 'Cadeira Extensora', muscleGroup: 'Quadríceps', equipment: 'Máquina' },
  { id: '4', name: 'Agachamento Hack', muscleGroup: 'Quadríceps', equipment: 'Máquina' },
  { id: '5', name: 'Bulgaro', muscleGroup: 'Quadríceps', equipment: 'Smith' },
  { id: '36', name: 'Afundo', muscleGroup: 'Quadríceps', equipment: 'Smith' },

  // Costas
  { id: '6', name: 'Barra Fixa', muscleGroup: 'Costas', equipment: 'Peso Corporal' },
  { id: '7', name: 'Puxada Fechada Triangulo', muscleGroup: 'Costas', equipment: 'Máquina' },
  { id: '8', name: 'Pulldown Polia', muscleGroup: 'Costas', equipment: 'Máquina' },
  { id: '9', name: 'Remada Baixa Triangulo', muscleGroup: 'Costas', equipment: 'Máquina' },
  { id: '10', name: 'Levantamento Terra', muscleGroup: 'Costas', equipment: 'Barra' },

  // Peito
  { id: '11', name: 'Supino Reto', muscleGroup: 'Peito', equipment: 'Barra' },
  { id: '12', name: 'Supino Inclinado', muscleGroup: 'Peito', equipment: 'Halteres' },
  { id: '13', name: 'Flexão de Braços', muscleGroup: 'Peito', equipment: 'Peso Corporal' },
  { id: '14', name: 'Fly Peck Deck', muscleGroup: 'Peito', equipment: 'Máquina' },
  { id: '15', name: 'Crucifixo Reto', muscleGroup: 'Peito', equipment: 'Halteres' },

  // Ombros
  { id: '16', name: 'Desenvolvimento Halteres', muscleGroup: 'Ombros', equipment: 'Halteres' },
  { id: '17', name: 'Elevação Lateral Halter', muscleGroup: 'Ombros', equipment: 'Halteres' },
  { id: '18', name: 'Elevação Lateral Articulada', muscleGroup: 'Ombros', equipment: 'Máquina' },
  { id: '19', name: 'FacePull Corda', muscleGroup: 'Ombros', equipment: 'Máquina' },
  { id: '20', name: 'Crucifixo Inverso', muscleGroup: 'Ombros', equipment: 'Máquina' },

  // Bíceps
  { id: '21', name: 'Rosca Direta', muscleGroup: 'Bíceps', equipment: 'Barra' },
  { id: '22', name: 'Rosca Martelo', muscleGroup: 'Bíceps', equipment: 'Halteres' },
  { id: '23', name: 'Rosca Concentrada', muscleGroup: 'Bíceps', equipment: 'Halteres' },
  { id: '24', name: 'Rosca Scott', muscleGroup: 'Bíceps', equipment: 'Barra' },
  { id: '25', name: 'Rosca Punho', muscleGroup: 'Bíceps', equipment: 'Halteres' },

  // Tríceps
  { id: '26', name: 'Tríceps Testa', muscleGroup: 'Tríceps', equipment: 'Barra' },
  { id: '27', name: 'Tríceps Pulley', muscleGroup: 'Tríceps', equipment: 'Máquina' },
  { id: '28', name: 'Mergulho', muscleGroup: 'Tríceps', equipment: 'Peso Corporal' },
  { id: '29', name: 'Tríceps Francês', muscleGroup: 'Tríceps', equipment: 'Halteres' },
  { id: '30', name: 'Tríceps Polia', muscleGroup: 'Tríceps', equipment: 'Halteres' },

  // Posterior/Glúteos
  { id: '31', name: 'Stiff', muscleGroup: 'Posterior', equipment: 'Barra' },
  { id: '32', name: 'Mesa Flexora', muscleGroup: 'Posterior', equipment: 'Máquina' },
  { id: '33', name: 'Levantamento Terra Sumõ', muscleGroup: 'Posterior', equipment: 'Barra' },
  { id: '34', name: 'Elevação Pélvica', muscleGroup: 'Gluteo', equipment: 'Máquina' },
  { id: '35', name: 'Cadeira Abdutora', muscleGroup: 'Gluteo', equipment: 'Máquina' },
  { id: '37', name: 'Cadeira flexora tronco inclinado', muscleGroup: 'Posterior', equipment: 'Máquina' },
  { id: '38', name: 'Extensão Quadril Cabo Cruzado', muscleGroup: 'Gluteo', equipment: 'Máquina' },
  { id: '39', name: 'Abdução Quadril Polia', muscleGroup: 'Gluteo', equipment: 'Máquina' },
];

export const muscleCategories = [
  'Quadríceps',
  'Costas e Bíceps', 
  'Peito',
  'Ombros e Tríceps',
  'Posterior',
  'Gluteo',
];