import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { InsightCard } from '@/components/insight-card';
import { MetricCard } from '@/components/metric-card';
import { PrimaryButton } from '@/components/primary-button';
import { ScreenShell } from '@/components/screen-shell';
import { SectionHeader } from '@/components/section-header';
import { TopBar } from '@/components/top-bar';
import { buildDashboardSummary } from '@/store/selectors';
import { useAppStore } from '@/store/app-store';
import { colors, spacing, typography } from '@/theme';

export default function DashboardScreen() {
  const tasks = useAppStore((state) => state.tasks);
  const usageSnapshots = useAppStore((state) => state.usageSnapshots);
  const streak = useAppStore((state) => state.streak);
  const focusSessions = useAppStore((state) => state.focusSessions);
  const appLimits = useAppStore((state) => state.appLimits);
  const settings = useAppStore((state) => state.settings);
  const insight = useAppStore((state) => state.insight);
  const startFocusSession = useAppStore((state) => state.startFocusSession);

  const summary = buildDashboardSummary({
    appLimits,
    checkIns: [],
    focusSessions,
    hasSeenOnboarding: true,
    insight,
    seededAt: new Date().toISOString(),
    settings,
    streak,
    tasks,
    usageSnapshots,
  });

  return (
    <ScreenShell>
      <TopBar title="Mindful Productivity" />
      <Text style={styles.eyebrow}>Current intent</Text>
      <Text style={styles.hero}>{summary.currentTaskTitle}</Text>
      <View style={styles.buttonWrap}>
        <PrimaryButton
          label="Start Focus"
          onPress={() => {
            if (!summary.currentTask) {
              router.push('/task-editor');
              return;
            }

            startFocusSession(
              summary.currentTask.id,
              summary.currentTask.title,
              summary.currentTask.durationMinutes
            );
            router.push('/focus');
          }}
        />
      </View>

      <View style={styles.metrics}>
        <MetricCard
          accentColor={colors.mintDeep}
          label="Today's Progress"
          value={`${summary.progressPercentage}%`}
        />
        <MetricCard
          accentColor={colors.mint}
          label="Focus Streak"
          muted
          value={`${summary.streakDays} Days`}
        />
        <MetricCard
          accentColor={colors.textMuted}
          label="Distraction Time"
          muted
          value={`${summary.distractionMinutes}m`}
        />
        <MetricCard
          accentColor={colors.alert}
          label="Limit Status"
          muted
          value={summary.limitStatusLabel}
        />
      </View>

      <View style={styles.section}>
        <SectionHeader actionLabel="View Schedule" title="Upcoming Focus" />
        <View style={styles.upcomingStack}>
          {summary.upcomingTasks.slice(0, 3).map((task) => (
            <View key={task.id} style={styles.upcomingCard}>
              <View style={styles.upcomingRule} />
              <View style={styles.upcomingBody}>
                <Text style={styles.upcomingTitle}>{task.title}</Text>
                <Text style={styles.upcomingSubtitle}>{task.subtitle}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <InsightCard
        description={insight.body}
        title={insight.title}
      />
      <View style={styles.tipSpacing} />
      <InsightCard
        dark
        description="Recovery is a discipline. One deliberate pause today protects the rest of the week."
        title="Mindful Tip"
      />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    ...typography.eyebrow,
    marginBottom: spacing.xs,
  },
  hero: {
    ...typography.hero,
  },
  buttonWrap: {
    marginTop: spacing.lg,
  },
  metrics: {
    gap: spacing.sm,
    marginTop: spacing.xxl,
  },
  section: {
    marginTop: spacing.xxl,
  },
  upcomingStack: {
    gap: spacing.sm,
  },
  upcomingCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  upcomingRule: {
    backgroundColor: '#bde4d6',
    borderRadius: 999,
    marginRight: spacing.md,
    width: 3,
  },
  upcomingBody: {
    flex: 1,
  },
  upcomingTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  upcomingSubtitle: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '500',
    marginTop: spacing.xxs,
  },
  tipSpacing: {
    height: spacing.sm,
  },
});
