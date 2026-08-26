import React, { useMemo, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius } from '../theme';
import { priceGroups } from '../data/clinic';
import SectionTitle from '../components/SectionTitle';
import Card from '../components/Card';
import StickyCall from '../components/StickyCall';

export default function Priser() {
  const [q, setQ] = useState('');
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return priceGroups;
    return priceGroups
      .map((g) => {
        const groupMatches = g.title.toLowerCase().includes(query);
        const items = groupMatches
          ? g.items
          : g.items.filter(
              (i) => i.name.toLowerCase().includes(query) || (i.price || '').toLowerCase().includes(query)
            );
        return { ...g, items };
      })
      .filter((g) => g.items.length > 0);
  }, [q]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: 200 }} keyboardShouldPersistTaps="handled">
        <SectionTitle eyebrow="Riktvärden" title="Priser" />

        {/* Rules banner */}
        <View style={styles.banner} data-testid="rules-banner">
          <RulesRow icon="card-outline" text="Ingen kontantbetalning · endast kort" />
          <RulesRow icon="shield-checkmark-outline" text="Direktreglering försäkring 145 kr" />
          <RulesRow icon="alarm-outline" text="Uteblivet besök 550 kr · 1 100 kr (kirurgi/tand/ultraljud/konsult)" />
          <RulesRow icon="alert-circle-outline" text="Akutavgift 840 kr + 50 % på ingreppet" last />
        </View>

        {/* Search */}
        <View style={styles.searchBox} data-testid="price-search-wrap">
          <Ionicons name="search" size={18} color={colors.muted} />
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="Sök i priserna, t.ex. vaccination"
            placeholderTextColor={colors.muted}
            style={styles.searchInput}
            autoCorrect={false}
            data-testid="price-search-input"
          />
          {q ? (
            <Ionicons
              name="close-circle"
              size={18}
              color={colors.muted}
              onPress={() => setQ('')}
              suppressHighlighting
            />
          ) : null}
        </View>

        {filtered.length === 0 ? (
          <View style={styles.empty} data-testid="price-empty">
            <Ionicons name="search-outline" size={22} color={colors.muted} />
            <Text style={styles.emptyText}>Hittade inget för "{q}"</Text>
            <Text style={styles.emptySub}>Prova ett annat sökord eller ring kliniken.</Text>
          </View>
        ) : (
          filtered.map((g) => (
            <View key={g.id} style={{ marginTop: spacing.lg }} data-testid={`group-${g.id}`}>
              <Text style={styles.groupTitle}>{g.title}</Text>
              <Card>
                {g.items.map((i, idx) => (
                  <View
                    key={i.name}
                    style={[styles.row, idx < g.items.length - 1 && styles.rowBorder]}
                  >
                    <Text style={styles.rowName}>{i.name}</Text>
                    <Text style={styles.rowPrice}>{i.price}</Text>
                  </View>
                ))}
              </Card>
            </View>
          ))
        )}

        <Text style={styles.footer}>Priser kan ändras. Ring för aktuell uppgift.</Text>
      </ScrollView>
      <StickyCall />
    </SafeAreaView>
  );
}

function RulesRow({ icon, text, last }) {
  return (
    <View style={[styles.ruleRow, !last && styles.ruleBorder]}>
      <Ionicons name={icon} size={16} color={colors.gold} />
      <Text style={styles.ruleText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  banner: {
    backgroundColor: colors.forest, padding: 14, borderRadius: radius.lg, gap: 4,
  },
  ruleRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, gap: 8 },
  ruleBorder: { borderBottomWidth: 1, borderBottomColor: '#2A4A38' },
  ruleText: { color: colors.cream, fontSize: 13, marginLeft: 8, flex: 1 },
  searchBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.white, borderRadius: radius.pill,
    borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: 14, paddingVertical: 10, marginTop: spacing.md, gap: 8,
  },
  searchInput: { flex: 1, color: colors.ink, fontSize: 15, marginLeft: 8, outlineWidth: 0 },
  groupTitle: {
    fontSize: 12, fontWeight: '800', color: colors.gold,
    letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 8, marginLeft: 4,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, alignItems: 'flex-start', gap: 12 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  rowName: { flex: 1, color: colors.ink, fontSize: 14.5 },
  rowPrice: { color: colors.forest, fontWeight: '800', fontSize: 14, textAlign: 'right' },
  empty: { alignItems: 'center', padding: 24, marginTop: spacing.lg },
  emptyText: { color: colors.forest, fontWeight: '700', marginTop: 8 },
  emptySub: { color: colors.inkSoft, fontSize: 13, marginTop: 4 },
  footer: { color: colors.muted, fontSize: 12, marginTop: spacing.lg, textAlign: 'center' },
});
