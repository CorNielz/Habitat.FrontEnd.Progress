import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
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
import { useAuthStore } from '../store/useAuthStore';

const FREQUENCIES = [
  { value: 'single', label: 'Único' },
  { value: 'daily', label: 'Diário' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'monthly', label: 'Mensal' },
] as const;

export function CreateHabitScreen({ navigation }: any) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState<'single' | 'daily' | 'weekly' | 'monthly'>('single');
  const [loading, setLoading] = useState(false);

  const addHabit = useHabitsStore((s) => s.addHabit);
  const user = useAuthStore((s) => s.user);

  function handleSave() {
    if (!title.trim()) {
      Alert.alert('Atenção', 'Informe um título para o hábito');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const now = new Date();
      const createdAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

      addHabit({
        id: String(Date.now()),
        title: title.trim(),
        description: description.trim() || undefined,
        frequency,
        createdAt,
        completedDates: [],
        userId: user?.id || '',
      });
      setLoading(false);
      navigation.goBack();
    }, 500);
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Novo hábito</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.form}>
        <Input
          placeholder="Ex: Meditar 10 minutos"
          value={title}
          onChangeText={setTitle}
          label="Título do hábito"
        />

        <Input
          placeholder="Descreva seu hábito (opcional)"
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

        <Button
          title="Criar hábito"
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
});
