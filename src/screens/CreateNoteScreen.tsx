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

import { colors } from '../styles/colors';
import { useNotesStore } from '../store/useNotesStore';
import { useAuthStore } from '../store/useAuthStore';

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
  const user = useAuthStore((s) => s.user);
  const linkedDate = route?.params?.linkedDate;

  function handleSave() {
    if (!title.trim()) {
      Alert.alert('Atenção', 'Digite um título para a nota');
      return;
    }

    const now = new Date();
    const selectedDate = linkedDate || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const createdAt = formatPtBrFromIso(selectedDate);

    addNote({
      id: String(Date.now()),
      title: title.trim(),
      content: content.trim(),
      createdAt,
      updatedAt: createdAt,
      favorite: false,
      userId: user?.id || '',
      linkedDate: selectedDate,
    });

    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveText}>Salvar</Text>
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
