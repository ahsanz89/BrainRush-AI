import knowledge from '../../content/packs/knowledge.json';
import word from '../../content/packs/word.json';
import logic from '../../content/packs/logic.json';
import critical from '../../content/packs/critical.json';
import problem from '../../content/packs/problem.json';
import { ContentPools } from '../engine/session';

/** Bundled packs: the offline fallback. Remote updates (GitHub Pages) can override per category. */
export const bundledContent: ContentPools = {
  knowledge: knowledge.questions, word: word.questions, logic: logic.questions, critical: critical.questions, problem: problem.questions,
} as ContentPools;
