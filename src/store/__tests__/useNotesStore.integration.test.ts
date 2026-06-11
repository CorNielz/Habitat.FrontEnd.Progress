import { useNotesStore } from '../../store/useNotesStore';

beforeEach(() => {
  fetchMock.resetMocks();
  useNotesStore.setState({ notes: [], loaded: false, busy: false });
});

test('loadNotes loads and merges favorites', async () => {
  const notesPage = {
    page: 1,
    pageSize: 100,
    totalItems: 1,
    totalPages: 1,
    items: [
      { id: 3, title: 'Note3', content: 'x', date: '2026-06-01', createdAt: '2026-06-01', updatedAt: '2026-06-01' },
    ],
  };

  fetchMock.mockResponseOnce(JSON.stringify(notesPage), { status: 200, headers: { 'content-type': 'application/json' } });

  await useNotesStore.getState().loadNotes();
  const state = useNotesStore.getState();
  expect(state.notes.length).toBe(1);
  expect(state.notes[0].linkedDate).toBe('2026-06-01');
});

test('add/update/remove note flow', async () => {
  // mock create
  const createdResp = { id: 7, title: 'New', content: 'body', date: '2026-06-04', createdAt: '2026-06-04', updatedAt: '2026-06-04' };
  fetchMock.mockResponseOnce(JSON.stringify(createdResp), { status: 200, headers: { 'content-type': 'application/json' } });

  await useNotesStore.getState().addNote({ id: 'tmp', title: 'New', content: 'body', createdAt: '04/06/2026', updatedAt: '04/06/2026', favorite: false, linkedDate: '2026-06-04' } as any);
  let state = useNotesStore.getState();
  expect(state.notes[0].id).toBe(String(createdResp.id));

  // mock update
  const updatedResp = { id: 7, title: 'Updated', content: 'body', date: '2026-06-04', createdAt: '2026-06-04', updatedAt: '2026-06-05' };
  fetchMock.mockResponseOnce(JSON.stringify(updatedResp), { status: 200, headers: { 'content-type': 'application/json' } });

  await useNotesStore.getState().updateNote({ id: '7', title: 'Updated', content: 'body', createdAt: '04/06/2026', updatedAt: '05/06/2026', favorite: false, linkedDate: '2026-06-04' } as any);
  state = useNotesStore.getState();
  expect(state.notes.find(n => n.id === '7')?.title).toBe('Updated');

  // mock delete
  fetchMock.mockResponseOnce('', { status: 204 });
  await useNotesStore.getState().removeNote('7');
  state = useNotesStore.getState();
  expect(state.notes.find(n => n.id === '7')).toBeUndefined();
});
