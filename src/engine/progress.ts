/** Deterministic progression rules. Server mirrors these; client never trusted. */
export const DAILY_XP_CAP = 500;

export const xpForLevel = (level: number): number =>
  level <= 1 ? 0 : Math.round(100 * Math.pow(level - 1, 1.5));

export function levelForXp(xp: number): number {
  let l = 1;
  while (xpForLevel(l + 1) <= xp) l++;
  return l;
}

export type Mode = 'daily' | 'quick' | 'timed' | 'practice' | 'mixed';

export interface SessionInput {
  total: number;
  correct: number;
  hintsUsed: number;
  durationMs: number;
  minPlausibleMsPerItem: number;
  difficulty: number; // 1..5
  mode: Mode;
}

export function scoreSession(s: SessionInput) {
  if (!Number.isInteger(s.total) || s.total < 1 || s.correct < 0 || s.correct > s.total || s.hintsUsed < 0) {
    throw new Error('invalid session');
  }
  return { percent: Math.round((s.correct / s.total) * 100), incorrect: s.total - s.correct };
}

const MODE_MULT: Record<Mode, number> = { daily: 1.5, quick: 1, timed: 1.2, practice: 0.5, mixed: 1.25 };

export function computeXp(s: SessionInput, xpEarnedToday: number) {
  scoreSession(s);
  if (s.durationMs < s.total * s.minPlausibleMsPerItem) return { xp: 0, flagged: true };
  let raw = s.correct * 10 * (1 + 0.25 * (Math.min(5, Math.max(1, s.difficulty)) - 1));
  if (s.correct === s.total) raw *= 1.2;
  raw = raw * MODE_MULT[s.mode] - s.hintsUsed * 3;
  const remaining = Math.max(0, DAILY_XP_CAP - xpEarnedToday);
  return { xp: Math.min(Math.max(0, Math.round(raw)), remaining), flagged: false };
}

export interface Streak { current: number; best: number; lastDay: string | null }

const dayNum = (d: string) => Math.floor(Date.UTC(+d.slice(0, 4), +d.slice(5, 7) - 1, +d.slice(8, 10)) / 86400000);

/** `today` is a YYYY-MM-DD in the user's local timezone. */
export function updateStreak(s: Streak, today: string): Streak {
  if (s.lastDay === today) return s;
  const consecutive = s.lastDay !== null && dayNum(today) - dayNum(s.lastDay) === 1;
  const current = consecutive ? s.current + 1 : 1;
  return { current, best: Math.max(s.best, current), lastDay: today };
}
