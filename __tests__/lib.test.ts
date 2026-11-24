import { recommendCategory, difficultyFor } from '../src/lib/recommend';
import { newProfile } from '../src/engine/profile';
import { todayISO, dailySeed, lastDays } from '../src/lib/date';

describe('recommend', () => {
  it('prefers untried interests', () => { const p = { ...newProfile(), interests: ['memory'] }; expect(recommendCategory(p)).toBe('memory'); });
  it('picks weakest tried category when all tried', () => {
    const p = newProfile();
    for (const c of ['logic','memory','math','word','visual','knowledge','attention','critical','problem','speed']) p.categoryStats[c] = { played: 1, correct: 9, total: 10 };
    p.categoryStats.word = { played: 1, correct: 2, total: 10 };
    expect(recommendCategory(p)).toBe('word');
  });
  it('maps difficulty', () => { expect(difficultyFor('easy')).toBe(2); expect(difficultyFor('hard')).toBe(4); });
});
describe('dates', () => {
  it('formats local date and seed', () => { const d = new Date(2026, 10, 24); expect(todayISO(d)).toBe('2026-11-24'); expect(dailySeed(d)).toBe(20261124); });
  it('lastDays returns n ascending days ending today', () => { const l = lastDays(7, new Date(2026, 10, 24)); expect(l.length).toBe(7); expect(l[6]).toBe('2026-11-24'); expect(l[0]).toBe('2026-11-18'); });
});
