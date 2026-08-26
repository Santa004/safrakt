import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, type } from '../theme';
import { services, dropIn } from '../data/clinic';
import SectionTitle from '../components/SectionTitle';
import Card from '../components/Card';
import StickyCall from '../components/StickyCall';

export default function Tjanster() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: 200 }}>
        <SectionTitle
          eyebrow="Vård för hund, katt & kanin"
          title="Tjänster"
          subtitle="Häst tar vi endast emot för tandvård. Bokning sker per telefon."
        />

        {services.map((s) => (
          <Card
            key={s.id}
            style={{ marginBottom: spacing.md }}
            testID={`service-${s.id}`}
          >
            <View style={styles.cardHeader}>
              <Ionicons name={iconFor(s.id)} size={20} color={colors.forest} />
              <Text style={styles.cardTitle}>{s.title}</Text>
            </View>
            {!!s.body && <Text style={styles.body}>{s.body}</Text>}
            {!!s.prices && (
              <View style={{ marginTop: 10, gap: 4 }}>
                {s.prices.map((p, i) => (
                  <Text key={i} style={styles.price}>· {p}</Text>
                ))}
              </View>
            )}
            {s.id === 'vaccination' && (
              <View style={styles.dropInBox}>
                <Text style={styles.dropInTitle}>Drop-in-regler</Text>
                {dropIn.notes.map((n, i) => (
                  <Text key={i} style={styles.dropInNote}>· {n}</Text>
                ))}
              </View>
            )}
          </Card>
        ))}
      </ScrollView>
      <StickyCall />
    </SafeAreaView>
  );
}

function iconFor(id) {
  const map = {
    vaccination: 'medical-outline',
    halsokontroll: 'heart-outline',
    kastration: 'cut-outline',
    id: 'card-outline',
    rontgen: 'scan-outline',
    ultraljud: 'pulse-outline',
    rehab: 'walk-outline',
    akut: 'alert-circle-outline',
    avlivning: 'flower-outline',
  };
  return map[id] || 'paw-outline';
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  cardTitle: { fontSize: 17, fontWeight: '800', color: colors.forest, marginLeft: 10 },
  body: { color: colors.ink, fontSize: 14, lineHeight: 20, marginTop: 8 },
  price: { color: colors.forestDeep, fontSize: 14, fontWeight: '600' },
  dropInBox: {
    marginTop: 12, backgroundColor: colors.sageSoft, padding: 12, borderRadius: radius.md,
  },
  dropInTitle: { fontWeight: '800', color: colors.forest, marginBottom: 6, fontSize: 13, letterSpacing: 0.3 },
  dropInNote: { color: colors.forestDeep, fontSize: 13, lineHeight: 18 },
});
