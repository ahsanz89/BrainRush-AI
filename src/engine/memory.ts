import { Rng } from './rng';

export interface MemoryPuzzle { grid: number; sequence: number[]; }

export function generateMemory(rng: Rng, difficulty: number): MemoryPuzzle {
  const d = Math.min(5, Math.max(1, Math.round(difficulty)));
  const grid = d <= 2 ? 3 : 4;
  const length = 2 + d;
  const sequence: number[] = [];
  while (sequence.length < length) {
    const t = rng.int(0, grid * grid - 1);
    if (sequence[sequence.length - 1] !== t) sequence.push(t);
  }
  return { grid, sequence };
}

export const checkMemory = (m: MemoryPuzzle, taps: number[]) =>
  taps.length === m.sequence.length && taps.every((t, i) => t === m.sequence[i]);
