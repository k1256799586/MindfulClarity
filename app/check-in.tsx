import { router } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import { InsightCard } from '@/components/insight-card';
import { ScreenShell } from '@/components/screen-shell';
import { TopBar } from '@/components/top-bar';
import { colors, spacing, typography } from '@/theme';

export default function CheckInScreen() {
  return (
    <ScreenShell>
      <TopBar title="Check-in" />
      <Text style={styles.title}>Session complete</Text>
      <Text style={styles.body}>
        You protected meaningful work. Capture one note before you move on.
      </Text>
      <InsightCard
        description="You completed 4 sessions today. Keep going."
        title="Focus Streak"
      />
      <Pressable onPress={() => router.back()} style={styles.button}>
        <Text style={styles.buttonLabel}>Return to Focus</Text>
      </Pressable>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.h1,
    marginBottom: spacing.sm,
  },
  body: {
    ...typography.body,
    marginBottom: spacing.xl,
  },
  button: {
    alignItems: 'center',
    backgroundColor: colors.dark,
    borderRadius: 18,
    marginTop: spacing.xl,
    paddingVertical: spacing.md,
  },
  buttonLabel: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
});
