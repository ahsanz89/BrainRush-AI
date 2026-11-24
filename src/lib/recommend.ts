import { Profile } from '../engine/profile';
import { CATEGORY_IDS, CategoryId } from '../engine/types';

/** Suggest a category: untried interests first, then the weakest tried one, otherwise rotate by day. */
export function recommendCategory(p: Profile, dayIndex = 0): CategoryId {
  const untriedInterest = CATEGORY_IDS.find((c) => p.interests.includes(c) && !(p.categoryStats[c]?.played));
  if (untriedInterest) return untriedInterest;
  const untried = CATEGORY_IDS.find((c) => !(p.categoryStats[c]?.played));
  if (untried) return untried;
  let worst: CategoryId = CATEGORY_IDS[dayIndex % CATEGORY_IDS.length], worstAcc = 2;
  for (const c of CATEGORY_IDS) { const s = p.categoryStats[c]; if (s && s.total) { const a = s.correct / s.total; if (a < worstAcc) { worstAcc = a; worst = c; } } }
  return worst;
}
export const difficultyFor = (d: Profile['difficulty']) => (d === 'easy' ? 2 : d === 'hard' ? 4 : 3);
