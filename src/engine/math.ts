import { Rng } from './rng';
import { numericOptions } from './options';

export interface MathProblem {
  expression: string; // display form with × ÷ −
  answer: number;
  options: number[];
  difficulty: number;
}

const disp = (s: string) => s.replace(/\*/g, '×').replace(/\//g, '÷').replace(/-/g, '−');

/** Builds an expression that evaluates to an exact integer. Difficulty 1..5. */
export function generateMathProblem(rng: Rng, difficulty: number): MathProblem {
  const d = Math.min(5, Math.max(1, Math.round(difficulty)));
  let expr: string;
  let answer: number;
  switch (d) {
    case 1: {
      const a = rng.int(2, 20), b = rng.int(2, 20);
      const add = rng.next() < 0.5;
      expr = add ? `${a} + ${b}` : `${a + b} - ${b}`;
      answer = add ? a + b : a;
      break;
    }
    case 2: {
      const a = rng.int(10, 99), b = rng.int(10, 99);
      const add = rng.next() < 0.5;
      expr = add ? `${a} + ${b}` : `${Math.max(a, b)} - ${Math.min(a, b)}`;
      answer = add ? a + b : Math.max(a, b) - Math.min(a, b);
      break;
    }
    case 3: {
      const a = rng.int(3, 12), b = rng.int(3, 12);
      if (rng.next() < 0.5) { expr = `${a} * ${b}`; answer = a * b; }
      else { expr = `${a * b} / ${b}`; answer = a; }
      break;
    }
    case 4: {
      const a = rng.int(2, 15), b = rng.int(2, 12), c = rng.int(2, 12);
      expr = `${a} + ${b} * ${c}`; answer = a + b * c;
      break;
    }
    default: {
      const a = rng.int(2, 12), b = rng.int(2, 12), c = rng.int(5, 40), e = rng.int(2, 9);
      expr = `${a} * ${b} - ${c} + ${e * rng.int(2, 9)} / ${e}`;
      const m = expr.match(/\/ (\d+)$/)!; // recompute exactly from parts
      const num = Number(expr.split('+ ')[1].split(' / ')[0]);
      answer = a * b - c + num / Number(m[1]);
    }
  }
  const spread = Math.max(3, Math.round(Math.abs(answer) * 0.15) + d);
  return { expression: disp(expr), answer, options: numericOptions(rng, answer, spread), difficulty: d };
}

/** Strict parse of user text; only an optional minus and digits are accepted. */
export function checkMathAnswer(p: MathProblem, text: string): boolean {
  const t = text.trim();
  if (!/^-?\d+$/.test(t)) return false;
  return Number(t) === p.answer;
}
