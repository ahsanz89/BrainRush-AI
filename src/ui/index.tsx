import React, { useRef } from 'react';
import { Animated, Pressable, ScrollView, StyleProp, Text, TextProps, View, ViewProps, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import { radius, space, type } from '../theme/tokens';
import { useStore } from '../state/store';

export type IconName = React.ComponentProps<typeof Ionicons>['name'];

export function AppText({ v = 'body', color, style, ...rest }: TextProps & { v?: keyof typeof type; color?: string }) {
  const { colors } = useTheme();
  return <Text {...rest} style={[type[v], { color: color ?? colors.text }, style]} />;
}

export function Screen({ children, scroll = true, pad = true, bottomInset = true }: { children: React.ReactNode; scroll?: boolean; pad?: boolean; bottomInset?: boolean }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const body = { padding: pad ? space.lg : 0, paddingTop: insets.top + space.lg, paddingBottom: (bottomInset ? insets.bottom : 0) + space.xl, gap: space.lg };
  if (!scroll) return <View style={[{ flex: 1, backgroundColor: colors.bg }, body]}>{children}</View>;
  return <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={body} showsVerticalScrollIndicator={false}>{children}</ScrollView>;
}

export function Card({ children, style, tint }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; tint?: string }) {
  const { colors } = useTheme();
  return <View style={[{ backgroundColor: tint ?? colors.surface, borderRadius: radius.lg, padding: space.lg, borderWidth: 1, borderColor: colors.border }, style]}>{children}</View>;
}

export function Button({ label, onPress, variant = 'primary', icon, disabled, style }: { label: string; onPress: () => void; variant?: 'primary' | 'secondary' | 'ghost' | 'danger'; icon?: IconName; disabled?: boolean; style?: StyleProp<ViewStyle> }) {
  const { colors } = useTheme();
  const { profile } = useStore();
  const scale = useRef(new Animated.Value(1)).current;
  const bg = variant === 'primary' ? colors.primary : variant === 'danger' ? colors.danger : variant === 'secondary' ? colors.surface2 : 'transparent';
  const fg = variant === 'primary' ? colors.onPrimary : variant === 'danger' ? '#fff' : colors.text;
  const to = (v: number) => Animated.spring(scale, { toValue: v, useNativeDriver: true, speed: 40, bounciness: 4 }).start();
  return (
    <Animated.View style={[{ transform: [{ scale }], opacity: disabled ? 0.5 : 1 }, style]}>
      <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ disabled }} disabled={disabled}
        onPressIn={() => to(0.97)} onPressOut={() => to(1)}
        onPress={() => { if (profile.haptics) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {}); onPress(); }}
        style={{ minHeight: 52, borderRadius: radius.pill, backgroundColor: bg, paddingHorizontal: space.xl, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: space.sm, borderWidth: variant === 'ghost' ? 1 : 0, borderColor: colors.border }}>
        {icon ? <Ionicons name={icon} size={20} color={fg} /> : null}
        <AppText v="label" color={fg} style={{ fontSize: 16 }}>{label}</AppText>
      </Pressable>
    </Animated.View>
  );
}

export function Chip({ label, selected, onPress, icon }: { label: string; selected?: boolean; onPress?: () => void; icon?: IconName }) {
  const { colors } = useTheme();
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected }} onPress={onPress}
      style={{ minHeight: 44, paddingHorizontal: space.lg, borderRadius: radius.pill, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: selected ? colors.primary : colors.surface2, borderWidth: 1, borderColor: selected ? colors.primary : colors.border }}>
      {icon ? <Ionicons name={icon} size={16} color={selected ? colors.onPrimary : colors.text} /> : null}
      <AppText v="label" color={selected ? colors.onPrimary : colors.text}>{label}</AppText>
    </Pressable>
  );
}

export function ProgressBar({ value, color, height = 10 }: { value: number; color?: string; height?: number }) {
  const { colors } = useTheme();
  const pct = Math.max(0, Math.min(1, value));
  return (
    <View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: Math.round(pct * 100) }} style={{ height, borderRadius: height, backgroundColor: colors.surface2, overflow: 'hidden' }}>
      <View style={{ width: `${pct * 100}%`, height, borderRadius: height, backgroundColor: color ?? colors.primary }} />
    </View>
  );
}

export function Ring({ value, size = 96, stroke = 10, color, children }: { value: number; size?: number; stroke?: number; color?: string; children?: React.ReactNode }) {
  const { colors } = useTheme();
  const r = (size - stroke) / 2, c = 2 * Math.PI * r, pct = Math.max(0, Math.min(1, value));
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={colors.surface2} strokeWidth={stroke} fill="none" />
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={color ?? colors.primary} strokeWidth={stroke} fill="none" strokeLinecap="round" strokeDasharray={`${c * pct} ${c}`} />
      </Svg>
      {children}
    </View>
  );
}

export function IconBadge({ name, color, size = 48 }: { name: IconName; color: string; size?: number }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2.4, backgroundColor: color + '33', alignItems: 'center', justifyContent: 'center' }}>
      <Ionicons name={name} size={size * 0.5} color={color} />
    </View>
  );
}

export function Row({ children, style, ...rest }: ViewProps & { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View {...rest} style={[{ flexDirection: 'row', alignItems: 'center', gap: space.md }, style]}>{children}</View>;
}

export function Segmented<T extends string | number | boolean>({ options, value, onChange }: { options: { label: string; value: T }[]; value: T; onChange: (v: T) => void }) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', backgroundColor: colors.surface2, borderRadius: radius.pill, padding: 4 }}>
      {options.map((o) => (
        <Pressable key={String(o.value)} accessibilityRole="button" accessibilityState={{ selected: o.value === value }} onPress={() => onChange(o.value)}
          style={{ flex: 1, minHeight: 44, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', backgroundColor: o.value === value ? colors.primary : 'transparent' }}>
          <AppText v="label" color={o.value === value ? colors.onPrimary : colors.text}>{o.label}</AppText>
        </Pressable>
      ))}
    </View>
  );
}

export function Empty({ icon, title, body }: { icon: IconName; title: string; body: string }) {
  const { colors } = useTheme();
  return (
    <View style={{ alignItems: 'center', padding: space.xl, gap: space.sm }}>
      <Ionicons name={icon} size={36} color={colors.muted} />
      <AppText v="heading">{title}</AppText>
      <AppText v="body" color={colors.muted} style={{ textAlign: 'center' }}>{body}</AppText>
    </View>
  );
}
