import { computeXp, levelForXp, Mode, updateStreak, Streak } from './progress';
import { CATEGORY_IDS, SessionCategory } from './types';

export interface HistoryEntry { date: string; category: SessionCategory; mode: Mode; total: number; correct: number; xp: number; percent: number }
export interface Profile {
  version: 1; name: string; onboarded: boolean; interests: string[]; dailyGoal: number;
  difficulty: 'easy' | 'medium' | 'hard'; theme: 'system' | 'light' | 'dark'; haptics: boolean;
  reminders: { enabled: boolean; hour: number; minute: number };
  xp: number; streak: Streak; xpByDay: Record<string, number>; sessionsByDay: Record<string, number>; dailyDone: Record<string, boolean>;
  categoryStats: Record<string, { played: number; correct: number; total: number }>;
  history: HistoryEntry[]; achievements: string[];
  counters: { sessions: number; perfect: number; noHint: number; dailies: number; timedGood: number };
}

export const newProfile = (): Profile => ({
  version: 1, name: '', onboarded: false, interests: [], dailyGoal: 2, difficulty: 'medium', theme: 'system', haptics: true,
  reminders: { enabled: false, hour: 19, minute: 0 }, xp: 0, streak: { current: 0, best: 0, lastDay: null },
  xpByDay: {}, sessionsByDay: {}, dailyDone: {}, categoryStats: {}, history: [], achievements: [],
  counters: { sessions: 0, perfect: 0, noHint: 0, dailies: 0, timedGood: 0 },
});

export interface Achievement { id: string; title: string; description: string; icon: string; test: (p: Profile) => boolean }
export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_session', title: 'First Spark', description: 'Finish your first session.', icon: 'flash', test: (p) => p.counters.sessions >= 1 },
  { id: 'streak_3', title: 'On a Roll', description: 'Reach a 3-day streak.', icon: 'flame', test: (p) => p.streak.best >= 3 },
  { id: 'streak_7', title: 'Week Warrior', description: 'Reach a 7-day streak.', icon: 'calendar', test: (p) => p.streak.best >= 7 },
  { id: 'streak_30', title: 'Habit Builder', description: 'Reach a 30-day streak.', icon: 'ribbon', test: (p) => p.streak.best >= 30 },
  { id: 'perfect', title: 'Flawless', description: 'Score 100% in a session.', icon: 'checkmark-done', test: (p) => p.counters.perfect >= 1 },
  { id: 'perfect_5', title: 'Sharp Mind', description: 'Score 100% five times.', icon: 'diamond', test: (p) => p.counters.perfect >= 5 },
  { id: 'xp_500', title: 'Rising Star', description: 'Earn 500 XP.', icon: 'star', test: (p) => p.xp >= 500 },
  { id: 'xp_2000', title: 'Brainiac', description: 'Earn 2,000 XP.', icon: 'rocket', test: (p) => p.xp >= 2000 },
  { id: 'level_5', title: 'Level 5', description: 'Reach level 5.', icon: 'trending-up', test: (p) => levelForXp(p.xp) >= 5 },
  { id: 'level_10', title: 'Level 10', description: 'Reach level 10.', icon: 'trophy', test: (p) => levelForXp(p.xp) >= 10 },
  { id: 'explorer', title: 'Explorer', description: 'Try all ten categories.', icon: 'compass', test: (p) => CATEGORY_IDS.every((c) => (p.categoryStats[c]?.played ?? 0) > 0) },
  { id: 'speedster', title: 'Speedster', description: 'Score 80%+ in three timed sessions.', icon: 'timer', test: (p) => p.counters.timedGood >= 3 },
  { id: 'purist', title: 'No Peeking', description: 'Finish 10 sessions without hints.', icon: 'eye-off', test: (p) => p.counters.noHint >= 10 },
  { id: 'daily_5', title: 'Daily Devotee', description: 'Complete 5 daily challenges.', icon: 'sunny', test: (p) => p.counters.dailies >= 5 },
  { id: 'veteran', title: 'Veteran', description: 'Finish 50 sessions.', icon: 'medal', test: (p) => p.counters.sessions >= 50 },
];

export interface SessionResult { category: SessionCategory; mode: Mode; total: number; correct: number; hintsUsed: number; durationMs: number; difficulty: number }

export function applySession(prev: Profile, r: SessionResult, today: string) {
  const alreadyDaily = r.mode === 'daily' && prev.dailyDone[today];
  const xpMode: Mode = alreadyDaily ? 'practice' : r.mode;
  const { xp, flagged } = computeXp({ ...r, mode: xpMode, minPlausibleMsPerItem: 700 }, prev.xpByDay[today] ?? 0);
  const percent = Math.round((r.correct / r.total) * 100);
  if (flagged) return { profile: prev, xpGained: 0, newAchievements: [] as string[], leveledUp: false, flagged, percent };
  const p: Profile = JSON.parse(JSON.stringify(prev));
  p.xp += xp;
  p.xpByDay[today] = (p.xpByDay[today] ?? 0) + xp;
  p.sessionsByDay[today] = (p.sessionsByDay[today] ?? 0) + 1;
  if (r.correct > 0) p.streak = updateStreak(p.streak, today);
  const cs = p.categoryStats[r.category] ?? { played: 0, correct: 0, total: 0 };
  p.categoryStats[r.category] = { played: cs.played + 1, correct: cs.correct + r.correct, total: cs.total + r.total };
  p.counters.sessions++;
  if (r.correct === r.total) p.counters.perfect++;
  if (r.hintsUsed === 0) p.counters.noHint++;
  if (r.mode === 'daily' && !alreadyDaily) { p.counters.dailies++; p.dailyDone[today] = true; }
  if (r.mode === 'timed' && percent >= 80) p.counters.timedGood++;
  p.history = [{ date: today, category: r.category, mode: r.mode, total: r.total, correct: r.correct, xp, percent }, ...p.history].slice(0, 100);
  const newAchievements = ACHIEVEMENTS.filter((a) => !p.achievements.includes(a.id) && a.test(p)).map((a) => a.id);
  p.achievements = [...p.achievements, ...newAchievements];
  return { profile: p, xpGained: xp, newAchievements, leveledUp: levelForXp(p.xp) > levelForXp(prev.xp), flagged, percent };
}
