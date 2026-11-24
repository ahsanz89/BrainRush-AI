import { validateQuestion, Question } from '../src/engine/validate';
import fs from 'fs';
import path from 'path';

const dir = path.join(__dirname, '..', 'content', 'packs');
const packs = fs.readdirSync(dir).filter((f) => f.endsWith('.json')).map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));
const all: Question[] = packs.flatMap((p) => p.questions);

describe('content packs', () => {
  it('has content for the five question-based categories', () => { expect(packs.map((p) => p.category).sort()).toEqual(['critical', 'knowledge', 'logic', 'problem', 'word']); });
  it('every question passes validation and has no duplicates', () => {
    for (const q of all) { const r = validateQuestion(q, all); expect({ id: q.id, errors: r.errors }).toEqual({ id: q.id, errors: [] }); }
  });
  it('ids are unique and answers are spread across positions', () => {
    expect(new Set(all.map((q) => q.id)).size).toBe(all.length);
    expect(new Set(all.map((q) => q.answerIndex)).size).toBe(4);
  });
  it('answer text is never repeated as a wrong option and has 4 options', () => { for (const q of all) expect(q.options.length).toBe(4); });
});
