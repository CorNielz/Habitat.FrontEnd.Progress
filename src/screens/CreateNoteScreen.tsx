import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../styles/colors';
import { useNotesStore } from '../store/useNotesStore';
import { showApiError } from '../utils/errorHandler';

function parseLocalDate(iso: string) {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function formatPtBrFromIso(iso: string) {
  return parseLocalDate(iso).toLocaleDateString('pt-BR');
}

export function CreateNoteScreen({ navigation, route }: any) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const addNote = useNotesStore((s) => s.addNote);
  const busy = useNotesStore((s) => s.busy);
  const linkedDate = route?.params?.linkedDate;

  async function handleSave() {
    if (!title.trim()) {
      Alert.alert('Atenção', 'Digite um título para a nota');
      return;
    }

    const now = new Date();
    const selectedDate = linkedDate || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    try {
      await addNote({
        id: String(Date.now()),
        title: title.trim(),
        content: content.trim(),
        createdAt: formatPtBrFromIso(selectedDate),
        updatedAt: formatPtBrFromIso(selectedDate),
        favorite: false,
        linkedDate: selectedDate,
      });

      navigation.goBack();
    } catch (error) {
      showApiError(error, 'Erro');
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} disabled={busy}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSave} disabled={busy}>
          {busy ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <Text style={styles.saveText}>Salvar</Text>
          )}
        </TouchableOpacity>
      </View>

      <TextInput
        placeholder="Título"
        placeholderTextColor="#999"
        style={styles.titleInput}
        value={title}
        onChangeText={setTitle}
      />

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

  contentInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 28,
    color: colors.text,
    textAlignVertical: 'top',
  },
});
