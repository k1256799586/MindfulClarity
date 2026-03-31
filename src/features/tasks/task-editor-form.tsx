import { useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';

import { PrimaryButton } from '@/components/primary-button';
import { colors, radii, spacing, typography } from '@/theme';
import type { TaskLane } from '@/types/models';

type TaskEditorFormProps = {
  onCancel?: () => void;
  onSave: (input: {
    title: string;
    durationMinutes: number;
    lane: TaskLane;
    reminderEnabled: boolean;
  }) => void;
};

export function TaskEditorForm({ onCancel, onSave }: TaskEditorFormProps) {
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('45');
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [lane, setLane] = useState<TaskLane>('focus');

  return (
    <View style={styles.card}>
      <TextInput
        onChangeText={setTitle}
        placeholder="Task name"
        placeholderTextColor={colors.textMuted}
        style={styles.input}
        value={title}
      />
      <TextInput
        keyboardType="number-pad"
        onChangeText={setDuration}
        placeholder="Duration"
        placeholderTextColor={colors.textMuted}
        style={styles.input}
        value={duration}
      />
      <View style={styles.segmentRow}>
        <Pressable
          onPress={() => setLane('focus')}
          style={[styles.segment, lane === 'focus' ? styles.segmentActive : undefined]}
        >
          <Text
            style={[
              styles.segmentLabel,
              lane === 'focus' ? styles.segmentLabelActive : undefined,
            ]}
          >
            Focus
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setLane('transition')}
          style={[
            styles.segment,
            lane === 'transition' ? styles.segmentActive : undefined,
          ]}
        >
          <Text
            style={[
              styles.segmentLabel,
              lane === 'transition' ? styles.segmentLabelActive : undefined,
            ]}
          >
            Transition
          </Text>
        </Pressable>
      </View>
      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Reminder</Text>
        <Switch
          onValueChange={setReminderEnabled}
          trackColor={{ false: '#d7dde4', true: '#8dd9c4' }}
          value={reminderEnabled}
        />
      </View>
      <View style={styles.actions}>
        {onCancel ? (
          <Pressable onPress={onCancel}>
            <Text style={styles.cancel}>Cancel</Text>
          </Pressable>
        ) : null}
        <PrimaryButton
          label="Save Task"
          onPress={() => {
            if (!title.trim()) {
              return;
            }

            onSave({
              title: title.trim(),
              durationMinutes: Number.parseInt(duration || '0', 10) || 25,
              lane,
              reminderEnabled,
            });
            setTitle('');
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    gap: spacing.md,
    padding: spacing.md,
  },
  input: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.sm,
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  segmentRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  segment: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.pill,
    flex: 1,
    paddingVertical: spacing.sm,
  },
  segmentActive: {
    backgroundColor: '#dff2ea',
  },
  segmentLabel: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '700',
  },
  segmentLabelActive: {
    color: colors.mintDeep,
  },
  switchRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  switchLabel: {
    ...typography.strongBody,
  },
  actions: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancel: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '700',
  },
});
