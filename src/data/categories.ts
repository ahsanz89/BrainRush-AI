import type { IconName } from '../ui';
import { CategoryId } from '../engine/types';
import { categoryColors } from '../theme/tokens';

export interface CategoryMeta { id: CategoryId; title: string; icon: IconName; blurb: string; how: string; skill: string; color: string }
const c = (id: CategoryId, title: string, icon: IconName, blurb: string, how: string, skill: string): CategoryMeta => ({ id, title, icon, blurb, how, skill, color: categoryColors[id] });

export const CATEGORIES: CategoryMeta[] = [
  c('logic', 'Logic Puzzles', 'extension-puzzle', 'Sequences and reasoning', 'Spot the rule behind a number sequence, or reason out what must be true.', 'Logical reasoning'),
  c('memory', 'Memory', 'grid', 'Watch, then repeat', 'Tiles light up in an order. Watch carefully, then tap them in the same order.', 'Working memory'),
  c('math', 'Mathematics', 'calculator', 'Mental arithmetic', 'Solve the calculation in your head and pick the right answer.', 'Mathematical thinking'),
  c('word', 'Word Challenges', 'text', 'Vocabulary and spelling', 'Choose the meaning or correct spelling of a word.', 'Vocabulary'),
  c('visual', 'Visual Patterns', 'shapes', 'What comes next?', 'A row of coloured shapes repeats in a pattern. Pick the shape that continues it.', 'Pattern recognition'),
  c('knowledge', 'General Knowledge', 'globe', 'Facts about our world', 'Answer questions about science, geography, history and more.', 'General knowledge'),
  c('attention', 'Attention', 'eye', 'Find the odd one out', 'A grid of similar symbols hides one that is different. Tap it as fast as you can.', 'Attention and focus'),
  c('critical', 'Critical Thinking', 'bulb', 'Question the argument', 'Spot weak evidence, bias and flawed arguments.', 'Critical thinking'),
  c('problem', 'Problem Solving', 'construct', 'Real-world puzzles', 'Work through everyday maths and planning problems step by step.', 'Problem solving'),
  c('speed', 'Speed Challenge', 'flash', 'Quick-fire sums', 'Fast arithmetic. Faster is better, but accuracy still counts.', 'Cognitive flexibility'),
];
export const catById = (id: string) => CATEGORIES.find((x) => x.id === id);
