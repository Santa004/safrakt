import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import CallButton from './CallButton';
import { spacing, colors } from '../theme';

// Sticky Call at bottom, offset to sit above the tab bar
export default function StickyCall({ bottomOffset = 78 }) {
  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrap, { bottom: bottomOffset }]}
    >
      <View pointerEvents="auto" style={styles.inner}>
        <CallButton style={{ width: '100%' }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    ...Platform.select({ web: { position: 'fixed' } }),
  },
  inner: { width: '100%', maxWidth: 560 },
});
