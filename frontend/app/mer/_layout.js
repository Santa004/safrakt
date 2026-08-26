import React from 'react';
import { Stack } from 'expo-router';
import { colors } from '../../theme';

export default function MerLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.cream },
        headerTintColor: colors.forest,
        headerTitleStyle: { fontWeight: '800' },
        contentStyle: { backgroundColor: colors.cream },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="om-oss" options={{ title: 'Om oss' }} />
      <Stack.Screen name="team" options={{ title: 'Team' }} />
      <Stack.Screen name="kontakt" options={{ title: 'Kontakt' }} />
      <Stack.Screen name="hitta-hit" options={{ title: 'Hitta hit' }} />
      <Stack.Screen name="integritet" options={{ title: 'Integritet' }} />
    </Stack>
  );
}
