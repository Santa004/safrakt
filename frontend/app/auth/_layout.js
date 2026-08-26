import React from 'react';
import { Stack } from 'expo-router';
import { colors } from '../../theme';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.cream },
        headerTintColor: colors.forest,
        headerTitleStyle: { fontWeight: '800' },
        contentStyle: { backgroundColor: colors.cream },
      }}
    >
      <Stack.Screen name="logga-in" options={{ title: 'Logga in' }} />
      <Stack.Screen name="skapa-konto" options={{ title: 'Skapa konto' }} />
      <Stack.Screen name="glomt" options={{ title: 'Glömt lösenord' }} />
    </Stack>
  );
}
