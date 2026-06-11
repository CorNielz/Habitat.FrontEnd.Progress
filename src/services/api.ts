import AsyncStorage from '@react-native-async-storage/async-storage';

const DEFAULT_BASE_URL = (process.env.API_BASE_URL as string);
const AUTH_KEY = '@habitat_auth';

let baseUrl = DEFAULT_BASE_URL.replace(/\/+$/g, '');

async function getToken(): Promise<string | null> {
  try {
    const raw = await AsyncStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.token ?? null;
  } catch {
    return null;
  }
}

function buildUrl(path: string) {
  if (/^https?:\/\//i.test(path)) return path;
  return `${baseUrl}/${path.replace(/^\/+/, '')}`;
}

async function request(method: string, path: string, body?: any, params?: Record<string, any>) {
  const url = new URL(buildUrl(path));
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.append(k, String(v));
    });
  }

  const token = await getToken();
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url.toString(), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null;

  const text = await res.text();
  const contentType = res.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? (text ? JSON.parse(text) : {}) : text;

  if (!res.ok) {
    const err: any = new Error(data?.detail || data?.message || res.statusText || 'API error');
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

export const api = {
  get: (path: string, params?: Record<string, any>) => request('GET', path, undefined, params),
  post: (path: string, body?: any) => request('POST', path, body),
  put: (path: string, body?: any) => request('PUT', path, body),
  del: (path: string, params?: Record<string, any>) => request('DELETE', path, undefined, params),
  buildUrl,
  setBaseUrl: (url: string) => { baseUrl = url.replace(/\/+$/g, ''); },
  _getTokenForDebug: getToken,
};

export default api;
