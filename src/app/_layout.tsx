import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { StoreProvider } from '../state/store';
import { ThemeProvider, useTheme } from '../theme/ThemeProvider';

SplashScreen.preventAutoHideAsync().catch(() => {});

function Inner({ loaded }: { loaded: boolean }) {
  const { colors, dark } = useTheme();
  useEffect(() => { if (loaded) SplashScreen.hideAsync().catch(() => {}); }, [loaded]);
  if (!loaded) return null;
  return (
    <>
      <StatusBar style={dark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg }, animation: 'slide_from_right' }}>
        <Stack.Screen name="play" options={{ gestureEnabled: false, animation: 'fade' }} />
        <Stack.Screen name="results" options={{ gestureEnabled: false, animation: 'fade' }} />
      </Stack>
    </>
  );
}
export default function Root() {
  return (
    <SafeAreaProvider>
      <StoreProvider>
        {(s) => (<ThemeProvider pref={s.profile.theme}><Inner loaded={s.loaded} /></ThemeProvider>)}
      </StoreProvider>
    </SafeAreaProvider>
  );
}
