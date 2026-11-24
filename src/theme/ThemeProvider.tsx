import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { Colors, palette } from './tokens';

const Ctx = createContext<{ colors: Colors; dark: boolean }>({ colors: palette.dark, dark: true });
export function ThemeProvider({ pref, children }: { pref: 'system' | 'light' | 'dark'; children: React.ReactNode }) {
  const sys = useColorScheme();
  const dark = pref === 'system' ? sys !== 'light' : pref === 'dark';
  return <Ctx.Provider value={{ colors: dark ? palette.dark : palette.light, dark }}>{children}</Ctx.Provider>;
}
export const useTheme = () => useContext(Ctx);
