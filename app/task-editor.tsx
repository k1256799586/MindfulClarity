import { router } from 'expo-router';

import { ScreenShell } from '@/components/screen-shell';
import { TopBar } from '@/components/top-bar';
import { TaskEditorForm } from '@/features/tasks/task-editor-form';
import { useAppStore } from '@/store/app-store';

export default function TaskEditorScreen() {
  const createTask = useAppStore((state) => state.createTask);

  return (
    <ScreenShell>
      <TopBar title="Task Editor" />
      <TaskEditorForm
        onCancel={() => router.back()}
        onSave={(input) => {
          createTask({
            durationMinutes: input.durationMinutes,
            lane: input.lane,
            reminderEnabled: input.reminderEnabled,
            title: input.title,
          });
          router.back();
        }}
      />
    </ScreenShell>
  );
}
