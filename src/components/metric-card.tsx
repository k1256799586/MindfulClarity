import { StyleSheet, Text, View } from 'react-native';

import { colors, radii, shadows, spacing, typography } from '@/theme';

type MetricCardProps = {
  label: string;
  value: string;
  accentColor?: string;
  muted?: boolean;
};

export function MetricCard({
  label,
  value,
  accentColor = colors.mint,
  muted = false,
}: MetricCardProps) {
  return (
    <View
      style={[
        styles.card,
        muted ? styles.mutedCard : undefined,
      ]}
    >
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      <View style={[styles.rule, { backgroundColor: accentColor }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    minHeight: 112,
    padding: spacing.md,
    ...shadows.card,
  },
  mutedCard: {
    backgroundColor: colors.surfaceMuted,
  },
  label: {
    ...typography.metricLabel,
  },
  value: {
    ...typography.metricValue,
  },
  rule: {
    borderRadius: radii.pill,
    height: 3,
    marginTop: 'auto',
    width: 80,
  },
});
