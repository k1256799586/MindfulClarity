import { taskMutationSchema } from '@/server/validation';

describe('server validation', () => {
  it('rejects an empty task title', () => {
    const result = taskMutationSchema.safeParse({ title: '' });

    expect(result.success).toBe(false);
  });
});
