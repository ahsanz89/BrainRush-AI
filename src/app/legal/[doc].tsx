import React from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AppText, Button, Card, Screen } from '../../ui';
import { useTheme } from '../../theme/ThemeProvider';
import legal from '../../../content/legal.json';
import { APP_CONFIG } from '../../config';

const fill = (s: string) => s.replace(/{{SUPPORT_EMAIL}}/g, APP_CONFIG.supportEmail).replace(/{{DEVELOPER_NAME}}/g, APP_CONFIG.developerName);

export default function Legal() {
  const { doc } = useLocalSearchParams<{ doc: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const d = (legal.docs as any)[doc ?? 'privacy'];
  if (!d) return <Screen><AppText v="title">Not found</AppText><Button label="Back" onPress={() => router.back()} /></Screen>;
  return (
    <Screen>
      <Button label="Back" icon="chevron-back" variant="ghost" onPress={() => router.back()} style={{ alignSelf: 'flex-start' }} />
      <AppText v="title" accessibilityRole="header">{d.title}</AppText>
      <AppText v="caption" color={colors.muted}>Effective {legal.effectiveDate}</AppText>
      {d.sections.map(([h, b]: [string, string]) => (
        <Card key={h}><View style={{ gap: 6 }}><AppText v="heading">{h}</AppText><AppText v="body" color={colors.muted}>{fill(b)}</AppText></View></Card>
      ))}
    </Screen>
  );
}
