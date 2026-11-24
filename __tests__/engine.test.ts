import { levelForXp, xpForLevel, computeXp, scoreSession, updateStreak, SessionInput } from '../src/engine/progress';
import { generateMathProblem, checkMathAnswer } from '../src/engine/math';
import { generatePattern, checkPattern } from '../src/engine/pattern';
import { createRng } from '../src/engine/rng';
import { validateQuestion } from '../src/engine/validate';

describe('levels', () => {
  it('level 1 at 0 xp, monotonic thresholds', () => {
    expect(levelForXp(0)).toBe(1);
    expect(xpForLevel(2)).toBeGreaterThan(xpForLevel(1));
    expect(levelForXp(xpForLevel(5))).toBe(5);
    expect(levelForXp(xpForLevel(5) - 1)).toBe(4);
  });
});

describe('scoring and xp', () => {
  const base: SessionInput = { total: 10, correct: 8, hintsUsed: 0, durationMs: 60000, minPlausibleMsPerItem: 800, difficulty: 2, mode: 'quick' };
  it('scores percentage', () => { expect(scoreSession(base).percent).toBe(80); });
  it('hints reduce xp', () => {
    expect(computeXp({ ...base, hintsUsed: 3 }, 0).xp).toBeLessThan(computeXp(base, 0).xp);
  });
  it('rejects impossibly fast sessions (anti-bot)', () => {
    const r = computeXp({ ...base, durationMs: 500 }, 0);
    expect(r.xp).toBe(0); expect(r.flagged).toBe(true);
  });
  it('daily xp cap enforced', () => {
    const r = computeXp(base, 1000000);
    expect(r.xp).toBe(0);
  });
  it('rejects correct > total', () => {
    expect(() => scoreSession({ ...base, correct: 11 })).toThrow();
  });
  it('xp never negative', () => { expect(computeXp({ ...base, correct: 0, hintsUsed: 10 }, 0).xp).toBeGreaterThanOrEqual(0); });
});

describe('streak', () => {
  it('increments on consecutive day', () => { expect(updateStreak({ current: 3, best: 3, lastDay: '2026-11-23' }, '2026-11-24')).toEqual({ current: 4, best: 4, lastDay: '2026-11-24' }); });
  it('same day no change', () => { expect(updateStreak({ current: 3, best: 5, lastDay: '2026-11-24' }, '2026-11-24').current).toBe(3); });
  it('gap resets to 1, keeps best', () => { const s = updateStreak({ current: 9, best: 9, lastDay: '2026-11-20' }, '2026-11-24'); expect(s.current).toBe(1); expect(s.best).toBe(9); });
  it('handles month boundary', () => { expect(updateStreak({ current: 1, best: 1, lastDay: '2026-11-30' }, '2026-12-01').current).toBe(2); });
});

describe('math generator', () => {
  it('is deterministic per seed and answer key is correct', () => {
    for (let d = 1; d <= 5; d++) for (let s = 0; s < 200; s++) {
      const p = generateMathProblem(createRng(s), d);
      expect(Number.isInteger(p.answer)).toBe(true);
      expect(checkMathAnswer(p, String(p.answer))).toBe(true);
      expect(checkMathAnswer(p, String(p.answer + 1))).toBe(false);
      expect(eval(p.expression.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-'))).toBe(p.answer);
    }
    expect(generateMathProblem(createRng(7), 3)).toEqual(generateMathProblem(createRng(7), 3));
  });
  it('parses user text safely', () => {
    const p = generateMathProblem(createRng(1), 1);
    expect(checkMathAnswer(p, ' ' + p.answer + ' ')).toBe(true);
    expect(checkMathAnswer(p, 'abc')).toBe(false);
    expect(checkMathAnswer(p, '')).toBe(false);
  });
  it('multiple-choice options include answer exactly once, unique', () => {
    for (let s = 0; s < 100; s++) { const p = generateMathProblem(createRng(s), 2); expect(p.options.filter((o) => o === p.answer).length).toBe(1); expect(new Set(p.options).size).toBe(p.options.length); }
  });
});

describe('pattern generator', () => {
  it('next-in-sequence answers are valid and unambiguous options', () => {
    for (let d = 1; d <= 5; d++) for (let s = 0; s < 200; s++) {
      const q = generatePattern(createRng(s), d);
      expect(checkPattern(q, q.answer)).toBe(true);
      expect(q.options.filter((o) => o === q.answer).length).toBe(1);
      expect(new Set(q.options).size).toBe(q.options.length);
    }
  });
});

describe('validateQuestion (content QA)', () => {
  const ok = { id: 'q1', category: 'general', prompt: 'What is the capital of France?', options: ['Paris', 'Rome', 'Madrid', 'Berlin'], answerIndex: 0, explanation: 'Paris is the capital of France.', difficulty: 1, source: 'original' };
  it('accepts valid', () => { expect(validateQuestion(ok, []).ok).toBe(true); });
  it('rejects bad answer index', () => { expect(validateQuestion({ ...ok, answerIndex: 9 }, []).ok).toBe(false); });
  it('rejects duplicate options', () => { expect(validateQuestion({ ...ok, options: ['A', 'A', 'B', 'C'] }, []).ok).toBe(false); });
  it('rejects near-duplicate of existing', () => { expect(validateQuestion({ ...ok, id: 'q2', prompt: 'what is the capital of france' }, [ok]).ok).toBe(false); });
  it('rejects missing explanation/source', () => { expect(validateQuestion({ ...ok, explanation: '' }, []).ok).toBe(false); expect(validateQuestion({ ...ok, source: '' }, []).ok).toBe(false); });
  it('rejects "all of the above" style ambiguity', () => { expect(validateQuestion({ ...ok, options: ['Paris', 'All of the above', 'x', 'y'] }, []).ok).toBe(false); });
});
