import React from 'react';
import { Stack } from 'expo-router';
import { colors } from '../../theme';

export default function StaffLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.cream },
        headerTintColor: colors.forest,
        headerTitleStyle: { fontWeight: '800' },
        contentStyle: { backgroundColor: colors.cream },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Klinikläge' }} />
      <Stack.Screen name="inbox" options={{ title: 'Tidsförfrågningar' }} />
      <Stack.Screen name="djur" options={{ title: 'Djur i systemet' }} />
    </Stack>
  );
}
