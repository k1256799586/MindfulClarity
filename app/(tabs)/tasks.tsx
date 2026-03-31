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
import { colors, radii, spacing, typography } from '@/theme';

export default function TasksScreen() {
  const [composerOpen, setComposerOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const createTaskRemote = useAppStore((state) => state.createTaskRemote);
  const dashboard = useAppStore((state) => state.dashboard);
  const tasks = useAppStore((state) => state.tasks);
  const toggleTaskCompleteRemote = useAppStore((state) => state.toggleTaskCompleteRemote);
  const updateTaskRemote = useAppStore((state) => state.updateTaskRemote);
  const grouped = groupTasks(tasks);
  const editingTask = editingTaskId
    ? tasks.find((task) => task.id === editingTaskId)
    : undefined;
  const showComposer = composerOpen || Boolean(editingTask);

  return (
    <ScreenShell>
      <TopBar title="Mindful Productivity" />

      <View style={styles.progressCard}>
        <View style={styles.progressBody}>
          <Text style={styles.progressEyebrow}>Today's Journey</Text>
          <Text style={styles.progressValue}>
            {dashboard.progressPercentage}% Complete
          </Text>
          <Text style={styles.progressMessage}>
            You are 2 tasks away from your goal.
          </Text>
        </View>
        <ProgressRingBadge label="+" />
      </View>

      <Pressable
        onPress={() => {
          setEditingTaskId(null);
          setComposerOpen((current) => !current);
        }}
        style={styles.quickAdd}
      >
        <Text style={styles.quickAddLabel}>Add a moment of productivity...</Text>
      </Pressable>

      {showComposer ? (
        <View style={styles.composerWrap}>
          <TaskEditorForm
            initialValues={editingTask}
            onCancel={() => {
              setComposerOpen(false);
              setEditingTaskId(null);
            }}
            onSave={(input) => {
              if (editingTask) {
                void updateTaskRemote(editingTask.id, {
                  durationMinutes: input.durationMinutes,
                  lane: input.lane,
                  reminderEnabled: input.reminderEnabled,
                  subtitle:
                    input.lane === 'focus' ? 'Clarity focus' : 'No distractions',
                  title: input.title,
                });
              } else {
                void createTaskRemote({
                  durationMinutes: input.durationMinutes,
                  lane: input.lane,
                  reminderEnabled: input.reminderEnabled,
                  subtitle:
                    input.lane === 'focus' ? 'Clarity focus' : 'No distractions',
                  title: input.title,
                });
              }
              setComposerOpen(false);
              setEditingTaskId(null);
            }}
            submitLabel={editingTask ? 'Update Task' : 'Save Task'}
          />
        </View>
      ) : null}

      <TaskListSection
        emptyMessage="Create a focus task to start your day."
        onEditTask={setEditingTaskId}
        onToggleComplete={(taskId) => void toggleTaskCompleteRemote(taskId)}
        tasks={grouped.focus}
        title="Focus"
      />
      <TaskListSection
        emptyMessage="No transition rituals scheduled yet."
        onEditTask={setEditingTaskId}
        onToggleComplete={(taskId) => void toggleTaskCompleteRemote(taskId)}
        tasks={grouped.transition}
        title="Transition"
      />
      <TaskListSection
        emptyMessage="Completed tasks will appear here."
        onEditTask={setEditingTaskId}
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
