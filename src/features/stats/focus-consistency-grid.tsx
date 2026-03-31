import { StyleSheet, View } from 'react-native';

import { colors, radii, spacing } from '@/theme';

const CELLS = [
  0.2, 0.6, 0.9, 0.4, 0.7,
  0.3, 0.7, 1, 0.5, 0.6,
  0.25, 0.5, 0.8, 0.45, 0.55,
];

export function FocusConsistencyGrid() {
  return (
    <View style={styles.grid}>
      {CELLS.map((opacity, index) => (
        <View
          key={index}
          style={[styles.cell, { opacity }]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  cell: {
    backgroundColor: colors.mint,
    borderRadius: radii.sm,
    height: 28,
    width: 28,
  },
});
