import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { newProfile, Profile } from '../engine/profile';
import { Item } from '../engine/types';

const KEY = 'brainrush.profile.v1';
export interface ReviewEntry { item: Item; correct: boolean; answered: string }
export interface LastSession { review: ReviewEntry[]; durationMs: number; hintsUsed: number; category: string; mode: string; result?: any }

interface Store {
  profile: Profile; loaded: boolean;
  update: (fn: (p: Profile) => Profile) => void;
  reset: () => Promise<void>;
  last: LastSession | null; setLast: (s: LastSession | null) => void;
}
const Ctx = createContext<Store>(null as unknown as Store);

export function StoreProvider({ children }: { children: (s: Store) => React.ReactNode }) {
  const [profile, setProfile] = useState<Profile>(newProfile());
  const [loaded, setLoaded] = useState(false);
  const [last, setLast] = useState<LastSession | null>(null);
  const ref = useRef(profile);
  ref.current = profile;

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((raw) => {
      if (raw) { try { setProfile({ ...newProfile(), ...JSON.parse(raw) }); } catch { /* corrupted data: start fresh */ } }
    }).finally(() => setLoaded(true));
  }, []);

  const update = useCallback((fn: (p: Profile) => Profile) => {
    const next = fn(ref.current);
    ref.current = next;
    setProfile(next);
    AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
  }, []);
  const reset = useCallback(async () => { await AsyncStorage.removeItem(KEY); const p = newProfile(); ref.current = p; setProfile(p); setLast(null); }, []);
  const value = { profile, loaded, update, reset, last, setLast };
  return <Ctx.Provider value={value}>{children(value)}</Ctx.Provider>;
}
export const useStore = () => useContext(Ctx);
