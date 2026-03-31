import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '@/theme';

type ConfirmationSheetProps = {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmationSheet({
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  danger = false,
  onConfirm,
  onCancel,
}: ConfirmationSheetProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      <View style={styles.actions}>
        <Pressable onPress={onCancel} style={styles.secondaryAction}>
          <Text style={styles.secondaryLabel}>{cancelLabel}</Text>
        </Pressable>
        <Pressable
          onPress={onConfirm}
          style={[styles.primaryAction, danger ? styles.dangerAction : undefined]}
        >
          <Text style={styles.primaryLabel}>{confirmLabel}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: radii.lg,
    borderWidth: 1,
    marginTop: spacing.lg,
    padding: spacing.lg,
  },
  title: {
    ...typography.h2,
    marginBottom: spacing.xs,
  },
  message: {
    ...typography.body,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  secondaryAction: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.md,
    flex: 1,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: spacing.md,
  },
  secondaryLabel: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  primaryAction: {
    alignItems: 'center',
    backgroundColor: colors.dark,
    borderRadius: radii.md,
    flex: 1,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: spacing.md,
  },
  dangerAction: {
    backgroundColor: colors.alert,
  },
  primaryLabel: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '800',
  },
});
