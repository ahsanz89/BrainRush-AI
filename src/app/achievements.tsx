import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText, Button, Card, IconBadge, Row, Screen, ProgressBar } from '../ui';
import { ACHIEVEMENTS } from '../engine/profile';
import { useStore } from '../state/store';
import { useTheme } from '../theme/ThemeProvider';

export default function Achievements() {
  const { profile } = useStore();
  const { colors } = useTheme();
  const router = useRouter();
  return (
    <Screen>
      <Button label="Back" icon="chevron-back" variant="ghost" onPress={() => router.back()} style={{ alignSelf: 'flex-start' }} />
      <AppText v="title" accessibilityRole="header">Achievements</AppText>
      <ProgressBar value={profile.achievements.length / ACHIEVEMENTS.length} color={colors.accent} />
      <AppText color={colors.muted}>{profile.achievements.length} of {ACHIEVEMENTS.length} unlocked</AppText>
      {ACHIEVEMENTS.map((a) => { const on = profile.achievements.includes(a.id); return (
        <Card key={a.id} style={{ opacity: on ? 1 : 0.6 }}>
          <Row accessibilityLabel={`${a.title}. ${a.description}. ${on ? 'Unlocked' : 'Locked'}`}>
            <IconBadge name={(on ? a.icon : 'lock-closed') as any} color={on ? colors.warn : colors.muted} />
            <View style={{ flex: 1 }}><AppText v="label">{a.title}</AppText><AppText v="caption" color={colors.muted}>{a.description}</AppText></View>
            {on ? <AppText v="caption" color={colors.accent}>Unlocked</AppText> : null}
          </Row>
        </Card>); })}
    </Screen>
  );
}
