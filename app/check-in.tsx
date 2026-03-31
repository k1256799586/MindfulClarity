import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { InsightCard } from '@/components/insight-card';
import { PrimaryButton } from '@/components/primary-button';
import { ScreenShell } from '@/components/screen-shell';
import { TopBar } from '@/components/top-bar';
import { useAppStore } from '@/store/app-store';
import { colors, spacing, typography } from '@/theme';

export default function CheckInScreen() {
  const [note, setNote] = useState('');
  const streak = useAppStore((state) => state.streak);
  const submitCheckIn = useAppStore((state) => state.submitCheckIn);

  return (
    <ScreenShell>
      <TopBar title="Check-in" />
      <Text style={styles.title}>Session complete</Text>
      <Text style={styles.body}>
        You protected meaningful work. Capture one note before you move on.
      </Text>
      <InsightCard
        description={`You're on a ${streak.currentDays}-day streak. Keep the momentum grounded with one honest reflection.`}
        title="Focus Streak"
      />
      <View style={styles.form}>
        <TextInput
          multiline
          onChangeText={setNote}
          placeholder="What helped you stay with the work?"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          textAlignVertical="top"
          value={note}
        />
        <PrimaryButton
          label="Save Check-in"
          onPress={() => {
            submitCheckIn(note);
            router.replace('/(tabs)');
          }}
        />
      </View>
      <Pressable onPress={() => router.replace('/(tabs)')} style={styles.linkButton}>
        <Text style={styles.linkLabel}>Skip note for now</Text>
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
  form: {
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
    minHeight: 120,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  linkButton: {
    alignSelf: 'center',
    marginTop: spacing.lg,
    paddingVertical: spacing.sm,
  },
  linkLabel: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '700',
  },
});
