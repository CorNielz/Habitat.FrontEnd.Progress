import { api } from './api';
import { User } from '../types/user';

interface ApiAdminUserResponse {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  lastLoginAt?: string | null;
}

interface PagedAdminUserResponse {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  items: ApiAdminUserResponse[];
}

function mapAdminUser(u: ApiAdminUserResponse): User & { lastLoginAt?: string | null } {
  return {
    id: String(u.id),
    name: u.name,
    email: u.email,
    role: u.role === 'ADMIN' ? 'admin' : 'user',
    createdAt: u.createdAt,
    avatar: undefined,
    lastLoginAt: u.lastLoginAt ?? null,
  } as any;
}

export async function listUsers(page = 1, pageSize = 50): Promise<PagedAdminUserResponse> {
  const res = (await api.get('/admin/users', { page, pageSize })) as PagedAdminUserResponse;
  return {
    ...res,
    items: res.items || [],
  };
}

export async function getUserById(id: string): Promise<User & { lastLoginAt?: string | null }> {
  const res = (await api.get(`/admin/users/${id}`)) as ApiAdminUserResponse;
  return mapAdminUser(res);
}

export async function updateUserRole(id: string, role: 'user' | 'admin'): Promise<void> {
  const apiRole = role === 'admin' ? 'ADMIN' : 'USER';
  await api.put(`/admin/users/${id}/role`, { role: apiRole });
}
