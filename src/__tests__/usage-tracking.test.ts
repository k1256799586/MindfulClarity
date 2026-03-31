import { evaluateUsageLimits } from '@/services/usage-tracking/mock-usage-tracking-service';

describe('evaluateUsageLimits', () => {
  it('flags apps that exceed the configured limit', () => {
    const result = evaluateUsageLimits(
      [
        { appName: 'Instagram', dailyLimitMinutes: 40, minutesUsed: 44 },
      ],
      [{ appName: 'Instagram', dailyLimitMinutes: 40 }]
    );

    expect(result[0].isOverLimit).toBe(true);
  });
});
