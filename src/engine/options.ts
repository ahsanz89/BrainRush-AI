import { Rng } from './rng';

/** Build 4 unique numeric options containing `answer` exactly once. */
export function numericOptions(rng: Rng, answer: number, spread: number): number[] {
  const set = new Set<number>([answer]);
  let guard = 0;
  while (set.size < 4) {
    const delta = rng.int(1, Math.max(2, spread)) * (rng.next() < 0.5 ? -1 : 1);
    set.add(answer + delta + (guard++ > 50 ? guard : 0));
  }
  return rng.shuffle([...set]);
}
