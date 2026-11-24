import { Rng } from './rng';

const SYMBOLS = ['🔴', '🔵', '🟢', '🟡', '🟣', '🟠', '🟥', '🟦', '🟩', '🟨'];

export interface VisualQuestion { shown: string[]; next: string; options: string[]; answerIndex: number; unit: string[]; }

/** Repeating-unit sequence; the answer is the next symbol of the cycle. */
export function generateVisual(rng: Rng, difficulty: number): VisualQuestion {
  const d = Math.min(5, Math.max(1, Math.round(difficulty)));
  const unitLen = d <= 1 ? 2 : d <= 3 ? 3 : 4;
  const palette = rng.shuffle(SYMBOLS).slice(0, Math.min(unitLen + (d >= 4 ? 1 : 0), 5));
  const unit: string[] = [];
  for (let i = 0; i < unitLen; i++) unit.push(palette[i % palette.length]);
  if (new Set(unit).size < 2) unit[1] = palette[1];
  const showLen = unitLen * 2 + rng.int(1, unitLen - 1 || 1);
  const full = Array.from({ length: showLen + 1 }, (_, i) => unit[i % unitLen]);
  const next = full.pop()!;
  const set = new Set<string>([next]);
  for (const s of rng.shuffle(SYMBOLS)) { if (set.size >= 4) break; set.add(s); }
  const options = rng.shuffle([...set]);
  return { shown: full, next, options, answerIndex: options.indexOf(next), unit };
}
