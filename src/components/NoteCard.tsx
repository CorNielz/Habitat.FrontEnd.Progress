import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../styles/colors';
import { Note } from '../types/note';

interface Props {
  note: Note;
  onPress: () => void;
  onFavorite: () => void;
}

export function NoteCard({
  note,
  onPress,
  onFavorite,
}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          {note.title}
        </Text>

        <TouchableOpacity onPress={onFavorite} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons
            name={note.favorite ? 'leaf' : 'leaf-outline'}
            size={22}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.content} numberOfLines={3}>
        {note.content}
      </Text>

      <View style={styles.footer}>
        <Text style={styles.date}>{note.createdAt}</Text>
        {note.updatedAt && note.updatedAt !== note.createdAt && (
          <Text style={styles.editedTag}>(editada)</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#EEF2EE',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    marginRight: 12,
  },

  content: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.textSecondary,
  },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    gap: 8,
  },

  date: {
    color: '#9AA39A',
    fontSize: 12,
  },

  editedTag: {
    color: '#9AA39A',
    fontSize: 11,
    fontStyle: 'italic',
  },
});
