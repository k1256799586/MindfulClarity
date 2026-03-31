import { StyleSheet, Text, View } from 'react-native';

import { colors, radii } from '@/theme';

type ProgressRingBadgeProps = {
  label: string;
};

export function ProgressRingBadge({ label }: ProgressRingBadgeProps) {
  return (
    <View style={styles.outer}>
      <View style={styles.inner}>
        <Text style={styles.label}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    alignItems: 'center',
    borderColor: colors.mintDeep,
    borderRadius: radii.pill,
    borderWidth: 3,
    height: 64,
    justifyContent: 'center',
    width: 64,
  },
  inner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: colors.mintDeep,
    fontSize: 22,
    fontWeight: '800',
  },
});
