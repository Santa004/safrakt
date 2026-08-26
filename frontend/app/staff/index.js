import React, { useCallback, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, shadow } from '../../theme';
import { api } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { formatDateSv } from '../../utils/dates';

export default function StaffHome() {
  const { user } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const d = await api('/staff/bookings');
      setBookings(d.bookings || []);
    } catch (e) {
      // ignored
    } finally { setLoading(false); setRefreshing(false); }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const requested = bookings.filter((b) => b.status === 'requested');
  const confirmed = bookings.filter((b) => b.status === 'confirmed');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={{ padding: spacing.md, paddingBottom: 60 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={colors.forest} />}
      >
        <Text style={styles.eyebrow}>Klinikläge</Text>
        <Text style={styles.title}>Hej {user?.name || 'personal'}</Text>
        <Text style={styles.sub}>Nya förfrågningar och pågående besök.</Text>

        <View style={styles.summary}>
          <StatCard label="Nya förfrågningar" value={requested.length} color={colors.gold} testID="stat-requested" />
          <StatCard label="Bekräftade" value={confirmed.length} color={colors.forest} testID="stat-confirmed" />
        </View>

        <View style={styles.actions}>
          <Pressable onPress={() => router.push('/staff/inbox')} style={({ pressed }) => [styles.card, pressed && { opacity: 0.9 }]} data-testid="to-inbox">
            <Ionicons name="mail-open-outline" size={22} color={colors.forest} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.cardTitle}>Inbox — tidsförfrågningar</Text>
              <Text style={styles.cardSub}>{requested.length} nya · bekräfta, avvisa eller markera genomförd</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.muted} />
          </Pressable>
          <Pressable onPress={() => router.push('/staff/djur')} style={({ pressed }) => [styles.card, pressed && { opacity: 0.9 }]} data-testid="to-staff-pets">
            <Ionicons name="paw-outline" size={22} color={colors.forest} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.cardTitle}>Djur i systemet</Text>
              <Text style={styles.cardSub}>Sök djur på namn, chip eller ägare</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.muted} />
          </Pressable>
        </View>

        {loading && bookings.length === 0 ? (
          <ActivityIndicator style={{ marginTop: 30 }} color={colors.forest} />
        ) : (
          <View style={{ marginTop: spacing.lg }}>
            <Text style={styles.sectionTitle}>Senaste förfrågningar</Text>
            {requested.slice(0, 5).map((b) => (
              <Pressable key={b.id} onPress={() => router.push(`/djur/${b.petId}`)}
                style={({ pressed }) => [styles.bookingRow, pressed && { opacity: 0.9 }]}
                data-testid={`staff-booking-${b.id}`}>
                <View style={styles.dot} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.bookingTitle}>{b.pet?.name} · {b.reason}</Text>
                  <Text style={styles.bookingSub}>{b.owner?.name} · {b.owner?.phone} · {formatDateSv(b.preferredDate)}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.muted} />
              </Pressable>
            ))}
            {requested.length === 0 && <Text style={styles.empty}>Inga nya förfrågningar just nu.</Text>}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ label, value, color, testID }) {
  return (
    <View style={styles.stat} data-testid={testID}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  eyebrow: { color: colors.gold, fontSize: 12, letterSpacing: 1.2, fontWeight: '800', textTransform: 'uppercase' },
  title: { color: colors.forest, fontSize: 26, fontWeight: '800', marginTop: 6 },
  sub: { color: colors.inkSoft, marginTop: 4 },
  summary: { flexDirection: 'row', gap: 10, marginTop: spacing.lg },
  stat: { flex: 1, backgroundColor: colors.white, padding: 16, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, ...shadow.card },
  statValue: { fontSize: 28, fontWeight: '800' },
  statLabel: { color: colors.inkSoft, fontSize: 12, marginTop: 4 },
  actions: { marginTop: spacing.lg, gap: 10 },
  card: { flexDirection: 'row', alignItems: 'center', padding: 14, backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, ...shadow.card },
  cardTitle: { color: colors.forest, fontWeight: '800', fontSize: 15 },
  cardSub: { color: colors.inkSoft, fontSize: 12, marginTop: 2 },
  sectionTitle: { color: colors.gold, fontSize: 12, letterSpacing: 1.2, fontWeight: '800', textTransform: 'uppercase', marginBottom: 8 },
  bookingRow: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 10, backgroundColor: colors.white, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, marginBottom: 8, ...shadow.card },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.gold },
  bookingTitle: { color: colors.forest, fontWeight: '700', fontSize: 14 },
  bookingSub: { color: colors.inkSoft, fontSize: 12, marginTop: 2 },
  empty: { color: colors.muted, fontStyle: 'italic', textAlign: 'center', padding: 20 },
});
