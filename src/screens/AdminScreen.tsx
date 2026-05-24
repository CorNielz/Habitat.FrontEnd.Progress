import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { colors } from '../styles/colors';
import { useAuthStore } from '../store/useAuthStore';
import { useHabitsStore } from '../store/useHabitsStore';
import { useNotesStore } from '../store/useNotesStore';

interface SystemStats {
  totalUsers: number;
  totalHabits: number;
  totalNotes: number;
}

export function AdminScreen({ navigation }: any) {
  const user = useAuthStore((state) => state.user);
  const habits = useHabitsStore((state) => state.habits);
  const notes = useNotesStore((state) => state.notes);
  const [stats, setStats] = useState<SystemStats>({
    totalUsers: 2,
    totalHabits: 0,
    totalNotes: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const habitsRaw = await AsyncStorage.getItem('@habitat_habits');
      const notesRaw = await AsyncStorage.getItem('@habitat_notes');
      const authRaw = await AsyncStorage.getItem('@habitat_auth');

      setStats({
        totalUsers: 2, // Mock
        totalHabits: habitsRaw ? JSON.parse(habitsRaw).length : 0,
        totalNotes: notesRaw ? JSON.parse(notesRaw).length : 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }

  function handleClearData() {
    Alert.alert(
      'Limpar dados',
      'Isso removerá todos os hábitos e anotações. Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.multiRemove([
              '@habitat_habits',
              '@habitat_notes',
            ]);
            loadStats();
            Alert.alert('Sucesso', 'Dados limpos com sucesso');
          },
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Administração</Text>
        <View style={styles.adminBadge}>
          <Ionicons name="shield" size={14} color="#FFFFFF" />
          <Text style={styles.adminText}>Admin</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Estatísticas do Sistema</Text>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="people" size={28} color={colors.primary} />
            <Text style={styles.statNumber}>{stats.totalUsers}</Text>
            <Text style={styles.statLabel}>Usuários</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="leaf" size={28} color={colors.primary} />
            <Text style={styles.statNumber}>{stats.totalHabits}</Text>
            <Text style={styles.statLabel}>Hábitos</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="document-text" size={28} color={colors.primary} />
            <Text style={styles.statNumber}>{stats.totalNotes}</Text>
            <Text style={styles.statLabel}>Anotações</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Dados do Sistema</Text>

        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem} onPress={loadStats}>
            <Ionicons name="refresh" size={22} color={colors.primary} />
            <Text style={styles.menuText}>Atualizar estatísticas</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.border} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleClearData}>
            <Ionicons name="trash-outline" size={22} color={colors.danger} />
            <Text style={[styles.menuText, { color: colors.danger }]}>
              Limpar todos os dados
            </Text>
            <Ionicons name="chevron-forward" size={18} color={colors.border} />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Informações</Text>

        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            Esta é uma versão de demonstração. Os dados são armazenados localmente
            no dispositivo usando AsyncStorage.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 72,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },

  title: {
    fontSize: 34,
    fontWeight: '700',
    color: colors.text,
  },

  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },

  adminText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 12,
    marginTop: 8,
  },

  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },

  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },

  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },

  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },

  menu: {
    marginBottom: 24,
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
    fontWeight: '500',
    color: colors.text,
  },

  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
  },

  infoText: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSecondary,
  },
});
