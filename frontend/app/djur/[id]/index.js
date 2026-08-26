import React, { useCallback, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, useFocusEffect, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, shadow } from '../../../theme';
import { api } from '../../../utils/api';
import { petAge, relativeSwedish, formatDateSv } from '../../../utils/dates';
import { useAuth } from '../../../context/AuthContext';
import Card from '../../../components/Card';

const SPECIES_ICONS = {
  hund: 'paw', katt: 'logo-octocat', kanin: 'egg-outline',
  hast: 'sparkles-outline', annat: 'help-circle-outline',
};
const SPECIES_LABEL = { hund: 'Hund', katt: 'Katt', kanin: 'Kanin', hast: 'Häst', annat: 'Annat' };
const SEX_LABEL = { hane: 'Hane', hona: 'Hona', okant: 'Okänt' };
const TIME_LABEL = { formiddag: 'Förmiddag', eftermiddag: 'Eftermiddag', kvall: 'Kväll' };

export default function PetProfile() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();
  const { user } = useAuth();
  const [pet, setPet] = useState(null);
  const [owner, setOwner] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const [petRes, bRes, lRes] = await Promise.all([
        api(`/pets/${id}`),
        api(`/pets/${id}/bookings`),
        api(`/pets/${id}/logs`),
      ]);
      setPet(petRes.pet);
      setOwner(petRes.owner);
      setBookings(bRes.bookings || []);
      setLogs(lRes.logs || []);
      navigation.setOptions({ title: petRes.pet.name });
    } catch (e) {
      // handle error
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id, navigation]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const cancelBooking = async (b) => {
    try {
      await api(`/bookings/${b.id}`, { method: 'PATCH', body: { status: 'cancelled' } });
      load();
    } catch (e) {
      Alert.alert('Fel', e.message || 'Kunde inte avboka');
    }
  };

  const markDone = async (b) => {
    try {
      await api(`/bookings/${b.id}`, { method: 'PATCH', body: { status: 'done' } });
      load();
    } catch (e) {
      Alert.alert('Fel', e.message || 'Kunde inte markera');
    }
  };

  const confirmBooking = async (b) => {
    try {
      await api(`/bookings/${b.id}`, { method: 'PATCH', body: { status: 'confirmed', confirmedAt: new Date().toISOString() } });
      load();
    } catch (e) {
      Alert.alert('Fel', e.message);
    }
  };

  if (loading || !pet) {
    return <SafeAreaView style={styles.safe}><ActivityIndicator style={{ marginTop: 40 }} color={colors.forest} /></SafeAreaView>;
  }

  const upcomingLog = getUpcomingLog(logs);
  const activeBooking = bookings.find((b) => b.status === 'requested' || b.status === 'confirmed');
  const isStaff = user?.role === 'staff';

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={{ padding: spacing.md, paddingBottom: 60 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={colors.forest} />}
      >
        {/* Header */}
        <View style={styles.header} data-testid="pet-header">
          <View style={styles.petIcon}>
            <Ionicons name={SPECIES_ICONS[pet.species]} size={38} color={colors.forest} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.petName}>{pet.name}</Text>
            <Text style={styles.petMeta}>
              {[SPECIES_LABEL[pet.species], pet.breed, petAge(pet.birthDate)].filter(Boolean).join(' · ')}
            </Text>
            <Text style={styles.petSub}>{[SEX_LABEL[pet.sex], pet.chip ? `Chip ${pet.chip}` : null, pet.color].filter(Boolean).join(' · ')}</Text>
            {isStaff && owner && (
              <View style={styles.ownerRow}>
                <Ionicons name="person-outline" size={13} color={colors.gold} />
                <Text style={styles.ownerText}>{owner.name} · {owner.phone}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Next-up cards */}
        {(upcomingLog || activeBooking) && (
          <View style={{ marginTop: spacing.md, gap: 10 }}>
            {upcomingLog && <NextDueCard log={upcomingLog} />}
            {activeBooking && (
              <BookingCard
                b={activeBooking} isStaff={isStaff}
                onCancel={() => cancelBooking(activeBooking)}
                onConfirm={() => confirmBooking(activeBooking)}
                onDone={() => markDone(activeBooking)}
              />
            )}
          </View>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          <Pressable onPress={() => router.push(`/djur/${pet.id}/boka`)}
            style={({ pressed }) => [styles.primary, pressed && { opacity: 0.9 }]}
            data-testid="be-om-tid-btn">
            <Ionicons name="calendar-outline" size={18} color={colors.cream} />
            <Text style={styles.primaryText}>Be om tid</Text>
          </Pressable>
          <Pressable onPress={() => router.push(`/djur/${pet.id}/logga`)}
            style={({ pressed }) => [styles.outline, pressed && { opacity: 0.9 }]}
            data-testid="logga-besok-btn">
            <Ionicons name="add-circle-outline" size={18} color={colors.forest} />
            <Text style={styles.outlineText}>Logga besök</Text>
          </Pressable>
        </View>

        {/* Kommande */}
        {bookings.filter((b) => b.status === 'requested' || b.status === 'confirmed').length > 0 && (
          <Section title="Kommande">
            {bookings.filter((b) => b.status === 'requested' || b.status === 'confirmed').map((b) => (
              <BookingCard
                key={b.id} b={b} isStaff={isStaff}
                onCancel={() => cancelBooking(b)}
                onConfirm={() => confirmBooking(b)}
                onDone={() => markDone(b)}
              />
            ))}
          </Section>
        )}

        {/* Logg */}
        <Section title="Logg / journal">
          {logs.length === 0 ? (
            <Text style={styles.emptyText}>Ingen historik ännu.</Text>
          ) : (
            <View style={styles.timeline}>
              {logs.map((l, i) => (
                <LogRow key={l.id} log={l} last={i === logs.length - 1} />
              ))}
            </View>
          )}
        </Section>

        <Text style={styles.disclaimer}>Detta är din djurlogg i appen. Klinikens journal är separat.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function getUpcomingLog(logs) {
  const withDue = logs.filter((l) => l.nextDueDate);
  if (!withDue.length) return null;
  withDue.sort((a, b) => (a.nextDueDate < b.nextDueDate ? -1 : 1));
  return withDue[0];
}

function NextDueCard({ log }) {
  const rel = relativeSwedish(log.nextDueDate);
  const overdue = rel?.overdue;
  const bg = overdue ? '#F7E4E0' : colors.sageSoft;
  const tint = overdue ? colors.danger : colors.forest;
  return (
    <View style={[styles.nextCard, { backgroundColor: bg }]} data-testid="next-due-card">
      <Ionicons name={overdue ? 'alert-circle' : 'time-outline'} size={22} color={tint} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.nextTitle, { color: tint }]}>
          {overdue ? `${cap(log.type)} förfallen för ${rel.text.replace('förfallen för ', '').replace(' sedan', '')} sedan`
                   : `${rel.text.replace(/^om /, '')} till nästa ${cap(log.type).toLowerCase()}`}
        </Text>
        <Text style={styles.nextSub}>Datum: {formatDateSv(log.nextDueDate)}</Text>
      </View>
    </View>
  );
}

function BookingCard({ b, isStaff, onCancel, onConfirm, onDone }) {
  return (
    <View style={styles.bookingCard} data-testid={`booking-${b.id}`}>
      <View style={{ flex: 1 }}>
        <Text style={styles.bookingTitle}>
          {b.reason}
          <Text style={{ color: colors.muted, fontWeight: '500' }}>
            {'  '}· {b.status === 'confirmed' ? 'bekräftad' : b.status === 'done' ? 'genomförd' : b.status === 'cancelled' ? 'avbokad' : 'önskad'}
          </Text>
        </Text>
        <Text style={styles.bookingSub}>{formatDateSv(b.preferredDate)} · {TIME_LABEL[b.timeOfDay] || b.timeOfDay}</Text>
        {!!b.message && <Text style={styles.bookingNote}>"{b.message}"</Text>}
      </View>
      <View style={{ gap: 6 }}>
        {b.status === 'requested' && !isStaff && (
          <Pressable onPress={onCancel} style={({ pressed }) => [styles.smallBtn, pressed && { opacity: 0.85 }]} data-testid="cancel-btn">
            <Text style={styles.smallBtnText}>Avboka</Text>
          </Pressable>
        )}
        {isStaff && b.status === 'requested' && (
          <>
            <Pressable onPress={onConfirm} style={({ pressed }) => [styles.smallBtnPrimary, pressed && { opacity: 0.85 }]}>
              <Text style={styles.smallBtnPrimaryText}>Bekräfta</Text>
            </Pressable>
            <Pressable onPress={onDone} style={({ pressed }) => [styles.smallBtn, pressed && { opacity: 0.85 }]}>
              <Text style={styles.smallBtnText}>Genomförd</Text>
            </Pressable>
          </>
        )}
        {isStaff && b.status === 'confirmed' && (
          <Pressable onPress={onDone} style={({ pressed }) => [styles.smallBtnPrimary, pressed && { opacity: 0.85 }]}>
            <Text style={styles.smallBtnPrimaryText}>Genomförd</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

function LogRow({ log, last }) {
  const source = log.source === 'owner' ? 'du' : log.source === 'staff' ? 'kliniken' : 'system';
  const isSystem = log.type === 'system';
  return (
    <View style={styles.logRow} data-testid={`log-${log.id}`}>
      <View style={styles.logDot}>
        <Ionicons name={isSystem ? 'time' : 'checkmark-circle'} size={12} color={colors.cream} />
      </View>
      {!last && <View style={styles.logLine} />}
      <View style={{ flex: 1, paddingBottom: 14, paddingLeft: 12 }}>
        <Text style={styles.logDate}>{formatDateSv(log.date)} · {source}</Text>
        <Text style={styles.logTitle}>{log.title}</Text>
        {!!log.notes && <Text style={styles.logNotes}>{log.notes}</Text>}
        {!!log.nextDueDate && (
          <Text style={styles.logDue}>Nästa: {formatDateSv(log.nextDueDate)}</Text>
        )}
      </View>
    </View>
  );
}

function Section({ title, children }) {
  return (
    <View style={{ marginTop: spacing.lg }}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function cap(s) { return s ? s[0].toUpperCase() + s.slice(1) : ''; }

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, marginTop: spacing.xs },
  petIcon: {
    width: 72, height: 72, borderRadius: 20, backgroundColor: colors.sageSoft,
    alignItems: 'center', justifyContent: 'center',
  },
  petName: { color: colors.forest, fontSize: 28, fontWeight: '800' },
  petMeta: { color: colors.inkSoft, fontSize: 14, marginTop: 2 },
  petSub: { color: colors.muted, fontSize: 12, marginTop: 4 },
  ownerRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 6 },
  ownerText: { color: colors.gold, fontSize: 12, fontWeight: '700' },
  nextCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: radius.lg,
  },
  nextTitle: { fontSize: 15, fontWeight: '800' },
  nextSub: { color: colors.inkSoft, fontSize: 12, marginTop: 2 },
  actions: { flexDirection: 'row', gap: 10, marginTop: spacing.md },
  primary: {
    flex: 1, backgroundColor: colors.forest, paddingVertical: 14, borderRadius: radius.pill,
    alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, ...shadow.strong,
  },
  primaryText: { color: colors.cream, fontWeight: '800', marginLeft: 6 },
  outline: {
    flex: 1, paddingVertical: 14, borderRadius: radius.pill, borderWidth: 1.5, borderColor: colors.forest,
    alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8,
  },
  outlineText: { color: colors.forest, fontWeight: '800', marginLeft: 6 },
  sectionTitle: {
    color: colors.gold, fontSize: 12, letterSpacing: 1.2, fontWeight: '800',
    textTransform: 'uppercase', marginBottom: 10, marginLeft: 4,
  },
  bookingCard: {
    flexDirection: 'row', backgroundColor: colors.white, padding: 14,
    borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, gap: 10,
    ...shadow.card, marginBottom: 8,
  },
  bookingTitle: { color: colors.forest, fontWeight: '800', fontSize: 15 },
  bookingSub: { color: colors.inkSoft, fontSize: 13, marginTop: 2 },
  bookingNote: { color: colors.muted, fontSize: 12, fontStyle: 'italic', marginTop: 4 },
  smallBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.forest },
  smallBtnText: { color: colors.forest, fontWeight: '700', fontSize: 12 },
  smallBtnPrimary: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: radius.pill, backgroundColor: colors.forest },
  smallBtnPrimaryText: { color: colors.cream, fontWeight: '700', fontSize: 12 },
  emptyText: { color: colors.muted, fontStyle: 'italic', marginLeft: 4 },
  timeline: { backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 14, ...shadow.card },
  logRow: { flexDirection: 'row', position: 'relative' },
  logDot: {
    width: 22, height: 22, borderRadius: 11, backgroundColor: colors.forest,
    alignItems: 'center', justifyContent: 'center', zIndex: 1,
  },
  logLine: { position: 'absolute', left: 10, top: 22, bottom: 0, width: 2, backgroundColor: colors.border },
  logDate: { color: colors.muted, fontSize: 11, letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: '700' },
  logTitle: { color: colors.forest, fontWeight: '700', fontSize: 14, marginTop: 2 },
  logNotes: { color: colors.inkSoft, fontSize: 13, marginTop: 2, lineHeight: 18 },
  logDue: { color: colors.gold, fontSize: 12, marginTop: 4, fontWeight: '700' },
  disclaimer: { color: colors.muted, fontSize: 11, marginTop: spacing.lg, textAlign: 'center', fontStyle: 'italic' },
});
