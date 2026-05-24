export interface Habit {
  id: string;
  title: string;
  description?: string;
  frequency: 'single' | 'daily' | 'weekly' | 'monthly' | 'custom';
  customDays?: number[]; // 0=Dom, 1=Seg, ... 6=Sáb
  color?: string;
  icon?: string;
  createdAt: string;
  completedDates: string[]; // ['2026-05-24', '2026-05-23']
  userId: string;
}

export const FREQUENCY_LABELS: Record<Habit['frequency'], string> = {
  single: 'Único',
  daily: 'Diário',
  weekly: 'Semanal',
  monthly: 'Mensal',
  custom: 'Personalizado',
};

export const WEEKDAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export const HABIT_COLORS = [
  '#008000', '#2196F3', '#FF9800', '#9C27B0',
  '#F44336', '#00BCD4', '#795548', '#607D8B',
];

export const HABIT_ICONS = [
  'leaf', 'water', 'barbell', 'book', 'heart',
  'walk', 'bed', 'nutrition', 'fitness', 'sunny',
];
