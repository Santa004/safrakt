import React from 'react';
import { Pressable, Text, View, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, shadow } from '../theme';
import { callClinic } from '../utils/actions';
import { clinic } from '../data/clinic';

export default function CallButton({ variant = 'primary', size = 'lg', style, label }) {
  const isPrimary = variant === 'primary';
  const bg = isPrimary ? colors.forest : colors.white;
  const fg = isPrimary ? colors.cream : colors.forest;
  const isSm = size === 'sm';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Ring ${clinic.phoneDisplay}`}
      onPress={callClinic}
      style={({ pressed }) => [
        styles.btn,
        {
          backgroundColor: bg,
          borderWidth: isPrimary ? 0 : 1.5,
          borderColor: colors.forest,
          paddingVertical: isSm ? 12 : 18,
          paddingHorizontal: isSm ? 18 : 24,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
        !isSm && shadow.strong,
        style,
      ]}
      data-testid="call-button"
    >
      <View style={styles.row}>
        <Ionicons name="call" size={isSm ? 18 : 24} color={fg} />
        <View style={{ marginLeft: 12 }}>
          <Text style={{ color: fg, fontSize: isSm ? 14 : 15, fontWeight: '600', letterSpacing: 0.3 }}>
            {label || 'Ring kliniken'}
          </Text>
          <Text style={{ color: fg, fontSize: isSm ? 15 : 20, fontWeight: '800', letterSpacing: 0.5 }}>
            {clinic.phoneDisplay}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
});
