import { api } from './api';
import { User } from '../types/user';

interface ApiUserResponse {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  avatar?: string;
}

export interface UpdateProfileRequest {
  name?: string;
}

function mapUser(user: ApiUserResponse): User {
  return {
    id: String(user.id),
    name: user.name,
    email: user.email,
    role: user.role === 'ADMIN' ? 'admin' : 'user',
    createdAt: user.createdAt,
    avatar: user.avatar,
  };
}

export async function getCurrentUser(): Promise<User> {
  const response = await api.get('/users/me');
  return mapUser(response as ApiUserResponse);
}

export async function updateCurrentUserProfile(data: UpdateProfileRequest): Promise<User> {
  const response = await api.put('/users/me', data);
  return mapUser(response as ApiUserResponse);
}
