import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme';
import { isOpenNow } from '../data/hours';

export default function StatusChip({ style }) {
  const status = isOpenNow();
  const bg = status.open ? colors.forest : colors.creamAlt;
  const fg = status.open ? colors.cream : colors.forestDeep;
  const dot = status.open ? '#8FD3A0' : colors.gold;
  return (
    <View style={[styles.chip, { backgroundColor: bg }, style]} data-testid="status-chip">
      <View style={[styles.dot, { backgroundColor: dot }]} />
      <Text style={[styles.text, { color: fg }]}>
        {status.open ? `Öppet nu · stänger ${status.closesAt}` : `Stängt · ${status.nextText}`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
  },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  text: { fontSize: 13, fontWeight: '700', letterSpacing: 0.3 },
});
