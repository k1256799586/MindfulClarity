import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/theme';

type TopBarProps = {
  title: string;
  leftGlyph?: string;
  rightGlyph?: string;
};

export function TopBar({
  title,
  leftGlyph = '●',
  rightGlyph = '◌',
}: TopBarProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.glyph}>{leftGlyph}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.glyph}>{rightGlyph}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  title: {
    color: colors.text,
    flex: 1,
    fontSize: 20,
    fontWeight: '800',
    marginHorizontal: spacing.sm,
  },
  glyph: {
    color: colors.textMuted,
    fontSize: 18,
    width: 24,
  },
});
