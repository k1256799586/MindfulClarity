import { StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { PrimaryButton } from '@/components/primary-button';
import { ScreenShell } from '@/components/screen-shell';
import { TopBar } from '@/components/top-bar';
import { FocusConsistencyGrid } from '@/features/stats/focus-consistency-grid';
import { StatCard } from '@/features/stats/stat-card';
import { useAppStore } from '@/store/app-store';
import { colors, spacing, typography } from '@/theme';

export default function StatsScreen() {
  const focusSessions = useAppStore((state) => state.focusSessions);
  const tasks = useAppStore((state) => state.tasks);
  const weekly = useAppStore((state) => state.weeklyStats);
  const hasNoData = tasks.length === 0 && focusSessions.length === 0;

  if (hasNoData) {
    return (
      <ScreenShell>
        <TopBar title="Mindful Productivity" />
        <EmptyState
          message="Complete a few focus sessions and tasks before this view starts surfacing trends."
          title="Build a few sessions first"
        />
      </ScreenShell>
    );
  }

  return (
    <ScreenShell>
      <TopBar title="Mindful Productivity" />
      <Text style={styles.eyebrow}>Weekly Performance</Text>
      <Text style={styles.title}>Clarity Stats</Text>
      <Text style={styles.body}>
        Your focus metrics indicate a significant trend toward deep work. The
        curated void is expanding.
      </Text>
      <View style={styles.buttonWrap}>
        <PrimaryButton label="Refine Schedule" />
      </View>

      <View style={styles.stack}>
        <StatCard
          accent={<Text style={styles.mintAccent}>15% more focused</Text>}
          eyebrow="Deep Focus Cycles"
          title="Last 7 Days vs Previous"
          tone="soft"
          value={`${weekly.completedTaskCount} cycles`}
        />
        <StatCard
          eyebrow="Distraction Peak"
          title={weekly.distractionPeakAppName}
          tone="alert"
          value={`${weekly.distractionPeakMinutes}m`}
        />
        <StatCard
          eyebrow="Avg Session"
          title="Healthy"
          value={`${weekly.averageSessionMinutes}m`}
        />
        <StatCard
          eyebrow="Resilience Score"
          title="Stable"
          value={`${weekly.resilienceScore}/100`}
        />
        <StatCard
          eyebrow="Context Switches"
          title="Action Req"
          value={`${weekly.contextSwitches}`}
        />
        <View style={styles.gridCard}>
          <Text style={styles.gridTitle}>Flow Consistency</Text>
          <FocusConsistencyGrid />
        </View>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    ...typography.eyebrow,
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.h1,
    marginBottom: spacing.sm,
  },
  body: {
    ...typography.body,
  },
  buttonWrap: {
    marginTop: spacing.lg,
  },
  stack: {
    gap: spacing.sm,
    marginTop: spacing.xxl,
  },
  mintAccent: {
    color: colors.mintDeep,
    fontSize: 18,
    fontWeight: '800',
    maxWidth: 90,
  },
  gridCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: spacing.lg,
  },
  gridTitle: {
    ...typography.strongBody,
    marginBottom: spacing.md,
  },
});
