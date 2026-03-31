import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '@/theme';
import type { Task } from '@/types/models';

type TaskRowProps = {
  task: Task;
  onToggleComplete?: () => void;
};

export function TaskRow({ task, onToggleComplete }: TaskRowProps) {
  const completed = task.status === 'done';

  return (
    <Pressable
      onPress={onToggleComplete}
      style={[
        styles.row,
        completed ? styles.completedRow : undefined,
        task.highFocus && !completed ? styles.highFocusRow : undefined,
      ]}
    >
      <View
        style={[
          styles.radio,
          completed ? styles.radioCompleted : undefined,
        ]}
      />
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, completed ? styles.completedTitle : undefined]}>
            {task.title}
          </Text>
          {task.highFocus && !completed ? (
            <View style={styles.badge}>
              <Text style={styles.badgeLabel}>HIGH FOCUS REQUIRED</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.subtitle}>
          {task.scheduledLabel ? `${task.scheduledLabel} — ` : ''}
          {task.subtitle ?? `${task.durationMinutes} mins`}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  completedRow: {
    backgroundColor: '#edf5ef',
  },
  highFocusRow: {
    borderLeftColor: colors.alert,
    borderLeftWidth: 3,
  },
  radio: {
    borderColor: '#cfd5de',
    borderRadius: radii.pill,
    borderWidth: 2,
    height: 22,
    marginRight: spacing.md,
    width: 22,
  },
  radioCompleted: {
    backgroundColor: colors.mint,
    borderColor: colors.mint,
  },
  body: {
    flex: 1,
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    color: colors.text,
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    marginRight: spacing.sm,
  },
  completedTitle: {
    color: colors.textMuted,
  },
  subtitle: {
    ...typography.body,
    fontSize: 13,
    marginTop: spacing.xxs,
  },
  badge: {
    backgroundColor: '#fae5e1',
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
  },
  badgeLabel: {
    color: colors.alert,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
});
