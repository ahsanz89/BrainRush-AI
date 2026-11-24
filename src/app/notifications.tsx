import React, { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText, Button, Card, Screen, Segmented } from '../ui';
import { useStore } from '../state/store';
import { useTheme } from '../theme/ThemeProvider';
import { cancelReminder, scheduleDailyReminder } from '../lib/notify';
import { space } from '../theme/tokens';

const HOURS = [8, 12, 18, 20];
export default function Notifications() {
  const { profile, update } = useStore();
  const { colors } = useTheme();
  const router = useRouter();
  const [msg, setMsg] = useState('');
  const r = profile.reminders;
  const apply = async (enabled: boolean, hour: number) => {
    if (enabled) {
      const ok = await scheduleDailyReminder(hour, 0).catch(() => false);
      if (!ok) { setMsg('Notifications are blocked. Enable them for BrainRush AI in your phone settings.'); update((p) => ({ ...p, reminders: { enabled: false, hour, minute: 0 } })); return; }
    } else await cancelReminder().catch(() => {});
    setMsg(''); update((p) => ({ ...p, reminders: { enabled, hour, minute: 0 } }));
  };
  const fmt = (h: number) => `${h % 12 === 0 ? 12 : h % 12} ${h < 12 ? 'am' : 'pm'}`;
  return (
    <Screen>
      <Button label="Back" icon="chevron-back" variant="ghost" onPress={() => router.back()} style={{ alignSelf: 'flex-start' }} />
      <AppText v="title" accessibilityRole="header">Reminders</AppText>
      <Card><View style={{ gap: space.md }}>
        <AppText v="label">Daily reminder</AppText>
        <Segmented options={[{ label: 'On', value: true }, { label: 'Off', value: false }]} value={r.enabled} onChange={(v) => apply(v, r.hour)} />
        {r.enabled && (<><AppText v="label">Time</AppText>
          <Segmented options={HOURS.map((h) => ({ label: fmt(h), value: h }))} value={HOURS.includes(r.hour) ? r.hour : 18} onChange={(h) => apply(true, h)} /></>)}
        <AppText v="caption" color={colors.muted}>Reminders are created on your device and need no account or internet.</AppText>
        {msg ? <AppText color={colors.warn}>{msg}</AppText> : null}
      </View></Card>
    </Screen>
  );
}
