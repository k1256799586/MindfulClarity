import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { colors, typography } from '@/theme';

type FocusTimerRingProps = {
  timeLabel: string;
};

const SIZE = 236;
const STROKE = 8;
const RADIUS = (SIZE - STROKE) / 2;

export function FocusTimerRing({ timeLabel }: FocusTimerRingProps) {
  return (
    <View style={styles.wrap}>
      <Svg height={SIZE} width={SIZE}>
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          fill="transparent"
          r={RADIUS}
          stroke="#dfeae6"
          strokeWidth={STROKE}
        />
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          fill="transparent"
          r={RADIUS}
          stroke={colors.mint}
          strokeWidth={STROKE}
        />
      </Svg>
      <View style={styles.labelWrap}>
        <Text style={styles.time}>{timeLabel}</Text>
        <Text style={styles.subhead}>REMAINING</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelWrap: {
    alignItems: 'center',
    position: 'absolute',
  },
  time: {
    ...typography.h1,
    fontSize: 56,
    lineHeight: 58,
  },
  subhead: {
    ...typography.eyebrow,
  },
});
