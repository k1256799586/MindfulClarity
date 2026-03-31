import type { Task } from '@/types/models';

export function groupTasks(tasks: Task[]) {
  return {
    focus: tasks.filter((task) => task.lane === 'focus' && task.status !== 'done'),
    transition: tasks.filter(
      (task) => task.lane === 'transition' && task.status !== 'done'
    ),
    completed: tasks.filter((task) => task.status === 'done'),
  };
}
