import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ConfirmationSheet } from '@/components/confirmation-sheet';
import { EmptyState } from '@/components/empty-state';
import { PrimaryButton } from '@/components/primary-button';
import { ScreenShell } from '@/components/screen-shell';
import { TopBar } from '@/components/top-bar';
import { FocusControls } from '@/features/focus/focus-controls';
import { FocusTimerRing } from '@/features/focus/focus-timer-ring';
import { useFocusClock } from '@/features/focus/use-focus-clock';
import { useAppStore } from '@/store/app-store';
import { colors, spacing, typography } from '@/theme';

export default function FocusScreen() {
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const focusSessions = useAppStore((state) => state.focusSessions);
  const tasks = useAppStore((state) => state.tasks);
  const pauseFocusSessionRemote = useAppStore((state) => state.pauseFocusSessionRemote);
  const resumeFocusSessionRemote = useAppStore((state) => state.resumeFocusSessionRemote);
  const completeFocusSessionRemote = useAppStore((state) => state.completeFocusSessionRemote);
  const abandonFocusSessionRemote = useAppStore((state) => state.abandonFocusSessionRemote);
  const startFocusSessionRemote = useAppStore((state) => state.startFocusSessionRemote);
  const streak = useAppStore((state) => state.streak);

  const session = focusSessions[0];
  const currentTask =
    tasks.find((task) => task.id === session?.taskId) ??
    tasks.find((task) => task.status === 'in_progress') ??
    tasks.find((task) => task.lane === 'focus' && task.status === 'todo');
  const { remainingSeconds, timeLabel } = useFocusClock(session);

  if (!session || session.status === 'abandoned') {
    return (
      <ScreenShell
        footer={
          <PrimaryButton
            label="Start Focus"
            onPress={() => {
              if (currentTask) {
                void startFocusSessionRemote(
                  currentTask.id,
                  currentTask.title,
                  currentTask.durationMinutes
                );
              }
            }}
          />
        }
      >
        <TopBar title="Mindful Productivity" />
        <EmptyState
          message="Choose a task and start a calm, uninterrupted session."
          title="No active session"
        />
      </ScreenShell>
    );
  }

  if (session.status === 'completed') {
    return (
      <ScreenShell
        footer={
          <PrimaryButton
            label="Open Check-in"
            onPress={() => router.push('/check-in')}
          />
        }
      >
        <TopBar title="Mindful Productivity" />
        <EmptyState
          message="Capture one note to lock in the work you just protected."
          title="Session complete"
        />
      </ScreenShell>
    );
  }

  return (
    <ScreenShell>
      <TopBar title="Mindful Productivity" />
      <Text style={styles.eyebrow}>Deep Work Session</Text>
      <Text style={styles.title}>{session.taskTitle}</Text>

      <View style={styles.timerWrap}>
        <FocusTimerRing timeLabel={timeLabel} />
      </View>

      <FocusControls
        isPaused={session.status === 'paused'}
        onComplete={() => {
          void completeFocusSessionRemote();
          router.push('/check-in');
        }}
        onPauseResume={() => {
          if (session.status === 'paused') {
            void resumeFocusSessionRemote();
            return;
          }

          void pauseFocusSessionRemote(remainingSeconds);
        }}
      />

      <View style={styles.stopWrap}>
        <PrimaryButton label="Stop Session" onPress={() => setShowExitConfirmation(true)} />
      </View>

      {showExitConfirmation ? (
        <ConfirmationSheet
          cancelLabel="Keep Session"
          confirmLabel="End Session"
          danger
          message="You can return to this task later, but this focus block will be marked as interrupted."
          onCancel={() => setShowExitConfirmation(false)}
          onConfirm={() => {
            void abandonFocusSessionRemote();
            setShowExitConfirmation(false);
          }}
          title="Leave this session early?"
        />
      ) : null}

      <View style={styles.streakCard}>
        <Text style={styles.streakTitle}>Focus Streak</Text>
        <Text style={styles.streakBody}>
          You&apos;ve completed {streak.currentDays >= 4 ? 4 : streak.currentDays}{' '}
          sessions today. Keep going!
        </Text>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    ...typography.eyebrow,
    alignSelf: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.h1,
    alignSelf: 'center',
    marginBottom: spacing.xxxl,
  },
  timerWrap: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  stopWrap: {
    alignItems: 'center',
    marginTop: spacing.xxl,
  },
  streakCard: {
    backgroundColor: '#f1f6f4',
    borderRadius: 22,
    marginTop: spacing.xxxl,
    padding: spacing.lg,
  },
  streakTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  streakBody: {
    ...typography.body,
  },
});
