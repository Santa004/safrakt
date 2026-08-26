import React from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, shadow } from '../../theme';
import { clinic, locationText, hours, hoursOrder } from '../../data/clinic';
import { formatDayHours } from '../../data/hours';
import { openMaps } from '../../utils/actions';
import Card from '../../components/Card';

export default function HittaHit() {
  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: 60 }}>
        <Card>
          <Text style={styles.h3}>Adress</Text>
          <Text style={styles.body}>{clinic.address.street}</Text>
          <Text style={styles.body}>{clinic.address.zip} {clinic.address.city}</Text>
          <Text style={[styles.body, { marginTop: 8, color: colors.inkSoft }]}>{locationText.parking}</Text>

          <Pressable
            onPress={openMaps}
            style={({ pressed }) => [styles.mapBtn, pressed && { opacity: 0.9 }]}
            data-testid="open-maps-btn"
          >
            <Ionicons name="navigate" size={18} color={colors.cream} />
            <Text style={styles.mapText}>Öppna i kartor</Text>
          </Pressable>
        </Card>

        <Card style={{ marginTop: spacing.md }} accent={colors.sage}>
          <Text style={styles.h3}>Så tar du dig hit</Text>
          <Row icon="car-outline" text={locationText.from_mjolby} />
          <Row icon="car-outline" text={locationText.from_linkoping} />
          <Row icon="location-outline" text={locationText.near} last />
        </Card>

        <Card style={{ marginTop: spacing.md }}>
          <Text style={styles.h3}>Öppettider</Text>
          {hoursOrder.map((k, i) => (
            <View key={k} style={[styles.hourRow, i < hoursOrder.length - 1 && styles.hourBorder]}>
              <Text style={styles.hourDay}>{hours[k].label}</Text>
              <Text style={styles.hourTime}>{formatDayHours(hours[k])}</Text>
            </View>
          ))}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ icon, text, last }) {
  return (
    <View style={[styles.row, !last && styles.rowBorder]}>
      <Ionicons name={icon} size={16} color={colors.forest} />
      <Text style={styles.rowText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  h3: { color: colors.forest, fontSize: 17, fontWeight: '800', marginBottom: 8 },
  body: { color: colors.ink, fontSize: 15, lineHeight: 22 },
  mapBtn: {
    marginTop: 14, backgroundColor: colors.forest, paddingVertical: 14,
    borderRadius: radius.pill, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8,
  },
  mapText: { color: colors.cream, fontWeight: '800', marginLeft: 8 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 10 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  rowText: { color: colors.ink, fontSize: 14, marginLeft: 8 },
  hourRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
  hourBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  hourDay: { color: colors.ink, fontSize: 15, fontWeight: '600' },
  hourTime: { color: colors.inkSoft, fontSize: 15 },
});
