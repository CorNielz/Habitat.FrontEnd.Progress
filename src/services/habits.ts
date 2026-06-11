import { api } from './api';
import { Habit } from '../types/habit';

type HabitFrequencyType = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'CUSTOM';

interface ApiHabitResponse {
  id: number;
  title: string;
  description?: string | null;
  frequencyType: HabitFrequencyType;
  frequencyValue: string;
  startDate: string;
  createdAt: string;
  updatedAt: string;
}

interface PagedHabitResponse {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  items: ApiHabitResponse[];
}

export interface CreateHabitRequest {
  title: string;
  description?: string;
  frequencyType: HabitFrequencyType;
  frequencyValue: string;
  startDate: string;
}

export interface UpdateHabitRequest extends CreateHabitRequest {}

export interface HabitFormValues {
  title: string;
  description?: string;
  frequency: Habit['frequency'];
  customFrequencyValue?: string;
  startDate: string;
}

function parseCustomDays(value: string): number[] | undefined {
  const days = value
    .split(',')
    .map((day) => day.trim().toUpperCase())
    .filter(Boolean)
    .map((day) => {
      const lookup: Record<string, number> = {
        SUNDAY: 0,
        MONDAY: 1,
        TUESDAY: 2,
        WEDNESDAY: 3,
        THURSDAY: 4,
        FRIDAY: 5,
        SATURDAY: 6,
      };
      return lookup[day];
    })
    .filter((day) => day !== undefined);

  return days.length > 0 ? days : undefined;
}

function mapFrequencyType(frequencyType: HabitFrequencyType): Habit['frequency'] {
  switch (frequencyType) {
    case 'DAILY':
      return 'daily';
    case 'WEEKLY':
      return 'weekly';
    case 'MONTHLY':
      return 'monthly';
    case 'CUSTOM':
      return 'custom';
    default:
      return 'daily';
  }
}

function mapHabit(response: ApiHabitResponse): Habit {
  return {
    id: String(response.id),
    title: response.title,
    description: response.description ?? undefined,
    frequency: mapFrequencyType(response.frequencyType),
    customDays: response.frequencyType === 'CUSTOM' ? parseCustomDays(response.frequencyValue) : undefined,
    createdAt: response.startDate,
    completedDates: [],
    userId: '',
  };
}

function mapFormToRequest(values: HabitFormValues): CreateHabitRequest {
  const frequencyType: HabitFrequencyType =
    values.frequency === 'daily'
      ? 'DAILY'
      : values.frequency === 'weekly'
        ? 'WEEKLY'
        : values.frequency === 'monthly'
          ? 'MONTHLY'
          : 'CUSTOM';

  return {
    title: values.title.trim(),
    description: values.description?.trim() || undefined,
    frequencyType,
    frequencyValue: values.frequency === 'custom' ? (values.customFrequencyValue?.trim() || 'MONDAY') : '1',
    startDate: values.startDate,
  };
}

async function loadAllHabits(): Promise<Habit[]> {
  const pageSize = 100;
  let page = 1;
  let totalPages = 1;
  const habits: Habit[] = [];

  do {
    const response = (await api.get('/habits', { page, pageSize })) as PagedHabitResponse;
    totalPages = response.totalPages || 1;
    habits.push(...response.items.map(mapHabit));
    page += 1;
  } while (page <= totalPages);

  return habits;
}

export async function listHabits(): Promise<Habit[]> {
  return loadAllHabits();
}

export async function createHabit(values: HabitFormValues): Promise<Habit> {
  const response = (await api.post('/habits', mapFormToRequest(values))) as ApiHabitResponse;
  return mapHabit(response);
}

export async function updateHabit(id: string, values: HabitFormValues): Promise<Habit> {
  const response = (await api.put(`/habits/${id}`, mapFormToRequest(values))) as ApiHabitResponse;
  return mapHabit(response);
}

export async function deleteHabit(id: string): Promise<void> {
  await api.del(`/habits/${id}`);
}

export function toHabitFormValues(habit: Habit): HabitFormValues {
  return {
    title: habit.title,
    description: habit.description || '',
    frequency: habit.frequency,
    customFrequencyValue: habit.customDays?.length
      ? habit.customDays
          .map((day) => ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'][day])
          .join(',')
      : undefined,
    startDate: habit.createdAt,
  };
}
