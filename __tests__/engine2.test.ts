import { createRng } from '../src/engine/rng';
import { generateVisual } from '../src/engine/visual';
import { generateMemory, checkMemory } from '../src/engine/memory';
import { generateOdd } from '../src/engine/attention';
import { buildSession } from '../src/engine/session';
import { applySession, newProfile, ACHIEVEMENTS } from '../src/engine/profile';
import { Question } from '../src/engine/validate';
import { CATEGORY_IDS } from '../src/engine/types';

const pool: Question[] = Array.from({ length: 30 }, (_, i) => ({
  id: 'k' + i, category: 'knowledge', prompt: `Sample question number ${i} about topic ${i * 7}?`,
  options: ['A' + i, 'B' + i, 'C' + i, 'D' + i], answerIndex: i % 4, explanation: 'because', difficulty: 1 + (i % 3), source: 'original',
}));
const mk = (c: string) => pool.map((q) => ({ ...q, id: c + q.id, category: c, prompt: c + ' ' + q.prompt }));
const content = { knowledge: pool, word: mk('word'), critical: mk('critical'), problem: mk('problem'), logic: mk('logic') } as any;

describe('visual', () => {
  it('answer follows repeating unit; options unique incl. answer', () => {
    for (let d = 1; d <= 5; d++) for (let s = 0; s < 100; s++) {
      const v = generateVisual(createRng(s), d);
      expect(v.options.filter((o) => o === v.options[v.answerIndex]).length).toBe(1);
      expect(new Set(v.options).size).toBe(v.options.length);
      expect(v.options[v.answerIndex]).toBe(v.next);
    }
  });
});
describe('memory', () => {
  it('sequence valid, no immediate repeats, check works', () => {
    for (let d = 1; d <= 5; d++) { const m = generateMemory(createRng(d), d);
      expect(m.sequence.every((t) => t >= 0 && t < m.grid * m.grid)).toBe(true);
      expect(m.sequence.some((t, i) => i > 0 && t === m.sequence[i - 1])).toBe(false);
      expect(checkMemory(m, m.sequence)).toBe(true);
      expect(checkMemory(m, [...m.sequence].reverse().concat([0]))).toBe(false); }
  });
});
describe('odd one out', () => {
  it('exactly one differing cell', () => {
    for (let s = 0; s < 100; s++) { const o = generateOdd(createRng(s), 1 + (s % 5));
      expect(o.cells.length).toBe(o.grid * o.grid);
      expect(o.cells.filter((c) => c !== o.base).length).toBe(1);
      expect(o.cells[o.oddIndex]).not.toBe(o.base); }
  });
});
describe('session builder', () => {
  it('deterministic by seed; counts by mode; every choice item valid', () => {
    for (const cat of [...CATEGORY_IDS, 'mixed'] as const) {
      const a = buildSession({ category: cat, mode: 'quick', difficulty: 3, seed: 5, content });
      const b = buildSession({ category: cat, mode: 'quick', difficulty: 3, seed: 5, content });
      expect(a).toEqual(b);
      expect(a.length).toBeGreaterThan(0);
      for (const it of a) if (it.kind === 'choice') { expect(it.answerIndex).toBeGreaterThanOrEqual(0); expect(it.answerIndex).toBeLessThan(it.options.length); expect(it.explanation.length).toBeGreaterThan(0); }
    }
    expect(buildSession({ category: 'math', mode: 'timed', difficulty: 3, seed: 1, content }).length).toBe(10);
    expect(buildSession({ category: 'daily', mode: 'daily', difficulty: 3, seed: 20261124, content }).length).toBe(8);
  });
  it('math items: answer option equals computed answer', () => {
    const items = buildSession({ category: 'math', mode: 'practice', difficulty: 4, seed: 9, content });
    for (const it of items) if (it.kind === 'choice') { const expr = it.display!.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-'); expect(String(eval(expr))).toBe(it.options[it.answerIndex]); }
  });
});
describe('profile', () => {
  const r = { category: 'math' as const, mode: 'quick' as const, total: 5, correct: 5, hintsUsed: 0, durationMs: 30000, difficulty: 3 };
  it('applies xp, streak, history, first achievement', () => {
    const { profile, xpGained, newAchievements, leveledUp } = applySession(newProfile(), r, '2026-11-24');
    expect(xpGained).toBeGreaterThan(0);
    expect(profile.xp).toBe(xpGained);
    expect(profile.streak.current).toBe(1);
    expect(profile.history.length).toBe(1);
    expect(newAchievements).toContain('first_session');
    expect(typeof leveledUp).toBe('boolean');
  });
  it('daily mode xp only first time per day', () => {
    const d = { ...r, mode: 'daily' as const };
    const one = applySession(newProfile(), d, '2026-11-24');
    const two = applySession(one.profile, d, '2026-11-24');
    expect(two.xpGained).toBeLessThan(one.xpGained);
  });
  it('flagged session grants nothing and does not count streak', () => {
    const f = applySession(newProfile(), { ...r, durationMs: 10 }, '2026-11-24');
    expect(f.xpGained).toBe(0); expect(f.profile.streak.current).toBe(0);
  });
  it('achievements have unique ids', () => { expect(new Set(ACHIEVEMENTS.map((a) => a.id)).size).toBe(ACHIEVEMENTS.length); });
  it('no duplicate achievement awards', () => {
    const a = applySession(newProfile(), r, '2026-11-24'); const b = applySession(a.profile, r, '2026-11-24');
    expect(b.newAchievements).not.toContain('first_session');
  });
});
