import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, BackHandler, Pressable, View, useWindowDimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { AppText, Button, Card, ProgressBar, Row, Screen } from '../ui';
import { useStore, ReviewEntry } from '../state/store';
import { useTheme } from '../theme/ThemeProvider';
import { buildSession } from '../engine/session';
import { ChoiceItem, Item, MemoryItem, OddItem, SessionCategory } from '../engine/types';
import { applySession } from '../engine/profile';
import { Mode } from '../engine/progress';
import { bundledContent } from '../content';
import { dailySeed, todayISO } from '../lib/date';
import { difficultyFor } from '../lib/recommend';
import { catById } from '../data/categories';
import { radius, space } from '../theme/tokens';

const PRAISE = ['Nice one!', 'Correct!', 'Sharp thinking!', 'Well done!'];
const ENCOURAGE = ['Not quite, but now you know.', 'Close. Check the explanation.', 'Good try. Every miss teaches something.'];
const pick = (a: string[], i: number) => a[i % a.length];

interface Answered { correct: boolean; label: string; selected?: number }

export default function Play() {
  const { category = 'mixed', mode = 'quick' } = useLocalSearchParams<{ category: string; mode: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { profile, update, setLast } = useStore();
  const items = useMemo<Item[]>(() => buildSession({ category: category as SessionCategory, mode: mode as Mode, difficulty: difficultyFor(profile.difficulty),
    seed: mode === 'daily' ? dailySeed() : Math.floor(Math.random() * 2147483647), content: bundledContent }), [category, mode]); // eslint-disable-line react-hooks/exhaustive-deps

  const [idx, setIdx] = useState(0);
  const [answered, setAnswered] = useState<Answered | null>(null);
  const [eliminated, setEliminated] = useState<number[]>([]);
  const [replayKey, setReplayKey] = useState(0);
  const [hintText, setHintText] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const hints = useRef(0);
  const review = useRef<ReviewEntry[]>([]);
  const start = useRef(Date.now());
  const item = items[idx];
  const limit = mode === 'timed' && item.kind !== 'memory' ? (item.kind === 'odd' ? 20 : 15) : 0;

  const haptic = useCallback((ok: boolean) => { if (profile.haptics) Haptics.notificationAsync(ok ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error).catch(() => {}); }, [profile.haptics]);

  const resolve = useCallback((correct: boolean, label: string, selected?: number) => {
    if (answered) return;
    review.current.push({ item, correct, answered: label });
    setAnswered({ correct, label, selected });
    haptic(correct);
  }, [answered, item, haptic]);

  // per-item timer
  useEffect(() => {
    setEliminated([]); setHintText(''); setAnswered(null);
    if (!limit) return;
    setTimeLeft(limit);
    const end = Date.now() + limit * 1000;
    const t = setInterval(() => { const left = Math.max(0, Math.ceil((end - Date.now()) / 1000)); setTimeLeft(left); }, 250);
    return () => clearInterval(t);
  }, [idx, limit]);
  useEffect(() => { if (limit && timeLeft === 0 && !answered) resolve(false, "Time's up"); }, [timeLeft]); // eslint-disable-line react-hooks/exhaustive-deps

  const quit = useCallback(() => {
    Alert.alert('Leave this session?', 'Your progress in this round will be lost.', [{ text: 'Keep playing', style: 'cancel' }, { text: 'Leave', style: 'destructive', onPress: () => router.back() }]);
    return true;
  }, [router]);
  useEffect(() => { const s = BackHandler.addEventListener('hardwareBackPress', quit); return () => s.remove(); }, [quit]);

  const next = () => {
    if (idx + 1 < items.length) { setIdx(idx + 1); return; }
    const correct = review.current.filter((r) => r.correct).length;
    let out: any;
    update((p) => { out = applySession(p, { category: category as SessionCategory, mode: mode as Mode, total: items.length, correct, hintsUsed: hints.current, durationMs: Date.now() - start.current, difficulty: difficultyFor(profile.difficulty) }, todayISO()); return out.profile; });
    setLast({ review: review.current, durationMs: Date.now() - start.current, hintsUsed: hints.current, category, mode, result: out });
    router.replace('/results');
  };

  const useHint = () => {
    if (answered) return;
    hints.current += 1;
    if (item.kind === 'choice') {
      const wrong = item.options.map((_, i) => i).filter((i) => i !== item.answerIndex && !eliminated.includes(i));
      setEliminated((e) => [...e, ...wrong.slice(0, Math.max(0, Math.min(2, wrong.length - 1)))]);
      setHintText(item.hint);
    } else if (item.kind === 'memory') { setReplayKey((k) => k + 1); setHintText('Watch the sequence again.'); }
    else setHintText('Look for the one symbol that is shaped differently.');
  };

  const meta = catById(item.category);
  const correctCount = review.current.filter((r) => r.correct).length;
  return (
    <Screen>
      <Row>
        <Pressable accessibilityRole="button" accessibilityLabel="Close session" onPress={quit} style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="close" size={26} color={colors.text} />
        </Pressable>
        <View style={{ flex: 1 }}><ProgressBar value={(idx + (answered ? 1 : 0)) / items.length} /></View>
        <AppText v="label" color={colors.muted}>{idx + 1}/{items.length}</AppText>
      </Row>
      <Row style={{ justifyContent: 'space-between' }}>
        <AppText v="label" color={meta?.color ?? colors.primary}>{meta?.title}</AppText>
        {limit ? <Row><Ionicons name="timer-outline" size={18} color={timeLeft <= 5 ? colors.danger : colors.muted} /><AppText v="label" color={timeLeft <= 5 ? colors.danger : colors.muted}>{timeLeft}s</AppText></Row> : <AppText v="caption" color={colors.muted}>{correctCount} correct</AppText>}
      </Row>

      {item.kind === 'choice' && <ChoiceView item={item} answered={answered} eliminated={eliminated} onPick={(i) => resolve(i === item.answerIndex, item.options[i], i)} />}
      {item.kind === 'memory' && <MemoryView key={item.id} item={item} answered={answered} replayKey={replayKey} onResolve={resolve} />}
      {item.kind === 'odd' && <OddView item={item} answered={answered} onResolve={resolve} />}

      {!answered && (
        <Button label={hintText ? 'Hint used (costs XP)' : item.kind === 'memory' ? 'Replay sequence (costs XP)' : 'Use a hint (costs XP)'} icon="bulb-outline" variant="ghost" onPress={useHint} />
      )}
      {!answered && hintText ? <AppText color={colors.muted} style={{ textAlign: 'center' }}>{hintText}</AppText> : null}

      {answered && (
        <Card tint={answered.correct ? colors.accent + '26' : colors.danger + '22'} style={{ borderColor: answered.correct ? colors.accent : colors.danger }}>
          <View style={{ gap: space.sm }} accessibilityLiveRegion="polite">
            <Row><Ionicons name={answered.correct ? 'checkmark-circle' : 'close-circle'} size={26} color={answered.correct ? colors.accent : colors.danger} />
              <AppText v="heading">{answered.correct ? pick(PRAISE, idx) : pick(ENCOURAGE, idx)}</AppText></Row>
            <AppText color={colors.muted}>{item.explanation}</AppText>
            <Button label={idx + 1 < items.length ? 'Next' : 'See results'} onPress={next} />
          </View>
        </Card>
      )}
    </Screen>
  );
}

function ChoiceView({ item, answered, eliminated, onPick }: { item: ChoiceItem; answered: Answered | null; eliminated: number[]; onPick: (i: number) => void }) {
  const { colors } = useTheme();
  return (
    <View style={{ gap: space.md }}>
      <Card><View style={{ gap: space.sm, alignItems: item.display ? 'center' : 'flex-start' }}>
        <AppText v={item.display ? 'label' : 'title'} color={item.display ? colors.muted : colors.text} accessibilityRole="header">{item.prompt}</AppText>
        {item.display ? <AppText accessibilityLabel={item.display} style={{ fontSize: item.display.length > 14 ? 28 : 40, lineHeight: 48, fontWeight: '800', textAlign: 'center', letterSpacing: 1 }}>{item.display}</AppText> : null}
      </View></Card>
      {item.options.map((o, i) => {
        const gone = eliminated.includes(i) && !answered;
        const isAns = !!answered && i === item.answerIndex;
        const isWrongPick = !!answered && !answered.correct && answered.selected === i;
        const bd = isAns ? colors.accent : isWrongPick ? colors.danger : colors.border;
        return (
          <Pressable key={i} disabled={!!answered || gone} accessibilityRole="button" accessibilityLabel={`Option ${String.fromCharCode(65 + i)}: ${o}`} accessibilityState={{ disabled: gone }}
            onPress={() => onPick(i)} style={{ minHeight: 56, borderRadius: radius.md, borderWidth: 2, borderColor: bd, backgroundColor: isAns ? colors.accent + '26' : isWrongPick ? colors.danger + '22' : colors.surface, opacity: gone ? 0.3 : 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: space.lg, gap: space.md }}>
            <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' }}><AppText v="label">{String.fromCharCode(65 + i)}</AppText></View>
            <AppText style={{ flex: 1, fontSize: 17 }}>{o}</AppText>
            {isAns ? <Ionicons name="checkmark-circle" size={24} color={colors.accent} /> : isWrongPick ? <Ionicons name="close-circle" size={24} color={colors.danger} /> : null}
          </Pressable>
        );
      })}
    </View>
  );
}

function MemoryView({ item, answered, replayKey, onResolve }: { item: MemoryItem; answered: Answered | null; replayKey: number; onResolve: (c: boolean, l: string) => void }) {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const [lit, setLit] = useState<number | null>(null);
  const [phase, setPhase] = useState<'show' | 'input'>('show');
  const [taps, setTaps] = useState<number[]>([]);
  const size = Math.min(width - 2 * space.lg, 360), tile = (size - space.sm * (item.grid - 1)) / item.grid;
  useEffect(() => {
    setPhase('show'); setTaps([]); setLit(null);
    let live = true; const ts: ReturnType<typeof setTimeout>[] = [];
    item.sequence.forEach((t, i) => { ts.push(setTimeout(() => live && setLit(t), 700 + i * 800)); ts.push(setTimeout(() => live && setLit(null), 700 + i * 800 + 550)); });
    ts.push(setTimeout(() => live && setPhase('input'), 700 + item.sequence.length * 800));
    return () => { live = false; ts.forEach(clearTimeout); };
  }, [item.id, replayKey]);
  const press = (t: number) => {
    if (phase !== 'input' || answered) return;
    const next = [...taps, t]; setTaps(next);
    if (t !== item.sequence[taps.length]) onResolve(false, 'Wrong tile');
    else if (next.length === item.sequence.length) onResolve(true, 'Correct order');
  };
  return (
    <View style={{ alignItems: 'center', gap: space.lg }}>
      <AppText v="title" accessibilityLiveRegion="polite">{answered ? (answered.correct ? 'You remembered it!' : 'Not this time') : phase === 'show' ? 'Watch carefully…' : `Your turn: ${taps.length}/${item.sequence.length}`}</AppText>
      <View style={{ width: size, flexDirection: 'row', flexWrap: 'wrap', gap: space.sm }}>
        {Array.from({ length: item.grid * item.grid }, (_, t) => {
          const on = lit === t || taps[taps.length - 1] === t && !answered;
          return <Pressable key={t} accessibilityRole="button" accessibilityLabel={`Tile ${t + 1}`} onPress={() => press(t)}
            style={{ width: tile, height: tile, borderRadius: radius.md, backgroundColor: on ? colors.primary : colors.surface2, borderWidth: 2, borderColor: on ? colors.primary : colors.border }} />;
        })}
      </View>
    </View>
  );
}

function OddView({ item, answered, onResolve }: { item: OddItem; answered: Answered | null; onResolve: (c: boolean, l: string, sel?: number) => void }) {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const size = Math.min(width - 2 * space.lg, 360), cell = (size - space.xs * (item.grid - 1)) / item.grid;
  return (
    <View style={{ alignItems: 'center', gap: space.lg }}>
      <AppText v="title" accessibilityRole="header">Tap the odd one out</AppText>
      <View style={{ width: size, flexDirection: 'row', flexWrap: 'wrap', gap: space.xs }}>
        {item.cells.map((g, i) => {
          const isOdd = i === item.oddIndex;
          const wrongPick = !!answered && !answered.correct && answered.selected === i;
          return (
            <Pressable key={i} disabled={!!answered} accessibilityRole="button" accessibilityLabel={`Cell ${i + 1}: ${g}`} onPress={() => onResolve(isOdd, isOdd ? 'Found it' : 'Wrong cell', i)}
              style={{ width: cell, height: cell, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center', backgroundColor: answered && isOdd ? colors.accent + '40' : wrongPick ? colors.danger + '40' : colors.surface, borderWidth: 1, borderColor: answered && isOdd ? colors.accent : colors.border }}>
              <AppText style={{ fontSize: cell * 0.5, fontWeight: '700' }}>{g}</AppText>
            </Pressable>);
        })}
      </View>
    </View>
  );
}
