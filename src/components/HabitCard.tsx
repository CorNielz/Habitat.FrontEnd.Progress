import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../styles/colors';
import { Habit } from '../types/habit';

interface Props {
  habit: Habit;
  completed: boolean;
  streak?: number;
  onToggle: () => void;
  onPress: () => void;
  onDelete?: () => void;
}

export function HabitCard({
  habit,
  completed,
  streak = 0,
  onToggle,
  onPress,
  onDelete,
}: Props) {
  function handleLongPress() {
    Alert.alert('Excluir hábito', `Deseja excluir "${habit.title}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: onDelete },
    ]);
  }

  const frequencyLabel: Record<string, string> = {
    daily: 'Diário',
    weekly: 'Semanal',
    monthly: 'Mensal',
    custom: 'Personalizado',
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      onLongPress={handleLongPress}
      style={[styles.container, completed && styles.completed]}
    >
      <TouchableOpacity
        onPress={onToggle}
        style={[styles.checkbox, completed && styles.checkboxDone]}
      >
        {completed && <Ionicons name="checkmark" size={18} color="#FFFFFF" />}
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={[styles.title, completed && styles.titleDone]}>
          {habit.title}
        </Text>
        <Text style={styles.frequency}>
          {frequencyLabel[habit.frequency] || habit.frequency}
        </Text>
      </View>

      {streak > 0 && (
        <View style={styles.streakContainer}>
          <Ionicons name="flame" size={16} color={colors.primary} />
          <Text style={styles.streakText}>
            {streak}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEF2EE',
    gap: 14,
  },

  completed: {
    backgroundColor: '#F0FAF0',
    borderColor: '#C8E6C9',
  },

  checkbox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkboxDone: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  content: {
    flex: 1,
  },

  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },

  titleDone: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },

  frequency: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },

  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  streakText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
});
