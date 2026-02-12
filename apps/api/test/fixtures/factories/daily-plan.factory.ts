import { Factory } from 'fishery';

interface DailyPlanSlot {
  id: string;
  planId: string;
  taskId: string;
  position: number;
  status: string;
  reasoningJson: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}

interface DailyPlan {
  id: string;
  userId: string;
  date: Date;
  status: string;
  reasoningMethod: 'ai' | 'rule_based';
  generatedAt: Date | null;
  slots: DailyPlanSlot[];
  createdAt: Date;
  updatedAt: Date;
}

export const dailyPlanSlotFactory = Factory.define<DailyPlanSlot>(({ sequence }) => ({
  id: `slot-${sequence}`,
  planId: 'plan-1',
  taskId: `task-${sequence}`,
  position: sequence,
  status: 'pending',
  reasoningJson: {
    reasoning: `Task ${sequence} prioritized based on deadline proximity`,
  },
  createdAt: new Date('2026-02-11T00:00:00Z'),
  updatedAt: new Date('2026-02-11T00:00:00Z'),
}));

export const dailyPlanFactory = Factory.define<DailyPlan>(({ sequence }) => ({
  id: `plan-${sequence}`,
  userId: 'user-1',
  date: new Date('2026-02-11T00:00:00Z'),
  status: 'active',
  reasoningMethod: 'ai',
  generatedAt: new Date('2026-02-11T08:00:00Z'),
  slots: dailyPlanSlotFactory.buildList(5),
  createdAt: new Date('2026-02-11T00:00:00Z'),
  updatedAt: new Date('2026-02-11T00:00:00Z'),
}));

export const emptyPlanFactory = dailyPlanFactory.params({
  slots: [],
  reasoningMethod: 'rule_based',
});

export const generatingPlanFactory = dailyPlanFactory.params({
  status: 'generating',
  generatedAt: null,
  slots: [],
});
