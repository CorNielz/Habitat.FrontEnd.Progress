import { useHabitsStore } from '../../store/useHabitsStore';
import { listHabits as listHabitsService } from '../../services/habits';

beforeEach(() => {
  fetchMock.resetMocks();
  // reset store
  useHabitsStore.setState({ habits: [], loaded: false, busy: false });
});

test('loadHabits populates habits with completed dates', async () => {
  const habitsPage = {
    page: 1,
    pageSize: 100,
    totalItems: 1,
    totalPages: 1,
    items: [
      { id: 10, title: 'H10', frequencyType: 'DAILY', frequencyValue: '1', startDate: '2026-06-01', createdAt: '2026-06-01', updatedAt: '2026-06-01' },
    ],
  };

  const recordsPage = {
    page: 1,
    pageSize: 100,
    totalItems: 1,
    totalPages: 1,
    items: [
      { id: 1, habitId: 10, recordDate: '2026-06-02', recordedAt: '2026-06-02' },
    ],
  };

  // first call: /habits
  fetchMock.mockResponseOnce(JSON.stringify(habitsPage), { status: 200, headers: { 'content-type': 'application/json' } });
  // second call: /habits/10/records
  fetchMock.mockResponseOnce(JSON.stringify(recordsPage), { status: 200, headers: { 'content-type': 'application/json' } });

  await useHabitsStore.getState().loadHabits();

  const state = useHabitsStore.getState();
  expect(state.loaded).toBe(true);
  expect(state.habits.length).toBe(1);
  expect(state.habits[0].completedDates).toContain('2026-06-02');
});

test('toggleCompletion adds and removes a date', async () => {
  // prepare store with one habit
  useHabitsStore.setState({
    habits: [
      { id: '20', title: 'T', description: undefined, frequency: 'daily', customDays: undefined, createdAt: '2026-06-01', completedDates: [], userId: '' },
    ],
  });

  // mock create record
  fetchMock.mockResponseOnce(JSON.stringify({ id: 2, habitId: 20, recordDate: '2026-06-05', recordedAt: '2026-06-05' }), { status: 200, headers: { 'content-type': 'application/json' } });

  await useHabitsStore.getState().toggleCompletion('20', '2026-06-05');
  let state = useHabitsStore.getState();
  expect(state.habits[0].completedDates).toContain('2026-06-05');

  // mock delete record (204)
  fetchMock.mockResponseOnce('', { status: 204 });

  await useHabitsStore.getState().toggleCompletion('20', '2026-06-05');
  state = useHabitsStore.getState();
  expect(state.habits[0].completedDates).not.toContain('2026-06-05');
});
