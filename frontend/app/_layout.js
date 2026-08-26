import React from 'react';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Platform, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from '../theme';
import { AuthProvider, useAuth } from '../context/AuthContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <View style={{ flex: 1, backgroundColor: colors.cream }}>
          <StatusBar style="dark" />
          <MainTabs />
        </View>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

function MainTabs() {
  const { user } = useAuth();
  const isStaff = user?.role === 'staff';
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.forest,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.border,
          height: Platform.select({ ios: 84, android: 66, default: 66 }),
          paddingTop: 6,
          paddingBottom: Platform.select({ ios: 28, android: 8, default: 8 }),
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: '700', letterSpacing: 0.2 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Hem',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size - 3} color={color} />,
        }}
      />
      <Tabs.Screen
        name="tandvard"
        options={{
          title: 'Tandvård',
          tabBarIcon: ({ color, size }) => <Ionicons name="medkit" size={size - 3} color={color} />,
        }}
      />
      <Tabs.Screen
        name="tjanster"
        options={{
          title: 'Tjänster',
          tabBarIcon: ({ color, size }) => <Ionicons name="paw" size={size - 3} color={color} />,
        }}
      />
      <Tabs.Screen
        name="priser"
        options={{
          title: 'Priser',
          tabBarIcon: ({ color, size }) => <Ionicons name="pricetag" size={size - 3} color={color} />,
        }}
      />
      <Tabs.Screen
        name="djur"
        options={{
          title: isStaff ? 'Djur' : 'Mina djur',
          tabBarIcon: ({ color, size }) => <Ionicons name="paw-outline" size={size - 3} color={color} />,
        }}
      />
      <Tabs.Screen
        name="mer"
        options={{
          title: 'Mer',
          tabBarIcon: ({ color, size }) => <Ionicons name="ellipsis-horizontal" size={size - 3} color={color} />,
        }}
      />
      {/* Hidden routes */}
      <Tabs.Screen name="auth" options={{ href: null }} />
      <Tabs.Screen name="staff" options={{ href: null }} />
    </Tabs>
  );
}
