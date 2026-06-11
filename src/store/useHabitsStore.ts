import { create } from 'zustand';

import { Habit } from '../types/habit';
import {
  createHabit as createHabitRequest,
  deleteHabit as deleteHabitRequest,
  listHabits,
  updateHabit as updateHabitRequest,
  type HabitFormValues,
} from '../services/habits';

interface HabitsState {
  habits: Habit[];
  loaded: boolean;

  loadHabits: () => Promise<void>;
  addHabit: (habit: HabitFormValues) => Promise<void>;
  updateHabit: (habit: Habit, data: HabitFormValues) => Promise<void>;
  removeHabit: (id: string) => Promise<void>;
  toggleCompletion: (id: string, date: string) => void;
  getStreak: (habit: Habit) => number;
  getCompletionRate: (habit: Habit, days?: number) => number;
  getTodayProgress: () => { completed: number; total: number };
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseDate(value: string): Date | null {
  if (!value) return null;

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function isBeforeOrSame(dateA: Date, dateB: Date) {
  return formatDate(dateA) <= formatDate(dateB);
}

function isDueToday(habit: Habit): boolean {
  return isDueOnDate(habit, new Date());
}

function isDueOnDate(habit: Habit, date: Date): boolean {
  const created = parseDate(habit.createdAt);
  if (!created) return false;

  // A recurring habit cannot appear before the day it was created.
  if (formatDate(date) < formatDate(created)) return false;

  const dayOfWeek = date.getDay();

  switch (habit.frequency) {
    case 'single': {
      return formatDate(created) === formatDate(date);
    }
    case 'daily':
      return true;
    case 'weekly':
      return created.getDay() === dayOfWeek;
    case 'monthly': {
      // repeat on the same day-of-month as creation (or last valid day if shorter month)
      const createdDay = created.getDate();
      const monthDay = date.getDate();
      const daysInThisMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
      const expectedDay = Math.min(createdDay, daysInThisMonth);
      return monthDay === expectedDay;
    }
    case 'custom':
      return habit.customDays?.includes(dayOfWeek) ?? false;
    default:
      return false;
  }
}

function previousDueDate(habit: Habit, date: Date): Date | null {
  const d = new Date(date);
  const created = parseDate(habit.createdAt);
  if (!created) return null;

  switch (habit.frequency) {
    case 'daily':
      d.setDate(d.getDate() - 1);
      return isBeforeOrSame(created, d) ? d : null;
    case 'weekly':
      d.setDate(d.getDate() - 7);
      return isBeforeOrSame(created, d) ? d : null;
    case 'monthly': {
      // go to previous month, try to keep same day-of-month
      const day = created.getDate();
      const prev = new Date(d.getFullYear(), d.getMonth() - 1, 1);
      const daysInPrev = new Date(prev.getFullYear(), prev.getMonth() + 1, 0).getDate();
      prev.setDate(Math.min(day, daysInPrev));
      return isBeforeOrSame(created, prev) ? prev : null;
    }
    case 'custom': {
      // find previous date (1..7 days back) that matches customDays
      for (let i = 1; i <= 7; i++) {
        const cand = new Date(d);
        cand.setDate(d.getDate() - i);
        if (isBeforeOrSame(created, cand) && habit.customDays?.includes(cand.getDay())) return cand;
      }
      return null;
    }
    case 'single':
      return null;
    default:
      return null;
  }
}

export const useHabitsStore = create<HabitsState>((set, get) => ({
  habits: [],
  loaded: false,

  loadHabits: async () => {
    try {
      const habits = await listHabits();
      set({ habits, loaded: true });
    } catch (error) {
      console.error('Error loading habits:', error);
      set({ loaded: true });
    }
  },

  addHabit: async (habit) => {
    const created = await createHabitRequest(habit);
    const updated = [created, ...get().habits];
    set({ habits: updated });
  },

  updateHabit: async (updatedHabit, data) => {
    const updatedFromApi = await updateHabitRequest(updatedHabit.id, data);
    const updated = get().habits.map((h) =>
      h.id === updatedHabit.id ? updatedFromApi : h
    );
    set({ habits: updated });
  },

  removeHabit: async (id) => {
    await deleteHabitRequest(id);
    const updated = get().habits.filter((h) => h.id !== id);
    set({ habits: updated });
  },

  toggleCompletion: (id, date) => {
    const updated = get().habits.map((h) => {
      if (h.id !== id) return h;

      const dates = h.completedDates || [];
      const index = dates.indexOf(date);

      return {
        ...h,
        completedDates: index >= 0
          ? dates.filter((d) => d !== date)
          : [...dates, date],
      };
    });

    set({ habits: updated });
  },

  getStreak: (habit) => {
    const completed = new Set(habit.completedDates || []);
    let streak = 0;
    // start from today (or the most recent due date <= today)
    let checkDate = new Date();
    // if today isn't a due date for this habit, move to the previous due date
    if (!isDueOnDate(habit, checkDate)) {
      const prev = previousDueDate(habit, checkDate);
      if (!prev) return 0;
      checkDate = prev;
    }

    while (true) {
      const ds = formatDate(checkDate);
      if (completed.has(ds)) {
        streak++;
        const prev = previousDueDate(habit, checkDate);
        if (!prev) break;
        checkDate = prev;
      } else {
        break;
      }
    }

    return streak;
  },

  getCompletionRate: (habit, days = 7) => {
    const today = new Date();
    let completed = 0;
    let total = 0;

    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      if (isDueOnDate(habit, date)) {
        total++;
        const dateStr = formatDate(date);
        if ((habit.completedDates || []).includes(dateStr)) completed++;
      }
    }

    return total > 0 ? completed / total : 0;
  },

  getTodayProgress: () => {
    const today = formatDate(new Date());
    const dueHabits = get().habits.filter(isDueToday);
    const completed = dueHabits.filter((h) =>
      (h.completedDates || []).includes(today)
    ).length;

    return { completed, total: dueHabits.length };
  },
}));
