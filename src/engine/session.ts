import { createRng } from './rng';
import { generateMathProblem } from './math';
import { generatePattern } from './pattern';
import { generateVisual } from './visual';
import { generateMemory } from './memory';
import { generateOdd } from './attention';
import { Question } from './validate';
import { CATEGORY_IDS, CategoryId, Item, SessionCategory } from './types';
import { Mode } from './progress';

export type ContentPools = Partial<Record<CategoryId, Question[]>>;
export interface BuildArgs { category: SessionCategory; mode: Mode; difficulty: number; seed: number; content: ContentPools; }

export const SESSION_LENGTH: Record<Mode, number> = { quick: 5, practice: 8, timed: 10, daily: 8, mixed: 10 };
const clamp = (n: number) => Math.min(5, Math.max(1, Math.round(n)));
const HINTS: Record<string, string> = {
  logic: 'Look for what changes between neighbours.', math: 'Break it into smaller steps.', speed: 'Estimate first, then check.',
  visual: 'Find the shortest group that repeats.', knowledge: 'Rule out the options you know are wrong.', word: 'Think about where you have seen the word.',
  critical: 'Look for what the argument assumes.', problem: 'Try working backwards from the goal.',
};

export function buildSession(a: BuildArgs): Item[] {
  const rng = createRng(a.seed);
  const n = SESSION_LENGTH[a.mode];
  const cats: CategoryId[] = a.category === 'mixed' || a.category === 'daily'
    ? rng.shuffle(CATEGORY_IDS.filter((c) => !['logic', 'knowledge', 'word', 'critical', 'problem'].includes(c) || (a.content[c]?.length ?? 0) > 0 || c === 'logic'))
    : [a.category];
  const used = new Set<string>();
  const items: Item[] = [];
  for (let i = 0; i < n; i++) {
    const cat = cats[i % cats.length];
    const d = clamp(a.difficulty - 1 + (n > 1 ? (2 * i) / (n - 1) : 1));
    items.push(makeItem(cat, d, rng, a.content, used, `${a.seed}-${i}`));
  }
  return items;
}

function makeItem(cat: CategoryId, d: number, rng: ReturnType<typeof createRng>, content: ContentPools, used: Set<string>, id: string): Item {
  const hint = HINTS[cat] ?? '';
  if (cat === 'math' || cat === 'speed') {
    const p = generateMathProblem(rng, cat === 'speed' ? Math.max(1, d - 1) : d);
    const options = p.options.map(String);
    return { kind: 'choice', id, category: cat, prompt: 'Solve', display: p.expression, options, answerIndex: options.indexOf(String(p.answer)),
      explanation: `${p.expression} = ${p.answer}`, hint, difficulty: d };
  }
  if (cat === 'visual') {
    const v = generateVisual(rng, d);
    return { kind: 'choice', id, category: cat, prompt: 'What comes next?', display: v.shown.join(' '), options: v.options, answerIndex: v.answerIndex,
      explanation: `The group ${v.unit.join(' ')} repeats, so ${v.next} comes next.`, hint, difficulty: d };
  }
  if (cat === 'memory') { const m = generateMemory(rng, d);
    return { kind: 'memory', id, category: 'memory', grid: m.grid, sequence: m.sequence, explanation: `The order was ${m.sequence.map((t) => t + 1).join(' → ')}.`, difficulty: d }; }
  if (cat === 'attention') { const o = generateOdd(rng, d);
    return { kind: 'odd', id, category: 'attention', grid: o.grid, cells: o.cells, base: o.base, oddIndex: o.oddIndex,
      explanation: `Every other symbol was ${o.base}; only one was ${o.odd}.`, difficulty: d }; }
  const pool = content[cat] ?? [];
  if (cat === 'logic' && (pool.length === 0 || rng.next() < 0.5)) {
    const p = generatePattern(rng, d); const options = p.options.map(String);
    return { kind: 'choice', id, category: 'logic', prompt: 'Which number comes next?', display: p.sequence.join(', ') + ', ?', options,
      answerIndex: options.indexOf(String(p.answer)), explanation: `${p.rule} The next number is ${p.answer}.`, hint, difficulty: d };
  }
  const fresh = pool.filter((q) => !used.has(q.id));
  const near = fresh.filter((q) => Math.abs(q.difficulty - d) <= 1);
  const pickFrom = near.length ? near : fresh.length ? fresh : pool;
  const q = rng.pick(pickFrom);
  used.add(q.id);
  const order = rng.shuffle(q.options.map((_, i) => i));
  return { kind: 'choice', id: `${id}:${q.id}`, category: cat, prompt: q.prompt, options: order.map((i) => q.options[i]),
    answerIndex: order.indexOf(q.answerIndex), explanation: q.explanation, hint, difficulty: q.difficulty };
}
