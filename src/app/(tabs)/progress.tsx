import React from 'react';
import { View } from 'react-native';
import { AppText, Card, Empty, ProgressBar, Row, Screen } from '../../ui';
import { useStore } from '../../state/store';
import { useTheme } from '../../theme/ThemeProvider';
import { levelForXp } from '../../engine/progress';
import { CATEGORIES, catById } from '../../data/categories';
import { lastDays, shortDay, todayISO } from '../../lib/date';
import { space } from '../../theme/tokens';

export default function Progress() {
  const { profile } = useStore();
  const { colors } = useTheme();
  const days = lastDays(7);
  const vals = days.map((d) => profile.xpByDay[d] ?? 0);
  const max = Math.max(50, ...vals);
  const total = profile.counters.sessions;
  const stat = (label: string, v: string | number) => (
    <Card style={{ flex: 1, padding: space.md, alignItems: 'center' }}><AppText v="title">{v}</AppText><AppText v="caption" color={colors.muted}>{label}</AppText></Card>
  );
  const played = CATEGORIES.filter((c) => profile.categoryStats[c.id]?.total);
  return (
    <Screen>
      <AppText v="title" accessibilityRole="header">Progress</AppText>
      <Row style={{ alignItems: 'stretch' }}>{stat('Total XP', profile.xp)}{stat('Level', levelForXp(profile.xp))}{stat('Sessions', total)}</Row>
      <Row style={{ alignItems: 'stretch' }}>{stat('Current streak', profile.streak.current)}{stat('Best streak', profile.streak.best)}</Row>

      <Card>
        <AppText v="heading">XP this week</AppText>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 130, gap: space.sm, marginTop: space.md }} accessibilityLabel={`XP per day this week: ${vals.join(', ')}`}>
          {days.map((d, i) => (
            <View key={d} style={{ flex: 1, alignItems: 'center', gap: 4 }}>
              <AppText v="caption" color={colors.muted}>{vals[i] || ''}</AppText>
              <View style={{ width: '100%', height: Math.max(4, (vals[i] / max) * 80), borderRadius: 8, backgroundColor: d === todayISO() ? colors.primary : colors.surface2, borderWidth: d === todayISO() ? 0 : 1, borderColor: colors.border }} />
              <AppText v="caption" color={colors.muted}>{shortDay(d)}</AppText>
            </View>
          ))}
        </View>
      </Card>

      <Card>
        <AppText v="heading">By category</AppText>
        {played.length === 0 ? <Empty icon="analytics-outline" title="No data yet" body="Play a session to see how you do in each area." /> : (
          <View style={{ gap: space.md, marginTop: space.md }}>
            {played.map((c) => { const s = profile.categoryStats[c.id]; const a = s.correct / s.total; return (
              <View key={c.id} style={{ gap: 4 }}>
                <Row style={{ justifyContent: 'space-between' }}><AppText v="label">{c.title}</AppText><AppText v="caption" color={colors.muted}>{Math.round(a * 100)}% · {s.played} sessions</AppText></Row>
                <ProgressBar value={a} color={c.color} />
              </View>); })}
          </View>)}
      </Card>

      <Card>
        <AppText v="heading">History</AppText>
        {profile.history.length === 0 ? <Empty icon="time-outline" title="No history yet" body="Your latest sessions will appear here." /> : (
          <View style={{ gap: space.md, marginTop: space.md }}>
            {profile.history.slice(0, 15).map((h, i) => (
              <Row key={i} style={{ justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}><AppText v="label">{catById(h.category)?.title ?? (h.category === 'daily' ? 'Daily Challenge' : 'Mixed Workout')}</AppText><AppText v="caption" color={colors.muted}>{h.date} · {h.mode}</AppText></View>
                <AppText v="caption" color={colors.muted}>{h.correct}/{h.total}</AppText>
                <AppText v="label" color={colors.accent}>+{h.xp}</AppText>
              </Row>))}
          </View>)}
      </Card>
    </Screen>
  );
}
