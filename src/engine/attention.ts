import { Rng } from './rng';

const PAIRS: [string, string][] = [['O', 'Q'], ['b', 'd'], ['p', 'q'], ['E', 'F'], ['M', 'N'], ['6', '9'], ['C', 'G'], ['V', 'U'], ['I', 'l']];

export interface OddPuzzle { grid: number; cells: string[]; base: string; odd: string; oddIndex: number; }

export function generateOdd(rng: Rng, difficulty: number): OddPuzzle {
  const d = Math.min(5, Math.max(1, Math.round(difficulty)));
  const grid = d <= 2 ? 4 : d <= 4 ? 5 : 6;
  const [x, y] = rng.pick(PAIRS);
  const [base, odd] = rng.next() < 0.5 ? [x, y] : [y, x];
  const cells = Array.from({ length: grid * grid }, () => base);
  const oddIndex = rng.int(0, cells.length - 1);
  cells[oddIndex] = odd;
  return { grid, cells, base, odd, oddIndex };
}
