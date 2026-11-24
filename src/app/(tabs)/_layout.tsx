import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeProvider';

export default function TabsLayout() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  type IconName = React.ComponentProps<typeof Ionicons>['name'];
  const icon = (n: IconName, on: IconName) => {
    const TabIcon = ({ color, focused }: { color: any; focused: boolean }) => <Ionicons name={focused ? on : n} size={24} color={color} />;
    return TabIcon;
  };
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.primary, tabBarInactiveTintColor: colors.muted,
      tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border, height: 72 + insets.bottom, paddingBottom: insets.bottom + 10, paddingTop: 8 },
      tabBarLabelStyle: { fontSize: 12, fontWeight: '600' } }}>
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: icon('home-outline', 'home') }} />
      <Tabs.Screen name="train" options={{ title: 'Train', tabBarIcon: icon('barbell-outline', 'barbell') }} />
      <Tabs.Screen name="progress" options={{ title: 'Progress', tabBarIcon: icon('stats-chart-outline', 'stats-chart') }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: icon('person-outline', 'person') }} />
    </Tabs>
  );
}
