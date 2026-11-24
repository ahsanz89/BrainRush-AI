export interface Question {
  id: string; category: string; prompt: string; options: string[];
  answerIndex: number; explanation: string; difficulty: number; source: string;
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
const words = (s: string) => new Set(norm(s).split(' ').filter(Boolean));
const AMBIGUOUS = /(all|none|both)\s+of\s+the\s+above|both\s+[a-d]\s+and\s+[a-d]/i;

export function validateQuestion(q: Question, existing: Question[]): { ok: boolean; errors: string[] } {
  const e: string[] = [];
  if (!q.prompt || q.prompt.trim().length < 8) e.push('prompt too short');
  if (!Array.isArray(q.options) || q.options.length < 2 || q.options.length > 6) e.push('option count');
  else {
    if (q.options.some((o) => !o || !o.trim())) e.push('empty option');
    if (new Set(q.options.map(norm)).size !== q.options.length) e.push('duplicate options');
    if (q.options.some((o) => AMBIGUOUS.test(o))) e.push('ambiguous option');
    if (!Number.isInteger(q.answerIndex) || q.answerIndex < 0 || q.answerIndex >= q.options.length) e.push('answerIndex out of range');
  }
  if (!q.explanation || !q.explanation.trim()) e.push('missing explanation');
  if (!q.source || !q.source.trim()) e.push('missing source');
  if (!Number.isInteger(q.difficulty) || q.difficulty < 1 || q.difficulty > 5) e.push('difficulty');
  const w = words(q.prompt);
  for (const x of existing) {
    if (x.id === q.id) continue;
    const xw = words(x.prompt);
    const inter = [...w].filter((t) => xw.has(t)).length;
    const union = new Set([...w, ...xw]).size;
    if (union > 0 && inter / union >= 0.85) { e.push(`near-duplicate of ${x.id}`); break; }
  }
  return { ok: e.length === 0, errors: e };
}
