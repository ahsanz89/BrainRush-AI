import React, { useEffect } from 'react';
import { BackHandler, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppText, Button, Card, IconBadge, Ring, Row, Screen } from '../ui';
import { useStore } from '../state/store';
import { useTheme } from '../theme/ThemeProvider';
import { ACHIEVEMENTS } from '../engine/profile';
import { levelForXp } from '../engine/progress';
import { catById } from '../data/categories';
import { recommendCategory } from '../lib/recommend';
import { Item } from '../engine/types';
import { space } from '../theme/tokens';

const title = (it: Item) => (it.kind === 'choice' ? (it.display ? `${it.prompt} ${it.display}` : it.prompt) : it.kind === 'memory' ? 'Remember the sequence' : 'Find the odd symbol');
const summary = (pct: number) => pct >= 90 ? 'Outstanding! Your focus was razor sharp.' : pct >= 70 ? 'Great work. You are building real momentum.' : pct >= 40 ? 'Good effort. Practice makes these feel easier.' : 'Every round trains your brain. Try Practice mode for step-by-step explanations.';

export default function Results() {
  const router = useRouter();
  const { colors } = useTheme();
  const { last, profile } = useStore();
  useEffect(() => { const s = BackHandler.addEventListener('hardwareBackPress', () => { router.replace('/(tabs)'); return true; }); return () => s.remove(); }, [router]);
  if (!last) return <Screen><AppText v="title">No results</AppText><Button label="Home" onPress={() => router.replace('/(tabs)')} /></Screen>;
  const r = last.result;
  const correct = last.review.filter((x) => x.correct).length, total = last.review.length;
  const pct = Math.round((correct / total) * 100);
  const mins = Math.floor(last.durationMs / 60000), secs = Math.round((last.durationMs % 60000) / 1000);
  const byCat: Record<string, { c: number; t: number }> = {};
  last.review.forEach((x) => { const k = x.item.category; byCat[k] = byCat[k] ?? { c: 0, t: 0 }; byCat[k].t++; if (x.correct) byCat[k].c++; });
  const weak = Object.entries(byCat).filter(([, v]) => v.c / v.t < 0.6).map(([k]) => catById(k)?.title).filter(Boolean);
  const nextCat = catById(recommendCategory(profile, new Date().getDate()))!;
  const again = () => router.replace({ pathname: '/play', params: { category: last.category, mode: last.mode === 'daily' ? 'practice' : last.mode } });
  return (
    <Screen>
      <View style={{ alignItems: 'center', gap: space.md }}>
        <Ring value={pct / 100} size={150} stroke={14} color={pct >= 70 ? colors.accent : colors.primary}>
          <AppText v="display">{pct}%</AppText><AppText v="caption" color={colors.muted}>score</AppText>
        </Ring>
        <AppText v="title" style={{ textAlign: 'center' }} accessibilityRole="header">{summary(pct)}</AppText>
      </View>
      <Row style={{ alignItems: 'stretch' }}>
        {[['Correct', correct, 'checkmark-circle', colors.accent], ['Missed', total - correct, 'close-circle', colors.danger], ['Time', `${mins}:${String(secs).padStart(2, '0')}`, 'time', colors.primary]].map(([l, v, i, c]: any) => (
          <Card key={l} style={{ flex: 1, alignItems: 'center', padding: space.md }}><Ionicons name={i} size={22} color={c} /><AppText v="title">{v}</AppText><AppText v="caption" color={colors.muted}>{l}</AppText></Card>))}
      </Row>
      <Card tint={colors.primary + '22'}>
        <Row style={{ justifyContent: 'space-between' }}>
          <View><AppText v="caption" color={colors.muted}>XP earned</AppText><AppText v="title" color={colors.accent}>+{r?.xpGained ?? 0}</AppText></View>
          <View style={{ alignItems: 'flex-end' }}><AppText v="caption" color={colors.muted}>Level</AppText><AppText v="title">{levelForXp(profile.xp)}</AppText></View>
        </Row>
        {r?.flagged ? <AppText v="caption" color={colors.warn}>This round was too fast to count for XP.</AppText> : null}
        {last.hintsUsed > 0 ? <AppText v="caption" color={colors.muted}>{last.hintsUsed} hint{last.hintsUsed > 1 ? 's' : ''} used, so a little XP was traded for help.</AppText> : null}
        {r?.leveledUp ? <AppText v="label" color={colors.accent}>Level up! 🎉</AppText> : null}
      </Card>
      {r?.newAchievements?.length ? (
        <Card><View style={{ gap: space.sm }}><AppText v="heading">New achievement{r.newAchievements.length > 1 ? 's' : ''}</AppText>
          {r.newAchievements.map((id: string) => { const a = ACHIEVEMENTS.find((x) => x.id === id)!; return <Row key={id}><IconBadge name={a.icon as any} color={colors.warn} size={40} /><View style={{ flex: 1 }}><AppText v="label">{a.title}</AppText><AppText v="caption" color={colors.muted}>{a.description}</AppText></View></Row>; })}
        </View></Card>) : null}
      {weak.length > 0 && <Card><View style={{ gap: 6 }}><AppText v="heading">Areas to work on</AppText><AppText color={colors.muted}>{weak.join(', ')}. Try Practice mode: it takes a little longer and explains every answer.</AppText></View></Card>}
      <View style={{ gap: space.sm }}>
        <AppText v="heading">Review</AppText>
        {last.review.map((x, i) => (
          <Card key={i} style={{ padding: space.md }}>
            <Row style={{ alignItems: 'flex-start' }}>
              <Ionicons name={x.correct ? 'checkmark-circle' : 'close-circle'} size={22} color={x.correct ? colors.accent : colors.danger} />
              <View style={{ flex: 1, gap: 4 }}>
                <AppText v="label">{title(x.item)}</AppText>
                {x.item.kind === 'choice' && <AppText v="caption" color={colors.muted}>{x.correct ? `Your answer: ${x.answered}` : `You chose: ${x.answered}. Correct: ${x.item.options[x.item.answerIndex]}`}</AppText>}
                <AppText v="caption" color={colors.muted}>{x.item.explanation}</AppText>
              </View>
            </Row>
          </Card>))}
      </View>
      <Button label="Play again" icon="refresh" onPress={again} />
      <Button label={`Next: ${nextCat.title}`} icon="arrow-forward" variant="secondary" onPress={() => router.replace({ pathname: '/play', params: { category: nextCat.id, mode: 'quick' } })} />
      <Button label="Back to home" variant="ghost" onPress={() => router.replace('/(tabs)')} />
    </Screen>
  );
}
