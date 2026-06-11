import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { User } from '../types/user';
import * as authService from '../services/auth';

const AUTH_KEY = '@habitat_auth';

interface AuthState {
  user: User | null;
  token: string | null;
  loaded: boolean;

  isAuthenticated: boolean;
  isAdmin: boolean;

  loadSession: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => void;
  updatePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  loaded: false,

  get isAuthenticated() {
    return get().user !== null;
  },

  get isAdmin() {
    return get().user?.role === 'admin';
  },

  loadSession: async () => {
    try {
      const raw = await AsyncStorage.getItem(AUTH_KEY);
      if (!raw) {
        set({ loaded: true });
        return;
      }

      const parsed = JSON.parse(raw) as { user?: User; token?: string };
      if (parsed.token && parsed.user) {
        set({ user: parsed.user, token: parsed.token });
      }

      const currentUser = await authService.getCurrentUser();
      await AsyncStorage.setItem(
        AUTH_KEY,
        JSON.stringify({ user: currentUser, token: parsed.token })
      );
      set({ user: currentUser, token: parsed.token ?? null, loaded: true });
    } catch {
      await AsyncStorage.removeItem(AUTH_KEY);
      set({ user: null, token: null, loaded: true });
    }
  },

  login: async (email: string, password: string) => {
    const { token, user } = await authService.login(email, password);
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify({ user, token }));
    set({ user, token });
  },

  register: async (name: string, email: string, password: string) => {
    await authService.register(name, email, password);
  },

  logout: async () => {
    await AsyncStorage.removeItem(AUTH_KEY);
    set({ user: null, token: null });
  },

  updateProfile: (data: Partial<User>) => {
    const { user } = get();
    if (!user) return;

    const updatedUser = { ...user, ...data };
    AsyncStorage.setItem(AUTH_KEY, JSON.stringify({ user: updatedUser, token: get().token }));
    set({ user: updatedUser });
  },

  updatePassword: async (oldPassword: string, newPassword: string) => {
    const { user } = get();
    if (!user) throw new Error('Usuário não autenticado');
    await authService.updatePassword(oldPassword, newPassword);
  },

  forgotPassword: async (email: string) => {
    await authService.forgotPassword(email);
  },
}));
