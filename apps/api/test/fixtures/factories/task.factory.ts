import { Factory } from 'fishery';

interface Task {
  id: string;
  userId: string;
  title: string;
  rawInput: string | null;
  description: string | null;
  deadline: Date | null;
  category: string | null;
  status: string;
  energyLevel: 'low' | 'medium' | 'high' | null;
  estimatedMinutes: number | null;
  priorityScore: number;
  priorityOverride: string | null;
  reasoningJson: Record<string, unknown> | null;
  completedAt: Date | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export const taskFactory = Factory.define<Task>(({ sequence }) => ({
  id: `task-${sequence}`,
  userId: 'user-1',
  title: `Test Task ${sequence}`,
  rawInput: null,
  description: null,
  deadline: null,
  category: null,
  status: 'active',
  energyLevel: null,
  estimatedMinutes: null,
  priorityScore: 0.5,
  priorityOverride: null,
  reasoningJson: null,
  completedAt: null,
  deletedAt: null,
  createdAt: new Date('2026-02-01T00:00:00Z'),
  updatedAt: new Date('2026-02-01T00:00:00Z'),
}));

export const taskWithDeadlineFactory = taskFactory.params({
  title: 'Call Sarah about the Johnson proposal',
  rawInput: 'Call Sarah about the Johnson proposal by Friday 2 PM',
  deadline: new Date('2026-02-14T14:00:00Z'),
  category: 'Client work',
  energyLevel: 'high',
  estimatedMinutes: 30,
  priorityScore: 0.78,
  reasoningJson: {
    keywords: ['deadline', 'client'],
    method: 'ai',
    confidence: 0.9,
  },
});

export const highPriorityTaskFactory = taskFactory.params({
  deadline: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
  energyLevel: 'high',
  priorityScore: 0.98,
});

export const completedTaskFactory = taskFactory.params({
  status: 'completed',
  completedAt: new Date(),
});

export const deletedTaskFactory = taskFactory.params({
  deletedAt: new Date(),
});

export const aiParsedTaskFactory = taskFactory.params({
  rawInput: 'Buy groceries for dinner tonight',
  title: 'Buy groceries for dinner',
  deadline: new Date('2026-02-11T18:00:00Z'),
  category: 'Personal',
  energyLevel: 'low',
  estimatedMinutes: 45,
  reasoningJson: {
    keywords: ['groceries', 'dinner', 'tonight'],
    method: 'ai',
    confidence: 0.8,
  },
});
