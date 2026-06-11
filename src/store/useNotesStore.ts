import { create } from 'zustand';

import { Note } from '../types/note';
import {
  createNote as createNoteRequest,
  deleteNote as deleteNoteRequest,
  listNotes,
  updateNote as updateNoteRequest,
} from '../services/notes';

interface NotesStore {
  notes: Note[];
  loaded: boolean;

  loadNotes: (date?: string) => Promise<void>;
  addNote: (note: Note) => Promise<void>;
  removeNote: (id: string) => Promise<void>;
  updateNote: (note: Note) => Promise<void>;
  toggleFavorite: (id: string) => void;
}

function toRequest(note: Note) {
  return {
    title: note.title.trim() || undefined,
    content: note.content.trim(),
    date: note.linkedDate || note.createdAt.split('/').reverse().join('-') || new Date().toISOString().split('T')[0],
  };
}

export const useNotesStore = create<NotesStore>((set, get) => ({
  notes: [],
  loaded: false,

  loadNotes: async (date) => {
    try {
      const currentFavorites = new Map(get().notes.map((note) => [note.id, note.favorite]));
      const notes = await listNotes(date);
      const merged = notes.map((note) => ({
        ...note,
        favorite: currentFavorites.get(note.id) ?? note.favorite,
      }));
      set({ notes: merged, loaded: true });
    } catch (error) {
      console.error('Error loading notes:', error);
      set({ loaded: true });
    }
  },

  addNote: async (note) => {
    const created = await createNoteRequest(toRequest(note));
    set((state) => ({ notes: [created, ...state.notes] }));
  },

  removeNote: async (id) => {
    await deleteNoteRequest(id);
    set((state) => ({ notes: state.notes.filter((note) => note.id !== id) }));
  },

  updateNote: async (updatedNote) => {
    const updated = await updateNoteRequest(updatedNote.id, toRequest(updatedNote));
    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === updated.id ? { ...note, ...updated, favorite: note.favorite } : note
      ),
    }));
  },

  toggleFavorite: (id) =>
    set((state) => {
      const notes = state.notes.map((note) => {
        if (note.id === id) {
          return { ...note, favorite: !note.favorite };
        }
        return note;
      });
      return { notes };
    }),
}));
