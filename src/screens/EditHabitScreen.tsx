import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../styles/colors';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useHabitsStore } from '../store/useHabitsStore';
import { Habit } from '../types/habit';

const FREQUENCIES = [
  { value: 'single', label: 'Único' },
  { value: 'daily', label: 'Diário' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'monthly', label: 'Mensal' },
] as const;

export function EditHabitScreen({ route, navigation }: any) {
  const { habit } = route.params as { habit: Habit };
  const [title, setTitle] = useState(habit.title);
  const [description, setDescription] = useState(habit.description || '');
  const [frequency, setFrequency] = useState<'single' | 'daily' | 'weekly' | 'monthly'>(
    habit.frequency as 'single' | 'daily' | 'weekly' | 'monthly'
  );
  const [loading, setLoading] = useState(false);

  const updateHabit = useHabitsStore((s) => s.updateHabit);
  const removeHabit = useHabitsStore((s) => s.removeHabit);

  function handleSave() {
    if (!title.trim()) {
      Alert.alert('Atenção', 'Informe um título');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      updateHabit({
        ...habit,
        title: title.trim(),
        description: description.trim() || undefined,
        frequency,
      });
      setLoading(false);
      navigation.goBack();
    }, 500);
  }

  function handleDelete() {
    Alert.alert('Excluir hábito', `Deseja excluir "${habit.title}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => {
          removeHabit(habit.id);
          navigation.goBack();
        },
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Editar hábito</Text>
        <TouchableOpacity onPress={handleDelete}>
          <Ionicons name="trash-outline" size={22} color="#D32F2F" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.form}>
        <Input
          placeholder="Título do hábito"
          value={title}
          onChangeText={setTitle}
          label="Título"
        />

        <Input
          placeholder="Descrição (opcional)"
          value={description}
          onChangeText={setDescription}
          label="Descrição"
          multiline
        />

        <Text style={styles.label}>Frequência</Text>
        <View style={styles.frequencyRow}>
          {FREQUENCIES.map((f) => (
            <TouchableOpacity
              key={f.value}
              style={[
                styles.frequencyOption,
                frequency === f.value && styles.frequencySelected,
              ]}
              onPress={() => setFrequency(f.value)}
            >
              <Text
                style={[
                  styles.frequencyText,
                  frequency === f.value && styles.frequencyTextSelected,
                ]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.statsSection}>
          <Text style={styles.statsTitle}>Estatísticas</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{habit.completedDates.length}</Text>
              <Text style={styles.statLabel}>Conclusões</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {new Date(habit.createdAt).toLocaleDateString('pt-BR')}
              </Text>
              <Text style={styles.statLabel}>Criado em</Text>
            </View>
          </View>
        </View>

        <Button
          title="Salvar alterações"
          onPress={handleSave}
          loading={loading}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 72,
  },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },

  topTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },

  form: {
    paddingHorizontal: 24,
    gap: 16,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },

  frequencyRow: {
    flexDirection: 'row',
    gap: 8,
  },

  frequencyOption: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
  },

  frequencySelected: {
    borderColor: colors.primary,
    backgroundColor: '#E8F5E9',
  },

  frequencyText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },

  frequencyTextSelected: {
    color: colors.primary,
  },

  statsSection: {
    marginTop: 8,
  },

  statsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },

  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },

  statItem: {
    flex: 1,
    backgroundColor: '#F7F9F7',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },

  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },

  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
});
