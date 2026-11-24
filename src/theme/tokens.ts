export const palette = {
  dark: { bg: '#0F0B24', surface: '#1A1538', surface2: '#251F4D', text: '#F4F2FF', muted: '#B3ADDB', primary: '#8B6DFF', onPrimary: '#10092E', accent: '#2EE6A6', onAccent: '#06261B', warn: '#FFB020', danger: '#FF6B8A', border: '#352D6B' },
  light: { bg: '#F6F4FF', surface: '#FFFFFF', surface2: '#ECE8FF', text: '#17123A', muted: '#585280', primary: '#5B3DF5', onPrimary: '#FFFFFF', accent: '#0B8F63', onAccent: '#FFFFFF', warn: '#B36B00', danger: '#C81E4A', border: '#D9D3FA' },
};
export type Colors = typeof palette.dark;
export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };
export const radius = { sm: 10, md: 16, lg: 24, pill: 999 };
export const type = {
  display: { fontSize: 34, lineHeight: 40, fontWeight: '800' as const },
  title: { fontSize: 24, lineHeight: 30, fontWeight: '700' as const },
  heading: { fontSize: 18, lineHeight: 24, fontWeight: '700' as const },
  body: { fontSize: 16, lineHeight: 23, fontWeight: '400' as const },
  label: { fontSize: 14, lineHeight: 20, fontWeight: '600' as const },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '500' as const },
};
export const categoryColors: Record<string, string> = {
  logic: '#7C5CFF', memory: '#FF7AB6', math: '#34C3FF', word: '#FFB020', visual: '#2EE6A6',
  knowledge: '#FF8A5B', attention: '#B38BFF', critical: '#5EE1E1', problem: '#9BE564', speed: '#FF5C7A',
};
