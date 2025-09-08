import { Exercise } from '@/types/workout';

export const exerciseDatabase: Exercise[] = [
  // Quadríceps
  { id: '1', name: 'Agachamento Livre', muscleGroup: 'Quadríceps', equipment: 'Barra' },
  { id: '2', name: 'Leg Press', muscleGroup: 'Quadríceps', equipment: 'Máquina' },
  { id: '3', name: 'Extensão de Pernas', muscleGroup: 'Quadríceps', equipment: 'Máquina' },
  { id: '4', name: 'Agachamento Búlgaro', muscleGroup: 'Quadríceps', equipment: 'Halteres' },
  { id: '5', name: 'Avanço', muscleGroup: 'Quadríceps', equipment: 'Halteres' },

  // Costas
  { id: '6', name: 'Barra Fixa', muscleGroup: 'Costas', equipment: 'Peso Corporal' },
  { id: '7', name: 'Puxada Alta', muscleGroup: 'Costas', equipment: 'Máquina' },
  { id: '8', name: 'Remada Curvada', muscleGroup: 'Costas', equipment: 'Barra' },
  { id: '9', name: 'Remada Sentado', muscleGroup: 'Costas', equipment: 'Máquina' },
  { id: '10', name: 'Levantamento Terra', muscleGroup: 'Costas', equipment: 'Barra' },

  // Peito
  { id: '11', name: 'Supino Reto', muscleGroup: 'Peito', equipment: 'Barra' },
  { id: '12', name: 'Supino Inclinado', muscleGroup: 'Peito', equipment: 'Halteres' },
  { id: '13', name: 'Flexão de Braços', muscleGroup: 'Peito', equipment: 'Peso Corporal' },
  { id: '14', name: 'Fly Peck Deck', muscleGroup: 'Peito', equipment: 'Máquina' },
  { id: '15', name: 'Crucifixo Reto', muscleGroup: 'Peito', equipment: 'Halteres' },

  // Ombros
  { id: '16', name: 'Desenvolvimento Militar', muscleGroup: 'Ombros', equipment: 'Barra' },
  { id: '17', name: 'Elevação Lateral', muscleGroup: 'Ombros', equipment: 'Halteres' },
  { id: '18', name: 'Elevação Frontal', muscleGroup: 'Ombros', equipment: 'Halteres' },
  { id: '19', name: 'Remada Alta', muscleGroup: 'Ombros', equipment: 'Barra' },
  { id: '20', name: 'Fly Inverso', muscleGroup: 'Ombros', equipment: 'Halteres' },

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
  { id: '30', name: 'Kickback', muscleGroup: 'Tríceps', equipment: 'Halteres' },

  // Posterior/Glúteos
  { id: '31', name: 'Stiff', muscleGroup: 'Posterior', equipment: 'Barra' },
  { id: '32', name: 'Mesa Flexora', muscleGroup: 'Posterior', equipment: 'Máquina' },
  { id: '33', name: 'Glúteo 4 Apoios', muscleGroup: 'Posterior', equipment: 'Peso Corporal' },
  { id: '34', name: 'Elevação Pélvica', muscleGroup: 'Posterior', equipment: 'Barra' },
  { id: '35', name: 'Cadeira Abdutora', muscleGroup: 'Posterior', equipment: 'Máquina' },
];

export const muscleCategories = [
  'Quadríceps',
  'Costas', 
  'Peito',
  'Ombros',
  'Bíceps',
  'Tríceps',
  'Posterior'
];