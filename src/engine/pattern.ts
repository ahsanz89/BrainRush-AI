import { Rng } from './rng';
import { numericOptions } from './options';

export interface PatternQuestion {
  sequence: number[];
  answer: number;
  options: number[];
  rule: string; // for the explanation
  difficulty: number;
}

export function generatePattern(rng: Rng, difficulty: number): PatternQuestion {
  const d = Math.min(5, Math.max(1, Math.round(difficulty)));
  const kinds = d <= 1 ? ['arith'] : d === 2 ? ['arith', 'geo'] : d === 3 ? ['arith', 'geo', 'square'] : ['geo', 'square', 'alt', 'fib'];
  const kind = rng.pick(kinds);
  const seq: number[] = [];
  let rule = '';
  const len = 6;
  if (kind === 'arith') {
    const s = rng.int(1, 20), step = rng.int(2, 3 + d * 2);
    for (let i = 0; i < len; i++) seq.push(s + i * step);
    rule = `Each term adds ${step}.`;
  } else if (kind === 'geo') {
    const s = rng.int(1, 4), r = rng.int(2, 3);
    for (let i = 0; i < len; i++) seq.push(s * r ** i);
    rule = `Each term is multiplied by ${r}.`;
  } else if (kind === 'square') {
    const o = rng.int(0, 5);
    for (let i = 1; i <= len; i++) seq.push((i + o) ** 2);
    rule = 'The terms are consecutive square numbers.';
  } else if (kind === 'alt') {
    const s = rng.int(1, 10), a = rng.int(2, 5), b = rng.int(6, 9);
    let v = s; seq.push(v);
    for (let i = 1; i < len; i++) { v += i % 2 ? a : b; seq.push(v); }
    rule = `The steps alternate between adding ${a} and adding ${b}.`;
  } else {
    const a = rng.int(1, 4), b = rng.int(1, 4);
    seq.push(a, b);
    for (let i = 2; i < len; i++) seq.push(seq[i - 1] + seq[i - 2]);
    rule = 'Each term is the sum of the two before it.';
  }
  const answer = seq.pop()!;
  const spread = Math.max(3, Math.round(answer * 0.2));
  return { sequence: seq, answer, options: numericOptions(rng, answer, spread), rule, difficulty: d };
}

export const checkPattern = (q: PatternQuestion, choice: number) => choice === q.answer;
