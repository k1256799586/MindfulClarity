import { colors, spacing } from './tokens';

export const typography = {
  eyebrow: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700' as const,
    letterSpacing: 1.6,
    textTransform: 'uppercase' as const,
  },
  hero: {
    color: colors.text,
    fontSize: 42,
    fontWeight: '900' as const,
    letterSpacing: -1.8,
    lineHeight: 44,
  },
  h1: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '800' as const,
    letterSpacing: -1.2,
    lineHeight: 34,
  },
  h2: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '800' as const,
    letterSpacing: -0.8,
    lineHeight: 30,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800' as const,
    letterSpacing: -0.5,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800' as const,
    letterSpacing: -0.5,
  },
  body: {
    color: colors.textMuted,
    fontSize: 15,
    fontWeight: '500' as const,
    lineHeight: 22,
  },
  strongBody: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700' as const,
    lineHeight: 22,
  },
  metricLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '700' as const,
    letterSpacing: 1.4,
    textTransform: 'uppercase' as const,
  },
  metricValue: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800' as const,
    marginTop: spacing.xs,
  },
  button: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800' as const,
    letterSpacing: -0.2,
  },
};
