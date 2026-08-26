import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, type, shadow } from '../theme';
import { dentalServices } from '../data/clinic';
import SectionTitle from '../components/SectionTitle';
import Card from '../components/Card';
import StickyCall from '../components/StickyCall';

export default function Tandvard() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: 200 }}>
        <View style={styles.badge} data-testid="dental-badge">
          <Ionicons name="ribbon" size={14} color={colors.gold} />
          <Text style={styles.badgeText}>Vår spetskompetens</Text>
        </View>
        <SectionTitle
          title="Tandvård"
          subtitle="Flera av våra veterinärer har vidareutbildning inom smådjurstandvård. Vi tar även emot häst, men då enbart för tandvård."
          style={{ marginTop: spacing.md }}
        />

        <Card testID="dental-list-card">
          {dentalServices.map((s, i) => (
            <View
              key={s.name}
              style={[
                styles.row,
                i < dentalServices.length - 1 && styles.rowBorder,
              ]}
              data-testid={`dental-row-${i}`}
            >
              <Text style={styles.rowName}>{s.name}</Text>
              <Text style={styles.rowPrice}>{s.price}</Text>
            </View>
          ))}
        </Card>

        <Text style={styles.note}>
          Priserna är riktvärden. Slutpris sätts efter individuell undersökning och röntgen.
        </Text>
        <Text style={styles.note}>
          Bokning sker per telefon.
        </Text>
      </ScrollView>
      <StickyCall />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  badge: {
    flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start',
    backgroundColor: colors.creamAlt, paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: radius.pill, gap: 6,
  },
  badgeText: { color: colors.forest, fontSize: 12, fontWeight: '700', marginLeft: 4, letterSpacing: 0.4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingVertical: 12, gap: 12 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  rowName: { flex: 1, color: colors.ink, fontSize: 15, fontWeight: '600' },
  rowPrice: { color: colors.forest, fontSize: 14, fontWeight: '800', textAlign: 'right' },
  note: { color: colors.inkSoft, fontSize: 13, marginTop: spacing.md, lineHeight: 18 },
});
