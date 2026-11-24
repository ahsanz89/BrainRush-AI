import React from 'react';
import { Alert, Switch, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText, Button, Card, Row, Screen, Segmented } from '../ui';
import { useStore } from '../state/store';
import { useTheme } from '../theme/ThemeProvider';
import { cancelReminder } from '../lib/notify';
import { radius, space } from '../theme/tokens';

export default function Settings() {
  const { profile, update, reset } = useStore();
  const { colors } = useTheme();
  const router = useRouter();
  const confirmReset = () => Alert.alert('Delete all my data?', 'This permanently erases your progress, streaks and settings from this device. It cannot be undone.', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Delete everything', style: 'destructive', onPress: async () => { await cancelReminder().catch(() => {}); await reset(); router.replace('/onboarding'); } }]);
  return (
    <Screen>
      <Button label="Back" icon="chevron-back" variant="ghost" onPress={() => router.back()} style={{ alignSelf: 'flex-start' }} />
      <AppText v="title" accessibilityRole="header">Settings</AppText>
      <Card><View style={{ gap: space.md }}>
        <AppText v="label">Nickname</AppText>
        <TextInput value={profile.name} onChangeText={(t) => update((p) => ({ ...p, name: t }))} maxLength={24} placeholder="Nickname" placeholderTextColor={colors.muted} accessibilityLabel="Nickname"
          style={{ minHeight: 48, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, color: colors.text, paddingHorizontal: space.md, fontSize: 16 }} />
      </View></Card>
      <Card><View style={{ gap: space.md }}>
        <AppText v="label">Appearance</AppText>
        <Segmented options={[{ label: 'System', value: 'system' }, { label: 'Light', value: 'light' }, { label: 'Dark', value: 'dark' }] as const as any} value={profile.theme} onChange={(v: any) => update((p) => ({ ...p, theme: v }))} />
        <AppText v="label">Difficulty</AppText>
        <Segmented options={[{ label: 'Easy', value: 'easy' }, { label: 'Medium', value: 'medium' }, { label: 'Hard', value: 'hard' }] as any} value={profile.difficulty} onChange={(v: any) => update((p) => ({ ...p, difficulty: v }))} />
        <AppText v="label">Daily goal (sessions)</AppText>
        <Segmented options={[1, 2, 3, 4, 5].map((n) => ({ label: String(n), value: n }))} value={profile.dailyGoal} onChange={(v) => update((p) => ({ ...p, dailyGoal: v }))} />
        <Row style={{ justifyContent: 'space-between' }}>
          <AppText v="label">Haptic feedback</AppText>
          <Switch value={profile.haptics} onValueChange={(v) => update((p) => ({ ...p, haptics: v }))} accessibilityLabel="Haptic feedback" trackColor={{ true: colors.primary }} />
        </Row>
      </View></Card>
      <Card><View style={{ gap: space.md }}>
        <AppText v="heading">Your data</AppText>
        <AppText color={colors.muted}>Everything is stored on this device only. You can erase it at any time.</AppText>
        <Button label="Delete all my data" variant="danger" icon="trash" onPress={confirmReset} />
      </View></Card>
    </Screen>
  );
}
