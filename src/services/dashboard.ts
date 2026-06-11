import { api } from './api';
import type { DashboardPeriod } from './settings';

export interface DashboardSummary {
  period: DashboardPeriod;
  totalHabits: number;
  completedToday: number;
  completionRate: number;
  currentStreak: number;
  notesCount: number;
}

export interface DashboardHistoryItem {
  date: string;
  completedHabits: number;
  completionRate: number;
}

export interface DashboardHistory {
  period: DashboardPeriod;
  from: string;
  to: string;
  items: DashboardHistoryItem[];
}

export function getDashboardSummary(period?: DashboardPeriod): Promise<DashboardSummary> {
  return api.get('/dashboard', period ? { period } : undefined) as Promise<DashboardSummary>;
}

export function getDashboardHistory(
  period?: DashboardPeriod,
  from?: string,
  to?: string
): Promise<DashboardHistory> {
  return api.get('/dashboard/history', { period, from, to }) as Promise<DashboardHistory>;
}
