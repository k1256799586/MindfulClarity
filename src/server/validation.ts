import { z } from 'zod';

export const taskMutationSchema = z.object({
  durationMinutes: z.number().int().min(1).max(300).optional(),
  highFocus: z.boolean().optional(),
  lane: z.enum(['focus', 'transition']).optional(),
  reminderEnabled: z.boolean().optional(),
  scheduledLabel: z.string().trim().min(1).max(60).optional(),
  subtitle: z.string().trim().max(120).optional(),
  title: z.string().trim().min(1).max(120),
});

export const taskUpdateSchema = taskMutationSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  'At least one task field must be provided'
);

export const focusSessionStartSchema = z.object({
  durationMinutes: z.number().int().min(1).max(300),
  taskId: z.string().trim().min(1),
  taskTitle: z.string().trim().min(1).max(120),
});

export const focusSessionPauseSchema = z.object({
  remainingSeconds: z.number().int().min(0).optional(),
});

export const checkInSchema = z.object({
  note: z.string().trim().min(1).max(500),
  sessionId: z.string().trim().min(1).optional(),
});

export const settingsUpdateSchema = z.object({
  deepWorkMode: z.boolean().optional(),
  monitoringEnabled: z.boolean().optional(),
  remindersEnabled: z.boolean().optional(),
  visualClarity: z.enum(['System', 'Soft', 'High Contrast']).optional(),
  zenNotifications: z.boolean().optional(),
});
