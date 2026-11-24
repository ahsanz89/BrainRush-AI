import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText, Button, Card, Chip, IconBadge, ProgressBar, Row, Screen, Segmented } from '../ui';
import { useStore } from '../state/store';
import { useTheme } from '../theme/ThemeProvider';
import { CATEGORIES } from '../data/categories';
import { scheduleDailyReminder } from '../lib/notify';
import { space, radius } from '../theme/tokens';

export default function Onboarding() {
  const { colors } = useTheme();
  const router = useRouter();
  const { update } = useStore();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [goal, setGoal] = useState(2);
  const [remind, setRemind] = useState(false);
  const [note, setNote] = useState('');

  const finish = async () => {
    let enabled = false;
    if (remind) { enabled = await scheduleDailyReminder(19, 0).catch(() => false); if (!enabled) setNote('Notifications are off in system settings, so no reminder was set.'); }
    update((p) => ({ ...p, name: name.trim(), interests, difficulty, dailyGoal: goal, onboarded: true, reminders: { enabled, hour: 19, minute: 0 } }));
    router.replace('/(tabs)');
  };
  const toggle = (id: string) => setInterests((x) => (x.includes(id) ? x.filter((i) => i !== id) : [...x, id]));

  return (
    <Screen>
      <ProgressBar value={(step + 1) / 4} />
      {step === 0 && (
        <View style={{ gap: space.xl, paddingTop: space.xl }}>
          <IconBadge name="flash" color={colors.primary} size={72} />
          <AppText v="display" accessibilityRole="header">Train your brain.{'\n'}Challenge yourself.{'\n'}Grow every day.</AppText>
          <AppText color={colors.muted}>Short daily workouts with puzzles, memory games and quizzes. Free, works offline, no account needed.</AppText>
          <Card><View style={{ gap: space.md }}>
            {([['timer-outline', 'Five minutes a day', 'Quick sessions that fit your routine.'], ['trending-up', 'Adapts to you', 'Difficulty rises as you improve.'], ['shield-checkmark-outline', 'Private by design', 'Your data stays on your phone.']] as const).map(([i, t, b]) => (
              <Row key={t}><IconBadge name={i} color={colors.accent} size={40} /><View style={{ flex: 1 }}><AppText v="label">{t}</AppText><AppText v="caption" color={colors.muted}>{b}</AppText></View></Row>
            ))}
          </View></Card>
        </View>
      )}
      {step === 1 && (
        <View style={{ gap: space.lg }}>
          <AppText v="title" accessibilityRole="header">What should we call you?</AppText>
          <TextInput value={name} onChangeText={setName} placeholder="Nickname (optional)" placeholderTextColor={colors.muted} maxLength={24} accessibilityLabel="Nickname"
            style={{ minHeight: 52, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, color: colors.text, paddingHorizontal: space.lg, fontSize: 16 }} />
          <AppText v="title">Pick your interests</AppText>
          <AppText color={colors.muted}>We will suggest these first. You can still play everything.</AppText>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.sm }}>
            {CATEGORIES.map((c) => <Chip key={c.id} label={c.title} icon={c.icon} selected={interests.includes(c.id)} onPress={() => toggle(c.id)} />)}
          </View>
        </View>
      )}
      {step === 2 && (
        <View style={{ gap: space.lg }}>
          <AppText v="title" accessibilityRole="header">Set your pace</AppText>
          <AppText v="label">Difficulty</AppText>
          <Segmented options={[{ label: 'Easy', value: 'easy' }, { label: 'Medium', value: 'medium' }, { label: 'Hard', value: 'hard' }]} value={difficulty} onChange={setDifficulty} />
          <AppText v="label">Daily goal: sessions per day</AppText>
          <Segmented options={[1, 2, 3, 4].map((n) => ({ label: String(n), value: n }))} value={goal} onChange={setGoal} />
          <AppText v="caption" color={colors.muted}>Each session takes about two minutes. You can change both later.</AppText>
        </View>
      )}
      {step === 3 && (
        <View style={{ gap: space.lg }}>
          <AppText v="title" accessibilityRole="header">Stay on track</AppText>
          <Card><Row>
            <IconBadge name="notifications-outline" color={colors.primary} />
            <View style={{ flex: 1 }}><AppText v="label">Daily reminder at 7 pm</AppText><AppText v="caption" color={colors.muted}>Created on your device. You can change the time later.</AppText></View>
          </Row>
            <View style={{ height: space.md }} />
            <Segmented options={[{ label: 'Remind me', value: true }, { label: 'No thanks', value: false }]} value={remind} onChange={setRemind} />
          </Card>
          <Card><View style={{ gap: 6 }}>
            <AppText v="heading">Your privacy</AppText>
            <AppText color={colors.muted}>BrainRush AI keeps your progress on this device only. We collect nothing and show no ads in this version.</AppText>
            <AppText v="caption" color={colors.muted}>By continuing you agree to the Terms of Use and Privacy Policy.</AppText>
            <Row>
              <Button label="Privacy Policy" icon="shield-checkmark-outline" variant="ghost" onPress={() => router.push('/legal/privacy')} style={{ flex: 1 }} />
              <Button label="Terms" icon="document-text-outline" variant="ghost" onPress={() => router.push('/legal/terms')} style={{ flex: 1 }} />
            </Row>
          </View></Card>
          {note ? <AppText color={colors.warn}>{note}</AppText> : null}
        </View>
      )}
      <View style={{ flexDirection: 'row', gap: space.md, marginTop: space.lg }}>
        {step > 0 && <Button label="Back" variant="ghost" onPress={() => setStep(step - 1)} style={{ flex: 1 }} />}
        <Button label={step === 3 ? "Let's go" : step === 0 ? 'Get started' : 'Next'} onPress={() => (step === 3 ? finish() : setStep(step + 1))} style={{ flex: 2 }} />
      </View>
    </Screen>
  );
}
