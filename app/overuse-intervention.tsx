import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ScreenShell } from '@/components/screen-shell';
import { TopBar } from '@/components/top-bar';
import { colors, radii, spacing, typography } from '@/theme';

export default function OveruseInterventionScreen() {
  return (
    <ScreenShell>
      <TopBar title="Mindful Productivity" />
      <Text style={styles.eyebrow}>Distraction Limit Reached</Text>
      <Text style={styles.title}>Return to calm work.</Text>
      <Text style={styles.body}>
        You have reached your limit for this distracting app. The healthiest
        next step is to rejoin your active intention.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Instagram</Text>
        <Text style={styles.cardMeta}>44m used / 40m limit</Text>
      </View>

      <Pressable onPress={() => router.back()} style={styles.primaryAction}>
        <Text style={styles.primaryLabel}>Return to Focus</Text>
      </Pressable>
      <Pressable onPress={() => router.back()} style={styles.secondaryAction}>
        <Text style={styles.secondaryLabel}>Extend by 5 Minutes</Text>
      </Pressable>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    ...typography.eyebrow,
    color: colors.alert,
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.h1,
    marginBottom: spacing.sm,
  },
  body: {
    ...typography.body,
    marginBottom: spacing.xl,
  },
  card: {
    backgroundColor: '#f6ece9',
    borderRadius: radii.md,
    marginBottom: spacing.xl,
    padding: spacing.lg,
  },
  cardTitle: {
    ...typography.strongBody,
    marginBottom: spacing.xs,
  },
  cardMeta: {
    ...typography.body,
  },
  primaryAction: {
    alignItems: 'center',
    backgroundColor: colors.dark,
    borderRadius: radii.md,
    marginBottom: spacing.md,
    paddingVertical: spacing.md,
  },
  primaryLabel: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
  secondaryAction: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
  },
  secondaryLabel: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
});
