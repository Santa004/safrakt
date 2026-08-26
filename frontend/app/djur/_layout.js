import React from 'react';
import { Stack } from 'expo-router';
import { colors } from '../../theme';

export default function DjurLayout() {
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
      <Stack.Screen name="lagg-till" options={{ title: 'Lägg till djur', presentation: 'modal' }} />
      <Stack.Screen name="[id]/index" options={{ title: '' }} />
      <Stack.Screen name="[id]/boka" options={{ title: 'Be om tid' }} />
      <Stack.Screen name="[id]/logga" options={{ title: 'Logga besök' }} />
      <Stack.Screen name="[id]/redigera" options={{ title: 'Redigera' }} />
    </Stack>
  );
}
