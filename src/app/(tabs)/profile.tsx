import React from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppText, Card, Row, Screen, IconBadge } from '../../ui';
import type { IconName } from '../../ui';
import { useStore } from '../../state/store';
import { useTheme } from '../../theme/ThemeProvider';
import { levelForXp } from '../../engine/progress';
import { APP_CONFIG } from '../../config';
import { space } from '../../theme/tokens';

export default function Profile() {
  const { profile } = useStore();
  const { colors } = useTheme();
  const router = useRouter();
  const item = (icon: IconName, label: string, href: string) => (
    <Pressable key={label} accessibilityRole="button" accessibilityLabel={label} onPress={() => router.push(href as any)} style={{ minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: space.md }}>
      <Ionicons name={icon} size={22} color={colors.primary} /><AppText style={{ flex: 1 }}>{label}</AppText><Ionicons name="chevron-forward" size={20} color={colors.muted} />
    </Pressable>);
  return (
    <Screen>
      <Row>
        <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}>
          <AppText v="title" color={colors.onPrimary}>{(profile.name || 'B').slice(0, 1).toUpperCase()}</AppText>
        </View>
        <View style={{ flex: 1 }}>
          <AppText v="title" accessibilityRole="header">{profile.name || 'Brain Trainer'}</AppText>
          <AppText color={colors.muted}>Level {levelForXp(profile.xp)} · {profile.xp} XP</AppText>
        </View>
      </Row>
      <Card><View>
        {item('trophy-outline', 'Achievements', '/achievements')}
        {item('settings-outline', 'Settings', '/settings')}
        {item('notifications-outline', 'Reminders', '/notifications')}
      </View></Card>
      <Card><View>
        {item('shield-checkmark-outline', 'Privacy Policy', '/legal/privacy')}
        {item('document-text-outline', 'Terms of Use', '/legal/terms')}
        {item('help-buoy-outline', 'Help and Support', '/legal/support')}
        {item('wallet-outline', 'How BrainRush is funded', '/legal/monetization')}
      </View></Card>
      <AppText v="caption" color={colors.muted} style={{ textAlign: 'center' }}>{APP_CONFIG.appName} v{APP_CONFIG.version}</AppText>
    </Screen>
  );
}
