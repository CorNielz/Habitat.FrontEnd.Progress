import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Note } from '../types/note';
import { useAuthStore } from './useAuthStore';

const NOTES_KEY = '@habitat_notes';

interface NotesStore {
  notes: Note[];
  loaded: boolean;

  loadNotes: () => Promise<void>;
  addNote: (note: Note) => void;
  removeNote: (id: string) => void;
  updateNote: (note: Note) => void;
  toggleFavorite: (id: string) => void;
}

async function persist(notes: Note[]) {
  await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

export const useNotesStore = create<NotesStore>((set, get) => ({
  notes: [],
  loaded: false,

  loadNotes: async () => {
    const raw = await AsyncStorage.getItem(NOTES_KEY);
    const notes: Note[] = raw ? JSON.parse(raw) : [];
    const userId = useAuthStore.getState().user?.id;
    const userNotes = userId
      ? notes.filter((n) => n.userId === userId)
      : notes;
    set({ notes: userNotes, loaded: true });
  },

  addNote: (note) =>
    set((state) => {
      const notes = [note, ...state.notes];
      persist(notes);
      return { notes };
    }),

  removeNote: (id) =>
    set((state) => {
      const notes = state.notes.filter((note) => note.id !== id);
      persist(notes);
      return { notes };
    }),

  updateNote: (updatedNote) =>
    set((state) => {
      const notes = state.notes.map((note) =>
        note.id === updatedNote.id ? updatedNote : note
      );
      persist(notes);
      return { notes };
    }),

  toggleFavorite: (id) =>
    set((state) => {
      const notes = state.notes.map((note) => {
        if (note.id === id) {
          return { ...note, favorite: !note.favorite };
        }
        return note;
      });
      persist(notes);
      return { notes };
    }),
}));
