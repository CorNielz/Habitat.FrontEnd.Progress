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
import { Note } from '../types/note';

export function EditNoteScreen({ route, navigation }: any) {
  const { note } = route.params as { note: Note };
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const updateNote = useNotesStore((state) => state.updateNote);
  const removeNote = useNotesStore((state) => state.removeNote);

  function handleSave() {
    if (!title.trim()) {
      Alert.alert('Atenção', 'Digite um título para a nota');
      return;
    }

    updateNote({
      ...note,
      title: title.trim(),
      content: content.trim(),
      updatedAt: new Date().toLocaleDateString('pt-BR'),
    });

    navigation.goBack();
  }

  function handleDelete() {
    Alert.alert('Excluir nota', `Deseja excluir "${note.title}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => {
          removeNote(note.id);
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

  contentInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 28,
    color: colors.text,
    textAlignVertical: 'top',
  },
});
