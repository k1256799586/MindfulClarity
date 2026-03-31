import { router } from 'expo-router';
import { useState } from 'react';
import { Share, StyleSheet, Text, View } from 'react-native';

import { ConfirmationSheet } from '@/components/confirmation-sheet';
import { ScreenShell } from '@/components/screen-shell';
import { TopBar } from '@/components/top-bar';
import { SettingsSection } from '@/features/settings/settings-section';
import { ToggleRow } from '@/features/settings/toggle-row';
import { getExportPayload, shouldUseRemoteApi } from '@/lib/api-client';
import { useAppStore } from '@/store/app-store';
import { colors, radii, spacing, typography } from '@/theme';
import { buildExportPayload } from '@/services/export';

export default function SettingsScreen() {
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);
  const isRemoteMode = shouldUseRemoteApi();
  const appLimits = useAppStore((state) => state.appLimits);
  const settings = useAppStore((state) => state.settings);
  const updateSettingsRemote = useAppStore((state) => state.updateSettingsRemote);
  const resetAppDataRemote = useAppStore((state) => state.resetAppDataRemote);

  return (
    <ScreenShell>
      <TopBar title="Mindful Productivity" />

      <View style={styles.profileCard}>
        <View style={styles.profileAvatar}>
          <Text style={styles.profileAvatarLabel}>AC</Text>
        </View>
        <View style={styles.profileBody}>
          <Text style={styles.profileName}>Alex Chen</Text>
          <Text style={styles.profileRole}>Mindfulness Pioneer</Text>
        </View>
        <View>
          <Text style={styles.profileStreak}>42 DAY</Text>
          <Text style={styles.profileStreak}>STREAK</Text>
        </View>
      </View>

      <SettingsSection title="Account & Subscription">
        <ToggleRow label="Personal Information" />
        <ToggleRow label="Premium Membership" value="ACTIVE" />
      </SettingsSection>

      <SettingsSection title="Focus Experience">
        <ToggleRow
          label="Deep Work Mode"
          onToggle={(value) => void updateSettingsRemote({ deepWorkMode: value })}
          toggled={settings.deepWorkMode}
        />
        <ToggleRow
          label="Zen Notifications"
          onToggle={(value) => void updateSettingsRemote({ zenNotifications: value })}
          toggled={settings.zenNotifications}
        />
        <ToggleRow
          label="Visual Clarity"
          onPress={() => router.push('/monitoring-info')}
          value={settings.visualClarity}
        />
        <ToggleRow
          label="Daily Reminders"
          onToggle={(value) => void updateSettingsRemote({ remindersEnabled: value })}
          toggled={settings.remindersEnabled}
        />
      </SettingsSection>

      <SettingsSection title="Focus Control">
        <ToggleRow
          label="Usage Monitoring"
          onToggle={(value) => void updateSettingsRemote({ monitoringEnabled: value })}
          toggled={settings.monitoringEnabled}
        />
        {appLimits.map((limit) => (
          <ToggleRow
            key={limit.id}
            label={limit.appName}
            value={`${limit.dailyLimitMinutes}m`}
          />
        ))}
      </SettingsSection>

      <SettingsSection title="Privacy & Data">
        <ToggleRow
          label="Monitoring Info"
          onPress={() => router.push('/monitoring-info')}
        />
        <ToggleRow
          label="Export Data"
          onPress={async () => {
            const message = isRemoteMode
              ? await getExportPayload()
              : buildExportPayload(useAppStore.getState());

            await Share.share({
              message,
              title: 'Mindful Productivity Export',
            });
          }}
        />
      </SettingsSection>

      <SettingsSection title="Advanced">
        <ToggleRow label="Support Sanctuary" />
        <ToggleRow
          danger
          label="Reset Productivity Stats"
          onPress={() => setShowResetConfirmation(true)}
        />
      </SettingsSection>

      {showResetConfirmation ? (
        <ConfirmationSheet
          cancelLabel="Cancel"
          confirmLabel="Confirm Reset"
          danger
          message={
            isRemoteMode
              ? 'This clears your tasks, sessions, stats, and check-ins on the connected backend, then restores the default sample state.'
              : 'This clears your local tasks, sessions, stats, and check-ins, then restores the default sample state.'
          }
          onCancel={() => setShowResetConfirmation(false)}
          onConfirm={() => {
            void resetAppDataRemote();
            setShowResetConfirmation(false);
          }}
          title="Reset your progress?"
        />
      ) : null}

      <View style={styles.footerCard}>
        <Text style={styles.footerButton}>Sign Out of Sanctuary</Text>
      </View>
      <Text style={styles.footerMeta}>VERSION 2.4.0 (MINDFUL CLARITY)</Text>
      <Text style={styles.footerCaption}>Crafted for your inner peace.</Text>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  profileAvatar: {
    alignItems: 'center',
    backgroundColor: '#163b3a',
    borderRadius: radii.md,
    height: 60,
    justifyContent: 'center',
    marginRight: spacing.md,
    width: 60,
  },
  profileAvatarLabel: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '800',
  },
  profileBody: {
    flex: 1,
  },
  profileName: {
    ...typography.strongBody,
  },
  profileRole: {
    ...typography.body,
  },
  profileStreak: {
    color: colors.mintDeep,
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'right',
  },
  footerCard: {
    alignItems: 'center',
    backgroundColor: '#63646a',
    borderRadius: radii.md,
    marginTop: spacing.xxl,
    paddingVertical: spacing.md,
  },
  footerButton: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
  footerMeta: {
    ...typography.eyebrow,
    alignSelf: 'center',
    marginTop: spacing.xl,
  },
  footerCaption: {
    ...typography.body,
    alignSelf: 'center',
    marginTop: spacing.xs,
  },
});
