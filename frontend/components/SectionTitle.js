import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, type, spacing } from '../theme';

export default function SectionTitle({ eyebrow, title, subtitle, style }) {
  return (
    <View style={[{ marginBottom: spacing.md }, style]}>
      {!!eyebrow && <Text style={type.label}>{eyebrow}</Text>}
      {!!title && <Text style={[type.h1, { marginTop: eyebrow ? 6 : 0 }]}>{title}</Text>}
      {!!subtitle && <Text style={[type.bodyMuted, { marginTop: 6 }]}>{subtitle}</Text>}
    </View>
  );
}
