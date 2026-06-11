import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

import { colors } from '../styles/colors';
import { useNotesStore } from '../store/useNotesStore';
import { Note } from '../types/note';

function formatLocalIso(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseNoteDate(value: string) {
  if (!value) return formatLocalIso(new Date());

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  if (value.includes('/')) {
    const parts = value.split('/');
    if (parts.length >= 3) {
      const day = parts[0].padStart(2, '0');
      const month = parts[1].padStart(2, '0');
      const year = parts[2].slice(0, 4);
      return `${year}-${month}-${day}`;
    }
  }

  if (value.includes('T')) {
    return value.split('T')[0];
  }

  return formatLocalIso(new Date());
}

function isoToDate(iso: string) {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function formatPtBrFromIso(iso: string) {
  return isoToDate(iso).toLocaleDateString('pt-BR');
}

export function EditNoteScreen({ route, navigation }: any) {
  const { note } = route.params as { note: Note };
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [noteDate, setNoteDate] = useState(note.linkedDate || parseNoteDate(note.createdAt));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const updateNote = useNotesStore((state) => state.updateNote);
  const removeNote = useNotesStore((state) => state.removeNote);

  async function handleSave() {
    if (!title.trim()) {
      Alert.alert('Atenção', 'Digite um título para a nota');
      return;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(noteDate)) {
      Alert.alert('Atenção', 'Digite a data no formato YYYY-MM-DD');
      return;
    }

    try {
      await updateNote({
        ...note,
        title: title.trim(),
        content: content.trim(),
        createdAt: formatPtBrFromIso(noteDate),
        linkedDate: noteDate,
        updatedAt: new Date().toLocaleDateString('pt-BR'),
      });

      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar a anotação.');
    }
  }

  function handleDelete() {
    Alert.alert('Excluir nota', `Deseja excluir "${note.title}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await removeNote(note.id);
            navigation.goBack();
          } catch (error) {
            Alert.alert('Erro', 'Não foi possível excluir a anotação.');
          }
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

        <View style={styles.topActions}>
          <TouchableOpacity onPress={handleDelete}>
            <Ionicons name="trash-outline" size={22} color="#D32F2F" />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveText}>Salvar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TextInput
        placeholder="Título"
        placeholderTextColor="#999"
        style={styles.titleInput}
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.dateLabel}>Data da nota</Text>
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.dateButton}
      >
        <Text style={styles.dateButtonText}>{formatPtBrFromIso(noteDate)}</Text>
        <Ionicons name="calendar-outline" size={18} color={colors.primary} />
      </TouchableOpacity>

      {showDatePicker && (
        <View style={styles.datePickerContainer}>
          <DateTimePicker
            value={isoToDate(noteDate)}
            mode="date"
            display="default"
            onChange={(_, selectedDate) => {
              if (selectedDate) {
                setNoteDate(formatLocalIso(selectedDate));
              }
              setShowDatePicker(false);
            }}
            style={styles.datePicker}
          />
        </View>
      )}

      <TextInput
        placeholder="Comece a escrever..."
        placeholderTextColor="#999"
        multiline
        style={styles.contentInput}
        value={content}
        onChangeText={setContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 72,
    paddingHorizontal: 24,
  },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },

  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },

  saveText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },

  titleInput: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 24,
  },

  dateLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 10,
  },

  dateButton: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  dateButtonText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },

  datePickerContainer: {
    marginBottom: 8,
  },

  datePicker: {
    alignSelf: 'stretch',
  },

  dateHelper: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 18,
  },

  contentInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 28,
    color: colors.text,
    textAlignVertical: 'top',
  },
});
