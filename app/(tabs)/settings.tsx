import { router } from 'expo-router';
import { Share, StyleSheet, Text, View } from 'react-native';

import { ScreenShell } from '@/components/screen-shell';
import { TopBar } from '@/components/top-bar';
import { SettingsSection } from '@/features/settings/settings-section';
import { ToggleRow } from '@/features/settings/toggle-row';
import { buildExportPayload } from '@/services/export';
import { useAppStore } from '@/store/app-store';
import { colors, radii, spacing, typography } from '@/theme';

export default function SettingsScreen() {
  const settings = useAppStore((state) => state.settings);
  const updateSettings = useAppStore((state) => state.updateSettings);
  const resetAppData = useAppStore((state) => state.resetAppData);

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
          onToggle={(value) => updateSettings({ deepWorkMode: value })}
          toggled={settings.deepWorkMode}
        />
        <ToggleRow
          label="Zen Notifications"
          onToggle={(value) => updateSettings({ zenNotifications: value })}
          toggled={settings.zenNotifications}
        />
        <ToggleRow
          label="Visual Clarity"
          onPress={() => router.push('/monitoring-info')}
          value={settings.visualClarity}
        />
      </SettingsSection>

      <SettingsSection title="Privacy & Data">
        <ToggleRow
          label="Monitoring Info"
          onPress={() => router.push('/monitoring-info')}
        />
        <ToggleRow
          label="Export Local Data"
          onPress={async () => {
            await Share.share({
              message: buildExportPayload(useAppStore.getState()),
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
          onPress={() => resetAppData()}
        />
      </SettingsSection>

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
