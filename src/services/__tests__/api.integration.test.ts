import { api } from '../api';

beforeEach(() => {
  fetchMock.resetMocks();
});

test('api.get returns parsed json on success', async () => {
  fetchMock.mockResponseOnce(JSON.stringify({ hello: 'world' }), { status: 200, headers: { 'content-type': 'application/json' } });

  const res = await api.get('/ping');
  expect(res).toEqual({ hello: 'world' });
});

test('api.get throws ApiError with ProblemDetails attached on problem+json', async () => {
  const problem = { type: 'https://example.com/probs/1', title: 'Invalid', detail: 'Invalid request', status: 400 };
  fetchMock.mockResponseOnce(JSON.stringify(problem), { status: 400, headers: { 'content-type': 'application/problem+json' } });

  await expect(api.get('/bad')).rejects.toMatchObject({ status: 400, data: problem, title: problem.title, detail: problem.detail });
});
