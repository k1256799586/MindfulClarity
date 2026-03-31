import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ProgressRingBadge } from '@/components/progress-ring-badge';
import { ScreenShell } from '@/components/screen-shell';
import { TopBar } from '@/components/top-bar';
import { TaskEditorForm } from '@/features/tasks/task-editor-form';
import { TaskListSection } from '@/features/tasks/task-list-section';
import { groupTasks } from '@/features/tasks/task-grouping';
import { useAppStore } from '@/store/app-store';
import { buildDashboardSummary } from '@/store/selectors';
import { colors, radii, spacing, typography } from '@/theme';

export default function TasksScreen() {
  const [composerOpen, setComposerOpen] = useState(false);
  const appLimits = useAppStore((state) => state.appLimits);
  const createTask = useAppStore((state) => state.createTask);
  const focusSessions = useAppStore((state) => state.focusSessions);
  const insight = useAppStore((state) => state.insight);
  const settings = useAppStore((state) => state.settings);
  const streak = useAppStore((state) => state.streak);
  const tasks = useAppStore((state) => state.tasks);
  const toggleTaskComplete = useAppStore((state) => state.toggleTaskComplete);
  const usageSnapshots = useAppStore((state) => state.usageSnapshots);

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
  const grouped = groupTasks(tasks);

  return (
    <ScreenShell>
      <TopBar title="Mindful Productivity" />

      <View style={styles.progressCard}>
        <View style={styles.progressBody}>
          <Text style={styles.progressEyebrow}>Today's Journey</Text>
          <Text style={styles.progressValue}>{summary.progressPercentage}% Complete</Text>
          <Text style={styles.progressMessage}>
            You are 2 tasks away from your goal.
          </Text>
        </View>
        <ProgressRingBadge label="+" />
      </View>

      <Pressable onPress={() => setComposerOpen((current) => !current)} style={styles.quickAdd}>
        <Text style={styles.quickAddLabel}>Add a moment of productivity...</Text>
      </Pressable>

      {composerOpen ? (
        <View style={styles.composerWrap}>
          <TaskEditorForm
            onCancel={() => setComposerOpen(false)}
            onSave={(input) => {
              createTask({
                durationMinutes: input.durationMinutes,
                lane: input.lane,
                reminderEnabled: input.reminderEnabled,
                subtitle: input.lane === 'focus' ? 'Clarity focus' : 'No distractions',
                title: input.title,
              });
              setComposerOpen(false);
            }}
          />
        </View>
      ) : null}

      <TaskListSection
        emptyMessage="Create a focus task to start your day."
        onToggleComplete={toggleTaskComplete}
        tasks={grouped.focus}
        title="Focus"
      />
      <TaskListSection
        emptyMessage="No transition rituals scheduled yet."
        onToggleComplete={toggleTaskComplete}
        tasks={grouped.transition}
        title="Transition"
      />
      <TaskListSection
        emptyMessage="Completed tasks will appear here."
        tasks={grouped.completed}
        title="Completed"
      />

      <Pressable
        onPress={() => router.push('/overuse-intervention')}
        style={styles.alertCard}
      >
        <Text style={styles.alertEyebrow}>Distraction Alert</Text>
        <Text style={styles.alertTitle}>Afternoon Slump Incoming</Text>
        <Text style={styles.alertBody}>
          Data suggests your focus peaks at 3 PM. Avoid meetings during this
          period to maintain flow.
        </Text>
      </Pressable>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  progressCard: {
    alignItems: 'center',
    backgroundColor: '#f0f3f8',
    borderRadius: radii.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  progressBody: {
    flex: 1,
    marginRight: spacing.md,
  },
  progressEyebrow: {
    ...typography.eyebrow,
    marginBottom: spacing.xs,
  },
  progressValue: {
    ...typography.h2,
  },
  progressMessage: {
    ...typography.body,
    marginTop: spacing.xs,
  },
  quickAdd: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  quickAddLabel: {
    color: colors.textMuted,
    fontSize: 15,
    fontWeight: '600',
  },
  composerWrap: {
    marginTop: spacing.md,
  },
  alertCard: {
    backgroundColor: '#e9eef6',
    borderRadius: radii.lg,
    marginTop: spacing.xl,
    padding: spacing.lg,
  },
  alertEyebrow: {
    ...typography.eyebrow,
    color: colors.alert,
    marginBottom: spacing.xs,
  },
  alertTitle: {
    ...typography.h2,
    fontSize: 28,
    marginBottom: spacing.sm,
  },
  alertBody: {
    ...typography.body,
  },
});
