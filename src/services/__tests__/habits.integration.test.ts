import { listHabits, createHabit } from '../habits';
import { api } from '../api';

beforeEach(() => {
  fetchMock.resetMocks();
});

test('listHabits loads paged habits', async () => {
  const page1 = {
    page: 1,
    pageSize: 100,
    totalItems: 2,
    totalPages: 1,
    items: [
      { id: 1, title: 'H1', frequencyType: 'DAILY', frequencyValue: '1', startDate: '2026-01-01', createdAt: '2026-01-01', updatedAt: '2026-01-01' },
    ],
  };

  fetchMock.mockResponseOnce(JSON.stringify(page1), { status: 200, headers: { 'content-type': 'application/json' } });

  const habits = await listHabits();
  expect(Array.isArray(habits)).toBe(true);
  expect(habits[0].title).toBe('H1');
});

test('createHabit maps response to Habit model', async () => {
  const resp = { id: 42, title: 'New', frequencyType: 'WEEKLY', frequencyValue: '1', startDate: '2026-06-01', createdAt: '2026-06-01', updatedAt: '2026-06-01' };
  fetchMock.mockResponseOnce(JSON.stringify(resp), { status: 200, headers: { 'content-type': 'application/json' } });

  const created = await createHabit({ title: 'New', frequency: 'weekly', startDate: '2026-06-01' as any });
  expect(created.id).toBe(String(resp.id));
  expect(created.frequency).toBe('weekly');
});
