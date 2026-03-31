import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '@/theme';

type ToggleRowProps = {
  label: string;
  value?: string;
  toggled?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
  danger?: boolean;
};

export function ToggleRow({
  label,
  value,
  toggled,
  onPress,
  onToggle,
  danger = false,
}: ToggleRowProps) {
  return (
    <Pressable onPress={onPress} style={styles.row}>
      <Text style={[styles.label, danger ? styles.danger : undefined]}>{label}</Text>
      {typeof toggled === 'boolean' ? (
        <Switch
          onValueChange={onToggle}
          trackColor={{ false: '#d5dce5', true: '#8fd6c1' }}
          value={toggled}
        />
      ) : (
        <View style={styles.valueWrap}>
          {value ? <Text style={styles.value}>{value}</Text> : null}
          <Text style={styles.chevron}>{'>'}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  label: {
    ...typography.strongBody,
  },
  danger: {
    color: colors.alert,
  },
  valueWrap: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  value: {
    color: colors.mintDeep,
    fontSize: 13,
    fontWeight: '700',
    marginRight: spacing.sm,
  },
  chevron: {
    color: colors.textMuted,
    fontSize: 16,
  },
});
