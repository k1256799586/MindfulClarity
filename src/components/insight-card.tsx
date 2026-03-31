import { StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '@/theme';

type InsightCardProps = {
  eyebrow?: string;
  title: string;
  description: string;
  dark?: boolean;
};

export function InsightCard({
  eyebrow,
  title,
  description,
  dark = false,
}: InsightCardProps) {
  return (
    <View style={[styles.card, dark ? styles.darkCard : undefined]}>
      {eyebrow ? (
        <Text style={[styles.eyebrow, dark ? styles.darkEyebrow : undefined]}>
          {eyebrow}
        </Text>
      ) : null}
      <Text style={[styles.title, dark ? styles.darkTitle : undefined]}>
        {title}
      </Text>
      <Text
        style={[styles.description, dark ? styles.darkDescription : undefined]}
      >
        {description}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: radii.md,
    padding: spacing.lg,
  },
  darkCard: {
    backgroundColor: colors.dark,
  },
  eyebrow: {
    ...typography.eyebrow,
    marginBottom: spacing.xs,
  },
  darkEyebrow: {
    color: '#8fbfae',
  },
  title: {
    ...typography.strongBody,
    marginBottom: spacing.xs,
  },
  darkTitle: {
    color: colors.white,
  },
  description: {
    ...typography.body,
  },
  darkDescription: {
    color: '#d2d5db',
  },
});
