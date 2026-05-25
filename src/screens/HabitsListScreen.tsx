import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../styles/colors';
import { HabitCard } from '../components/HabitCard';
import { useHabitsStore } from '../store/useHabitsStore';

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function HabitsListScreen({ navigation }: any) {
  const habits = useHabitsStore((state) => state.habits);
  const loaded = useHabitsStore((state) => state.loaded);
  const loadHabits = useHabitsStore((state) => state.loadHabits);
  const toggleCompletion = useHabitsStore((state) => state.toggleCompletion);
  const getStreak = useHabitsStore((state) => state.getStreak);
  const getTodayProgress = useHabitsStore((state) => state.getTodayProgress);

  useEffect(() => {
    loadHabits();
  }, []);

  const today = formatDate(new Date());
  const progress = getTodayProgress();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Hábitos</Text>

        <TouchableOpacity onPress={() => navigation.getParent()?.navigate('CreateHabit')}>
          <Ionicons name="add-circle" size={32} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {progress.total > 0 && (
        <View style={styles.progressCard}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressLabel}>Progresso de hoje</Text>
            <Text style={styles.progressText}>
              {progress.completed}/{progress.total}
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: progress.total > 0
                    ? `${(progress.completed / progress.total) * 100}%`
                    : '0%',
                },
              ]}
            />
          </View>
        </View>
      )}

      {!loaded ? (
        <View style={styles.empty}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : habits.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="leaf-outline" size={64} color={colors.border} />
          <Text style={styles.emptyText}>Nenhum hábito ainda</Text>
          <Text style={styles.emptySubtext}>
            Toque no + para criar seu primeiro hábito
          </Text>
        </View>
      ) : (
        <FlatList
          data={habits}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <HabitCard
              habit={item}
              completed={(item.completedDates || []).includes(today)}
              streak={getStreak(item)}
              onPress={() => navigation.getParent()?.navigate('EditHabit', { habit: item })}
              onToggle={() => toggleCompletion(item.id, today)}
            />
          )}
        />
      )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 72,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },

  title: {
    fontSize: 34,
    fontWeight: '700',
    color: colors.text,
  },

  progressCard: {
    backgroundColor: colors.surface,
    marginHorizontal: 24,
    marginBottom: 20,
    padding: 18,
    borderRadius: 18,
  },

  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  progressLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },

  progressText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },

  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },

  list: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  separator: {
    height: 12,
  },

  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80,
  },

  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 16,
  },

  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
});
