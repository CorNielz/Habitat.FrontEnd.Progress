import { listNotes, createNote, updateNote } from '../notes';

beforeEach(() => {
  fetchMock.resetMocks();
});

test('listNotes loads paged notes', async () => {
  const page1 = {
    page: 1,
    pageSize: 100,
    totalItems: 1,
    totalPages: 1,
    items: [
      { id: 1, title: 'N1', content: 'x', date: '2026-06-01', createdAt: '2026-06-01', updatedAt: '2026-06-01' },
    ],
  };

  fetchMock.mockResponseOnce(JSON.stringify(page1), { status: 200, headers: { 'content-type': 'application/json' } });

  const notes = await listNotes();
  expect(Array.isArray(notes)).toBe(true);
  expect(notes[0].title).toBe('N1');
  expect(notes[0].linkedDate).toBe('2026-06-01');
});

test('createNote maps response to Note model', async () => {
  const resp = { id: 5, title: 'Note', content: 'body', date: '2026-06-02', createdAt: '2026-06-02', updatedAt: '2026-06-02' };
  fetchMock.mockResponseOnce(JSON.stringify(resp), { status: 200, headers: { 'content-type': 'application/json' } });

  const created = await createNote({ title: 'Note', content: 'body', date: '2026-06-02' });
  expect(created.id).toBe(String(resp.id));
  expect(created.linkedDate).toBe(resp.date);
});

test('updateNote maps response to Note model', async () => {
  const resp = { id: 5, title: 'Updated', content: 'body', date: '2026-06-03', createdAt: '2026-06-03', updatedAt: '2026-06-03' };
  fetchMock.mockResponseOnce(JSON.stringify(resp), { status: 200, headers: { 'content-type': 'application/json' } });

  const updated = await updateNote('5', { title: 'Updated', content: 'body', date: '2026-06-03' });
  expect(updated.id).toBe(String(resp.id));
  expect(updated.title).toBe('Updated');
});
