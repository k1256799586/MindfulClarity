import { StyleSheet, View } from 'react-native';

import { SectionHeader } from '@/components/section-header';
import { EmptyState } from '@/components/empty-state';
import { spacing } from '@/theme';
import type { Task } from '@/types/models';

import { TaskRow } from './task-row';

type TaskListSectionProps = {
  title: string;
  tasks: Task[];
  emptyMessage: string;
  onToggleComplete?: (taskId: string) => void;
};

export function TaskListSection({
  title,
  tasks,
  emptyMessage,
  onToggleComplete,
}: TaskListSectionProps) {
  return (
    <View style={styles.section}>
      <SectionHeader title={title} />
      <View style={styles.stack}>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskRow
              key={task.id}
              onToggleComplete={
                onToggleComplete ? () => onToggleComplete(task.id) : undefined
              }
              task={task}
            />
          ))
        ) : (
          <EmptyState message={emptyMessage} title={`No ${title.toLowerCase()} tasks`} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: spacing.xl,
  },
  stack: {
    gap: spacing.sm,
  },
});
