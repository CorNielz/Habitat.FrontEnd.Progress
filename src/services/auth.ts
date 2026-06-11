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

interface LoginResponse {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  user: ApiUserResponse;
}

interface AuthSession {
  token: string;
  user: User;
}

function normalizeRole(role: ApiUserResponse['role']): User['role'] {
  return role === 'ADMIN' ? 'admin' : 'user';
}

function mapUser(user: ApiUserResponse): User {
  return {
    id: String(user.id),
    name: user.name,
    email: user.email,
    role: normalizeRole(user.role),
    createdAt: user.createdAt,
    avatar: user.avatar,
  };
}

function mapLoginResponse(response: LoginResponse): AuthSession {
  return {
    token: response.accessToken,
    user: mapUser(response.user),
  };
}

export async function login(email: string, password: string): Promise<AuthSession> {
  if (!email.trim() || !password.trim()) {
    throw new Error('Preencha todos os campos');
  }

  const response = await api.post('/auth/login', {
    email: email.trim(),
    password,
  });

  return mapLoginResponse(response as LoginResponse);
}

export async function register(name: string, email: string, password: string): Promise<User> {
  if (!name.trim() || !email.trim() || !password.trim()) {
    throw new Error('Preencha todos os campos');
  }

  const response = await api.post('/auth/register', {
    name: name.trim(),
    email: email.trim(),
    password,
  });

  return mapUser(response as ApiUserResponse);
}

export async function updatePassword(currentPassword: string, newPassword: string): Promise<void> {
  if (!currentPassword.trim() || !newPassword.trim()) {
    throw new Error('Preencha todos os campos');
  }

  await api.put('/users/me/password', {
    currentPassword,
    newPassword,
  });
}

export async function getCurrentUser(): Promise<User> {
  const response = await api.get('/users/me');
  return mapUser(response as ApiUserResponse);
}

export async function forgotPassword(_email: string): Promise<void> {
  throw new Error('Recuperação de senha não está disponível nesta API');
}
