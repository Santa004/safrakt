import React, { useCallback, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, shadow } from '../../theme';
import { api } from '../../utils/api';
import { formatDateSv } from '../../utils/dates';

const FILTERS = [
  { id: 'requested', label: 'Nya' },
  { id: 'confirmed', label: 'Bekräftade' },
  { id: 'done', label: 'Genomförda' },
  { id: 'cancelled', label: 'Avbokade' },
];

export default function Inbox() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('requested');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const d = await api('/staff/bookings');
      setItems(d.bookings || []);
    } finally { setLoading(false); setRefreshing(false); }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const patch = async (id, payload) => {
    try {
      await api(`/bookings/${id}`, { method: 'PATCH', body: payload });
      load();
    } catch (e) {
      Alert.alert('Fel', e.message);
    }
  };

  const filtered = items.filter((b) => b.status === status);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.filterRow}>
        {FILTERS.map((f) => {
          const sel = status === f.id;
          const count = items.filter((b) => b.status === f.id).length;
          return (
            <Pressable key={f.id} onPress={() => setStatus(f.id)}
              style={({ pressed }) => [styles.filterBtn, sel && styles.filterSel, pressed && { opacity: 0.9 }]}
              data-testid={`filter-${f.id}`}>
              <Text style={[styles.filterText, sel && { color: colors.cream }]}>{f.label} {count > 0 && `(${count})`}</Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView
        contentContainerStyle={{ padding: spacing.md, paddingBottom: 60 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={colors.forest} />}
      >
        {loading ? (
          <ActivityIndicator color={colors.forest} />
        ) : filtered.length === 0 ? (
          <Text style={styles.empty}>Inget att visa.</Text>
        ) : (
          filtered.map((b) => (
            <View key={b.id} style={styles.card} data-testid={`inbox-item-${b.id}`}>
              <Pressable onPress={() => router.push(`/djur/${b.petId}`)} style={{ flexDirection: 'row', gap: 12 }}>
                <View style={styles.icon}><Ionicons name="paw" size={22} color={colors.forest} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{b.pet?.name} · {b.reason}</Text>
                  <Text style={styles.cardSub}>{b.owner?.name} · {b.owner?.phone}</Text>
                  <Text style={styles.cardMeta}>{formatDateSv(b.preferredDate)} · {b.timeOfDay}</Text>
                  {!!b.message && <Text style={styles.msg}>"{b.message}"</Text>}
                </View>
              </Pressable>
              {b.status === 'requested' && (
                <View style={styles.actions}>
                  <Pressable onPress={() => patch(b.id, { status: 'confirmed', confirmedAt: new Date().toISOString() })}
                    style={({ pressed }) => [styles.primary, pressed && { opacity: 0.9 }]}
                    data-testid={`confirm-${b.id}`}>
                    <Text style={styles.primaryText}>Bekräfta</Text>
                  </Pressable>
                  <Pressable onPress={() => patch(b.id, { status: 'done' })}
                    style={({ pressed }) => [styles.secondary, pressed && { opacity: 0.9 }]}
                    data-testid={`done-${b.id}`}>
                    <Text style={styles.secondaryText}>Genomförd</Text>
                  </Pressable>
                  <Pressable onPress={() => patch(b.id, { status: 'cancelled' })}
                    style={({ pressed }) => [styles.danger, pressed && { opacity: 0.9 }]}
                    data-testid={`cancel-${b.id}`}>
                    <Text style={styles.dangerText}>Avvisa</Text>
                  </Pressable>
                </View>
              )}
              {b.status === 'confirmed' && (
                <View style={styles.actions}>
                  <Pressable onPress={() => patch(b.id, { status: 'done' })}
                    style={({ pressed }) => [styles.primary, pressed && { opacity: 0.9 }]}>
                    <Text style={styles.primaryText}>Markera genomförd</Text>
                  </Pressable>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  filterRow: { flexDirection: 'row', gap: 6, padding: spacing.md, paddingBottom: 0, flexWrap: 'wrap' },
  filterBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: radius.pill, borderWidth: 1.5, borderColor: colors.forest },
  filterSel: { backgroundColor: colors.forest },
  filterText: { color: colors.forest, fontWeight: '700', fontSize: 12 },
  empty: { color: colors.muted, textAlign: 'center', paddingVertical: 40, fontStyle: 'italic' },
  card: { backgroundColor: colors.white, padding: 14, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, marginBottom: 10, ...shadow.card, gap: 12 },
  icon: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.sageSoft, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { color: colors.forest, fontWeight: '800', fontSize: 15 },
  cardSub: { color: colors.inkSoft, fontSize: 13, marginTop: 2 },
  cardMeta: { color: colors.muted, fontSize: 12, marginTop: 4 },
  msg: { color: colors.forestDeep, fontStyle: 'italic', fontSize: 13, marginTop: 6 },
  actions: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  primary: { backgroundColor: colors.forest, paddingHorizontal: 14, paddingVertical: 10, borderRadius: radius.pill },
  primaryText: { color: colors.cream, fontWeight: '700', fontSize: 12 },
  secondary: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: radius.pill, borderWidth: 1.5, borderColor: colors.forest },
  secondaryText: { color: colors.forest, fontWeight: '700', fontSize: 12 },
  danger: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: radius.pill, borderWidth: 1.5, borderColor: colors.danger },
  dangerText: { color: colors.danger, fontWeight: '700', fontSize: 12 },
});
