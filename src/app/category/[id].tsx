import React from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AppText, Button, Card, IconBadge, ProgressBar, Row, Screen } from '../../ui';
import { catById } from '../../data/categories';
import { useStore } from '../../state/store';
import { useTheme } from '../../theme/ThemeProvider';
import { space } from '../../theme/tokens';

export default function CategoryDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { profile } = useStore();
  const c = catById(id ?? '');
  if (!c) return <Screen><AppText v="title">Category not found</AppText><Button label="Back" onPress={() => router.back()} /></Screen>;
  const s = profile.categoryStats[c.id];
  const acc = s && s.total ? Math.round((s.correct / s.total) * 100) : 0;
  const play = (mode: string) => router.push({ pathname: '/play', params: { category: c.id, mode } });
  return (
    <Screen>
      <Button label="Back" icon="chevron-back" variant="ghost" onPress={() => router.back()} style={{ alignSelf: 'flex-start' }} />
      <Row><IconBadge name={c.icon} color={c.color} size={64} /><View style={{ flex: 1 }}><AppText v="title" accessibilityRole="header">{c.title}</AppText><AppText color={colors.muted}>Trains: {c.skill}</AppText></View></Row>
      <Card><View style={{ gap: space.sm }}><AppText v="heading">How it works</AppText><AppText color={colors.muted}>{c.how}</AppText></View></Card>
      <Card><View style={{ gap: space.sm }}>
        <AppText v="heading">Your stats</AppText>
        {s ? (<><AppText color={colors.muted}>{s.played} sessions · {s.correct} of {s.total} correct</AppText><ProgressBar value={acc / 100} color={c.color} /><AppText v="caption" color={colors.muted}>{acc}% accuracy</AppText></>)
          : <AppText color={colors.muted}>Not played yet. Try a quick round to get started.</AppText>}
      </View></Card>
      <AppText v="heading">Choose a mode</AppText>
      <Button label="Quick challenge · 5 questions" icon="flash" onPress={() => play('quick')} />
      <Button label="Timed challenge · 10 questions" icon="timer" variant="secondary" onPress={() => play('timed')} />
      <Button label="Practice · 8 questions, half XP" icon="school" variant="secondary" onPress={() => play('practice')} />
    </Screen>
  );
}
