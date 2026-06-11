import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../styles/colors';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from '../components/Button';
import {
  getCurrentUserSettings,
  updateCurrentUserSettings,
  type UserSettings,
  type ThemeOption,
  type DashboardPeriod,
  type FirstDayOfWeek,
} from '../services/settings';

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'SYSTEM',
  defaultDashboardPeriod: 'MONTH',
  firstDayOfWeek: 'MONDAY',
  showHomeSummary: true,
};

export function SettingsScreen({ navigation }: any) {
  const logout = useAuthStore((state) => state.logout);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadSettings() {
      try {
        setLoading(true);
        const remoteSettings = await getCurrentUserSettings();
        if (active) setSettings(remoteSettings);
      } catch {
        if (active) setSettings(DEFAULT_SETTINGS);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadSettings();

    return () => {
      active = false;
    };
  }, []);

  function cycleTheme() {
    const order: ThemeOption[] = ['SYSTEM', 'LIGHT', 'DARK'];
    const currentIndex = order.indexOf(settings.theme);
    const nextTheme = order[(currentIndex + 1) % order.length];
    setSettings((current) => ({ ...current, theme: nextTheme }));
  }

  function cycleDashboardPeriod() {
    const order: DashboardPeriod[] = ['WEEK', 'MONTH', 'YEAR'];
    const currentIndex = order.indexOf(settings.defaultDashboardPeriod);
    const nextPeriod = order[(currentIndex + 1) % order.length];
    setSettings((current) => ({ ...current, defaultDashboardPeriod: nextPeriod }));
  }

  function cycleFirstDayOfWeek() {
    const order: FirstDayOfWeek[] = ['MONDAY', 'SUNDAY'];
    const currentIndex = order.indexOf(settings.firstDayOfWeek);
    const nextDay = order[(currentIndex + 1) % order.length];
    setSettings((current) => ({ ...current, firstDayOfWeek: nextDay }));
  }

  async function handleSaveSettings() {
    try {
      setSaving(true);
      const saved = await updateCurrentUserSettings(settings);
      setSettings(saved);
      Alert.alert('Sucesso', 'Configurações salvas');
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  }

  function handleLogout() {
    Alert.alert('Sair', 'Deseja realmente sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: () => logout(),
      },
    ]);
  }

  return (
    <View style={styles.container}>
        {loading && <Text style={styles.loadingText}>Carregando preferências...</Text>}

        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferências</Text>

          <TouchableOpacity style={styles.menuItem} onPress={cycleTheme} disabled={loading}>
            <Ionicons name="notifications-outline" size={22} color={colors.text} />
            <Text style={styles.menuText}>Notificações</Text>
            <Text style={styles.menuValue}>Em breve</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={cycleTheme} disabled={loading}>
            <Ionicons name="moon-outline" size={22} color={colors.text} />
            <Text style={styles.menuText}>Tema</Text>
            <Text style={styles.menuValue}>{settings.theme}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={cycleDashboardPeriod} disabled={loading}>
            <Ionicons name="calendar-outline" size={22} color={colors.text} />
            <Text style={styles.menuText}>Período padrão</Text>
            <Text style={styles.menuValue}>{settings.defaultDashboardPeriod}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={cycleFirstDayOfWeek} disabled={loading}>
            <Ionicons name="today-outline" size={22} color={colors.text} />
            <Text style={styles.menuText}>Primeiro dia da semana</Text>
            <Text style={styles.menuValue}>{settings.firstDayOfWeek}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setSettings((current) => ({ ...current, showHomeSummary: !current.showHomeSummary }))}
            disabled={loading}
          >
            <Ionicons name="home-outline" size={22} color={colors.text} />
            <Text style={styles.menuText}>Resumo da Home</Text>
            <Text style={styles.menuValue}>{settings.showHomeSummary ? 'Ativo' : 'Oculto'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre</Text>

          <View style={styles.menuItem}>
            <Ionicons name="information-circle-outline" size={22} color={colors.text} />
            <Text style={styles.menuText}>Versão</Text>
            <Text style={styles.menuValue}>1.0.0</Text>
          </View>
        </View>

        <Button title="Salvar preferências" onPress={handleSaveSettings} loading={saving} />

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 72,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },

  topTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
  },

  loadingText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },

  section: {
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 12,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginBottom: 8,
  },

  menuText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },

  menuValue: {
    fontSize: 14,
    color: colors.textSecondary,
  },

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: 14,
    marginTop: 16,
  },

  logoutText: {
    color: colors.danger,
    fontSize: 16,
    fontWeight: '600',
  },
});
