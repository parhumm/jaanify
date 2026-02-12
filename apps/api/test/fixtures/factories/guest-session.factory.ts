import { Factory } from 'fishery';

interface GuestSession {
  id: string;
  anonymousId: string;
  dataJson: Record<string, unknown> | null;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const guestSessionFactory = Factory.define<GuestSession>(({ sequence }) => ({
  id: `session-${sequence}`,
  anonymousId: `anon-${sequence}-${Date.now()}`,
  dataJson: {
    tasks: [
      {
        title: 'Finish portfolio website by next Monday',
        raw_input: 'Finish portfolio website by next Monday',
        category: 'Work',
        energy_level: 'high',
        estimated_minutes: 120,
      },
    ],
  },
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  createdAt: new Date(),
  updatedAt: new Date(),
}));

export const expiredSessionFactory = guestSessionFactory.params({
  expiresAt: new Date('2026-01-01T00:00:00Z'), // expired
});

export const emptySessionFactory = guestSessionFactory.params({
  dataJson: { tasks: [] },
});
