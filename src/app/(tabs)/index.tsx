import React from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppText, Button, Card, Chip, Empty, IconBadge, ProgressBar, Ring, Row, Screen } from '../../ui';
import { useStore } from '../../state/store';
import { useTheme } from '../../theme/ThemeProvider';
import { levelForXp, xpForLevel } from '../../engine/progress';
import { ACHIEVEMENTS } from '../../engine/profile';
import { todayISO } from '../../lib/date';
import { recommendCategory } from '../../lib/recommend';
import { CATEGORIES, catById } from '../../data/categories';
import { radius, space } from '../../theme/tokens';

export default function Home() {
  const { profile } = useStore();
  const { colors } = useTheme();
  const router = useRouter();
  const today = todayISO();
  const level = levelForXp(profile.xp);
  const lo = xpForLevel(level), hi = xpForLevel(level + 1);
  const sessionsToday = profile.sessionsByDay[today] ?? 0;
  const dailyDone = !!profile.dailyDone[today];
  const rec = catById(recommendCategory(profile, new Date().getDate()))!;
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
  const streakAlive = profile.streak.lastDay === today || profile.streak.lastDay === todayISO(yesterday);
  const play = (category: string, mode: string) => router.push({ pathname: '/play', params: { category, mode } });

  return (
    <Screen>
      <Row style={{ justifyContent: 'space-between' }}>
        <View style={{ flex: 1 }}>
          <AppText v="caption" color={colors.muted}>{greet}</AppText>
          <AppText v="title" accessibilityRole="header">{profile.name || 'Ready to train?'}</AppText>
        </View>
        <Row style={{ backgroundColor: colors.surface2, borderRadius: radius.pill, paddingHorizontal: space.md, minHeight: 44 }} accessibilityLabel={`${streakAlive ? profile.streak.current : 0} day streak`}>
          <Ionicons name="flame" size={20} color={colors.warn} />
          <AppText v="label">{streakAlive ? profile.streak.current : 0}</AppText>
        </Row>
      </Row>

      <Card tint={colors.primary} style={{ borderColor: colors.primary }}>
        <View style={{ gap: space.md }}>
          <Row><Ionicons name="sparkles" size={20} color={colors.onPrimary} /><AppText v="label" color={colors.onPrimary}>Daily Challenge</AppText></Row>
          <AppText v="title" color={colors.onPrimary}>{dailyDone ? "Done for today. Nice work!" : 'A mixed workout of 8 puzzles, the same for everyone today.'}</AppText>
          <Button label={dailyDone ? 'Play again for practice' : 'Start challenge'} icon="play" variant="secondary" onPress={() => play('daily', 'daily')} />
        </View>
      </Card>

      <Row style={{ alignItems: 'stretch' }}>
        <Card style={{ flex: 1, alignItems: 'center', gap: space.sm }}>
          <Ring value={(profile.xp - lo) / (hi - lo)} size={92}>
            <AppText v="title">{level}</AppText><AppText v="caption" color={colors.muted}>level</AppText>
          </Ring>
          <AppText v="caption" color={colors.muted}>{profile.xp - lo} / {hi - lo} XP</AppText>
        </Card>
        <Card style={{ flex: 1, alignItems: 'center', gap: space.sm }}>
          <Ring value={sessionsToday / profile.dailyGoal} size={92} color={colors.accent}>
            <AppText v="title">{Math.min(sessionsToday, profile.dailyGoal)}/{profile.dailyGoal}</AppText>
          </Ring>
          <AppText v="caption" color={colors.muted}>{sessionsToday >= profile.dailyGoal ? 'Daily goal reached' : 'Daily goal'}</AppText>
        </Card>
      </Row>

      <Card>
        <Row>
          <IconBadge name={rec.icon} color={rec.color} />
          <View style={{ flex: 1 }}>
            <AppText v="caption" color={colors.muted}>Recommended for you</AppText>
            <AppText v="heading">{rec.title}</AppText>
            <AppText v="caption" color={colors.muted}>{rec.blurb}</AppText>
          </View>
        </Row>
        <View style={{ height: space.md }} />
        <Button label="Play quick round" onPress={() => play(rec.id, 'quick')} />
      </Card>

      <View style={{ gap: space.sm }}>
        <AppText v="heading">Quick play</AppText>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.sm }}>
          <Chip label="Mixed workout" icon="shuffle" onPress={() => play('mixed', 'mixed')} />
          {CATEGORIES.slice(0, 5).map((c) => <Chip key={c.id} label={c.title} icon={c.icon} onPress={() => router.push(`/category/${c.id}`)} />)}
        </View>
      </View>

      <View style={{ gap: space.sm }}>
        <Row style={{ justifyContent: 'space-between' }}>
          <AppText v="heading">Recent activity</AppText>
        </Row>
        {profile.history.length === 0 ? (
          <Card><Empty icon="rocket-outline" title="Nothing yet" body="Finish your first session and it will show up here." /></Card>
        ) : profile.history.slice(0, 3).map((h, i) => {
          const m = catById(h.category);
          return (
            <Card key={i} style={{ padding: space.md }}>
              <Row>
                <IconBadge name={m?.icon ?? 'shuffle'} color={m?.color ?? colors.primary} size={40} />
                <View style={{ flex: 1 }}><AppText v="label">{m?.title ?? (h.category === 'daily' ? 'Daily Challenge' : 'Mixed Workout')}</AppText><AppText v="caption" color={colors.muted}>{h.correct}/{h.total} correct · {h.date}</AppText></View>
                <AppText v="label" color={colors.accent}>+{h.xp} XP</AppText>
              </Row>
            </Card>
          );
        })}
      </View>

      <Pressable accessibilityRole="button" accessibilityLabel="View achievements" onPress={() => router.push('/achievements')}>
        <Card>
          <Row style={{ justifyContent: 'space-between' }}>
            <View style={{ flex: 1, gap: 6 }}>
              <AppText v="heading">Achievements</AppText>
              <ProgressBar value={profile.achievements.length / ACHIEVEMENTS.length} color={colors.accent} />
              <AppText v="caption" color={colors.muted}>{profile.achievements.length} of {ACHIEVEMENTS.length} unlocked</AppText>
            </View>
            <Ionicons name="chevron-forward" size={22} color={colors.muted} />
          </Row>
        </Card>
      </Pressable>
    </Screen>
  );
}
