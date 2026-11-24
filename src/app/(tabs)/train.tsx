import React from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText, Button, Card, IconBadge, ProgressBar, Screen } from '../../ui';
import { CATEGORIES } from '../../data/categories';
import { useStore } from '../../state/store';
import { useTheme } from '../../theme/ThemeProvider';
import { space } from '../../theme/tokens';

export default function Train() {
  const router = useRouter();
  const { profile } = useStore();
  const { colors } = useTheme();
  return (
    <Screen>
      <AppText v="title" accessibilityRole="header">Train</AppText>
      <Card tint={colors.surface2}>
        <View style={{ gap: space.sm }}>
          <AppText v="heading">Mixed Brain Workout</AppText>
          <AppText color={colors.muted}>Ten puzzles from across all categories. Gets harder as you go.</AppText>
          <Button label="Start workout" icon="shuffle" onPress={() => router.push({ pathname: '/play', params: { category: 'mixed', mode: 'mixed' } })} />
        </View>
      </Card>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.md }}>
        {CATEGORIES.map((c) => {
          const s = profile.categoryStats[c.id];
          const acc = s && s.total ? s.correct / s.total : 0;
          return (
            <Pressable key={c.id} accessibilityRole="button" accessibilityLabel={`${c.title}. ${c.blurb}`} onPress={() => router.push(`/category/${c.id}`)} style={{ width: '47.5%' }}>
              <Card style={{ gap: space.sm, minHeight: 150 }}>
                <IconBadge name={c.icon} color={c.color} />
                <AppText v="label">{c.title}</AppText>
                <AppText v="caption" color={colors.muted}>{c.blurb}</AppText>
                <ProgressBar value={acc} color={c.color} height={6} />
              </Card>
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}
