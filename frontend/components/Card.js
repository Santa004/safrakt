import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, radius, spacing, shadow } from '../theme';

export default function Card({ children, style, accent, testID }) {
  return (
    <View
      style={[
        styles.card,
        accent && { borderLeftWidth: 4, borderLeftColor: accent, paddingLeft: spacing.md + 2 },
        style,
      ]}
      data-testid={testID}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
});
