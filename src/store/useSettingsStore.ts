import { create } from 'zustand';
import { getCurrentUserSettings, updateCurrentUserSettings, UserSettings } from '../services/settings';

interface SettingsState {
  settings: UserSettings | null;
  loaded: boolean;
  loadSettings: () => Promise<void>;
  setSettings: (s: Partial<UserSettings>) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: null,
  loaded: false,
  loadSettings: async () => {
    try {
      const s = await getCurrentUserSettings();
      set({ settings: s, loaded: true });
    } catch (err) {
      console.warn('Failed to load settings', err);
      set({ settings: null, loaded: true });
    }
  },
  setSettings: async (partial) => {
    const current = get().settings;
    if (!current) return;
    const merged = { ...current, ...partial } as UserSettings;
    try {
      const updated = await updateCurrentUserSettings(merged as any);
      set({ settings: updated });
    } catch (err) {
      console.warn('Failed to update settings', err);
    }
  },
}));

export default useSettingsStore;
