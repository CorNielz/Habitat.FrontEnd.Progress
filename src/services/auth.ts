import { User } from '../types/user';

const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'admin@habitat.com': {
    password: 'admin123',
    user: {
      id: '1',
      name: 'Administrador',
      email: 'admin@habitat.com',
      role: 'admin',
      createdAt: '2026-01-01',
    },
  },
  'user@habitat.com': {
    password: 'user123',
    user: {
      id: '2',
      name: 'Usuário Teste',
      email: 'user@habitat.com',
      role: 'user',
      createdAt: '2026-03-15',
    },
  },
};

export async function login(
  email: string,
  password: string
): Promise<{ token: string; user: User }> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!email || !password) {
        reject(new Error('Preencha todos os campos'));
        return;
      }

      const mockUser = MOCK_USERS[email.toLowerCase()];

      if (!mockUser || mockUser.password !== password) {
        reject(new Error('E-mail ou senha incorretos'));
        return;
      }

      resolve({
        token: `mock-token-${mockUser.user.id}`,
        user: mockUser.user,
      });
    }, 1200);
  });
}

export async function register(
  name: string,
  email: string,
  password: string
): Promise<{ token: string; user: User }> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!name || !email || !password) {
        reject(new Error('Preencha todos os campos'));
        return;
      }

      if (password.length < 6) {
        reject(new Error('A senha deve ter no mínimo 6 caracteres'));
        return;
      }

      if (MOCK_USERS[email.toLowerCase()]) {
        reject(new Error('Este e-mail já está cadastrado'));
        return;
      }

      const newUser: User = {
        id: String(Date.now()),
        name,
        email: email.toLowerCase(),
        role: 'user',
        createdAt: new Date().toISOString(),
      };

      MOCK_USERS[email.toLowerCase()] = { password, user: newUser };

      resolve({
        token: `mock-token-${newUser.id}`,
        user: newUser,
      });
    }, 1200);
  });
}

export async function forgotPassword(email: string): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!email) {
        reject(new Error('Informe seu e-mail'));
        return;
      }

      if (!MOCK_USERS[email.toLowerCase()]) {
        reject(new Error('E-mail não encontrado'));
        return;
      }

      resolve();
    }, 1200);
  });
}

export async function updatePassword(
  userId: string,
  oldPassword: string,
  newPassword: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const entry = Object.values(MOCK_USERS).find(
        (u) => u.user.id === userId
      );

      if (!entry || entry.password !== oldPassword) {
        reject(new Error('Senha atual incorreta'));
        return;
      }

      if (newPassword.length < 6) {
        reject(new Error('A nova senha deve ter no mínimo 6 caracteres'));
        return;
      }

      entry.password = newPassword;
      resolve();
    }, 1200);
  });
}
