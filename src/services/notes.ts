import { api } from './api';
import { Note } from '../types/note';

interface ApiNoteResponse {
  id: number;
  title?: string | null;
  content: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

interface PagedNoteResponse {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  items: ApiNoteResponse[];
}

export interface NoteFormValues {
  title?: string;
  content: string;
  date: string;
}

function formatDateOnly(value: string): string {
  if (!value) return '';

  const isoDate = value.includes('T') ? value.split('T')[0] : value;
  const [year, month, day] = isoDate.split('-');

  if (!year || !month || !day) return value;

  return `${day}/${month}/${year}`;
}

function mapNote(response: ApiNoteResponse): Note {
  return {
    id: String(response.id),
    title: response.title ?? '',
    content: response.content,
    createdAt: formatDateOnly(response.date),
    updatedAt: formatDateOnly(response.updatedAt || response.createdAt),
    favorite: false,
    linkedDate: response.date,
  };
}

function toRequest(values: Note | NoteFormValues): NoteFormValues {
  const linkedDate = 'linkedDate' in values ? values.linkedDate : undefined;
  const createdAt = 'createdAt' in values ? values.createdAt : undefined;
  const date = linkedDate || createdAt || new Date().toISOString().split('T')[0];

  return {
    title: (values.title || '').trim() || undefined,
    content: values.content.trim(),
    date,
  };
}

async function loadAllNotes(date?: string): Promise<Note[]> {
  const pageSize = 100;
  let page = 1;
  let totalPages = 1;
  const notes: Note[] = [];

  do {
    const response = (await api.get('/notes', { page, pageSize, date })) as PagedNoteResponse;
    totalPages = response.totalPages || 1;
    notes.push(...response.items.map(mapNote));
    page += 1;
  } while (page <= totalPages);

  return notes;
}

export async function listNotes(date?: string): Promise<Note[]> {
  return loadAllNotes(date);
}

export async function createNote(values: NoteFormValues): Promise<Note> {
  const response = (await api.post('/notes', toRequest(values))) as ApiNoteResponse;
  return mapNote(response);
}

export async function updateNote(id: string, values: NoteFormValues): Promise<Note> {
  const response = (await api.put(`/notes/${id}`, toRequest(values))) as ApiNoteResponse;
  return mapNote(response);
}

export async function deleteNote(id: string): Promise<void> {
  await api.del(`/notes/${id}`);
}
