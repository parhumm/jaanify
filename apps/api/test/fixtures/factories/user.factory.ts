import { Factory } from 'fishery';

interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  authProvider: 'google' | 'email';
  preferences: Record<string, unknown> | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export const userFactory = Factory.define<User>(({ sequence }) => ({
  id: `user-${sequence}`,
  email: `user-${sequence}@example.com`,
  name: `Test User ${sequence}`,
  avatarUrl: `https://example.com/avatars/${sequence}.jpg`,
  authProvider: 'google',
  preferences: null,
  deletedAt: null,
  createdAt: new Date('2026-02-01T00:00:00Z'),
  updatedAt: new Date('2026-02-01T00:00:00Z'),
}));

export const deletedUserFactory = userFactory.params({
  deletedAt: new Date('2026-02-10T00:00:00Z'),
});

export const googleUserFactory = userFactory.params({
  authProvider: 'google',
  email: 'test@example.com',
  name: 'Test User',
  avatarUrl: 'https://example.com/avatar.jpg',
});
