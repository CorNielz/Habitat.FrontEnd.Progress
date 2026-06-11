import { api } from './api';

export type ThemeOption = 'SYSTEM' | 'LIGHT' | 'DARK';
export type DashboardPeriod = 'WEEK' | 'MONTH' | 'YEAR';
export type FirstDayOfWeek = 'SUNDAY' | 'MONDAY';

export interface UserSettings {
  theme: ThemeOption;
  defaultDashboardPeriod: DashboardPeriod;
  firstDayOfWeek: FirstDayOfWeek;
  showHomeSummary: boolean;
  updatedAt?: string;
}

export interface UpdateSettingsRequest {
  theme: ThemeOption;
  defaultDashboardPeriod: DashboardPeriod;
  firstDayOfWeek: FirstDayOfWeek;
  showHomeSummary: boolean;
}

export async function getCurrentUserSettings(): Promise<UserSettings> {
  return api.get('/settings') as Promise<UserSettings>;
}

export async function updateCurrentUserSettings(
  data: UpdateSettingsRequest
): Promise<UserSettings> {
  return api.put('/settings', data) as Promise<UserSettings>;
}
