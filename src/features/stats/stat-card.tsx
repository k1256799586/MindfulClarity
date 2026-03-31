import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '@/theme';

type StatCardProps = {
  eyebrow?: string;
  title: string;
  value: string;
  accent?: ReactNode;
  tone?: 'default' | 'soft' | 'alert';
};

export function StatCard({
  eyebrow,
  title,
  value,
  accent,
  tone = 'default',
}: StatCardProps) {
  return (
    <View
      style={[
        styles.card,
        tone === 'soft' ? styles.softCard : undefined,
        tone === 'alert' ? styles.alertCard : undefined,
      ]}
    >
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      <View style={styles.row}>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.value}>{value}</Text>
        </View>
        {accent}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.lg,
  },
  softCard: {
    backgroundColor: '#f0f4f8',
  },
  alertCard: {
    backgroundColor: '#f6ece9',
  },
  eyebrow: {
    ...typography.eyebrow,
    marginBottom: spacing.sm,
  },
  row: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    ...typography.strongBody,
    marginBottom: spacing.xs,
  },
  value: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -1,
  },
});
