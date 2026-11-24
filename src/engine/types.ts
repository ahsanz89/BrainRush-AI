export const CATEGORY_IDS = ['logic','memory','math','word','visual','knowledge','attention','critical','problem','speed'] as const;
export type CategoryId = (typeof CATEGORY_IDS)[number];
export type SessionCategory = CategoryId | 'mixed' | 'daily';

export interface ChoiceItem {
  kind: 'choice'; id: string; category: CategoryId; prompt: string;
  display?: string;            // large text: expression, number sequence, symbol sequence
  options: string[]; answerIndex: number; explanation: string; hint: string; difficulty: number;
}
export interface MemoryItem {
  kind: 'memory'; id: string; category: 'memory'; grid: number; sequence: number[];
  explanation: string; difficulty: number;
}
export interface OddItem {
  kind: 'odd'; id: string; category: 'attention'; grid: number; cells: string[]; base: string; oddIndex: number;
  explanation: string; difficulty: number;
}
export type Item = ChoiceItem | MemoryItem | OddItem;
