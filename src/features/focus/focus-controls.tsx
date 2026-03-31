import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing } from '@/theme';

type FocusControlsProps = {
  isPaused: boolean;
  onPauseResume: () => void;
  onComplete: () => void;
};

export function FocusControls({
  isPaused,
  onPauseResume,
  onComplete,
}: FocusControlsProps) {
  return (
    <View style={styles.row}>
      <Pressable onPress={onPauseResume} style={styles.control}>
        <Text style={styles.label}>{isPaused ? 'Resume' : 'Pause'}</Text>
      </Pressable>
      <Pressable onPress={onComplete} style={styles.control}>
        <Text style={styles.label}>Complete</Text>
      </Pressable>
      <View style={styles.control}>
        <Text style={styles.label}>Ambient</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'center',
  },
  control: {
    alignItems: 'center',
    backgroundColor: '#f1f3f6',
    borderRadius: radii.md,
    justifyContent: 'center',
    minHeight: 56,
    minWidth: 88,
    paddingHorizontal: spacing.md,
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
});
