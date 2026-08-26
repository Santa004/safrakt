import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, shadow } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import { petAge, relativeSwedish } from '../../utils/dates';
import SectionTitle from '../../components/SectionTitle';

const SPECIES_ICONS = {
  hund: 'paw',
  katt: 'logo-octocat',
  kanin: 'egg-outline',
  hast: 'sparkles-outline',
  annat: 'help-circle-outline',
};

const SPECIES_LABEL = {
  hund: 'Hund', katt: 'Katt', kanin: 'Kanin', hast: 'Häst', annat: 'Annat',
};

export default function DjurIndex() {
  const router = useRouter();
  const { user, ready } = useAuth();
  const [pets, setPets] = useState([]);
  const [bookingsByPet, setBookingsByPet] = useState({});
  const [logsByPet, setLogsByPet] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    if (user.role === 'staff') { router.replace('/staff'); return; }
    try {
      const data = await api('/pets');
      setPets(data.pets || []);
      const bmap = {}, lmap = {};
      for (const p of data.pets || []) {
        const [b, l] = await Promise.all([
          api(`/pets/${p.id}/bookings`).catch(() => ({ bookings: [] })),
          api(`/pets/${p.id}/logs`).catch(() => ({ logs: [] })),
        ]);
        bmap[p.id] = b.bookings || [];
        lmap[p.id] = l.logs || [];
      }
      setBookingsByPet(bmap);
      setLogsByPet(lmap);
    } catch (e) {
      // fail silently, keep list empty
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user, router]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  if (!ready) {
    return (
      <SafeAreaView style={styles.safe}><ActivityIndicator style={{ marginTop: 40 }} color={colors.forest} /></SafeAreaView>
    );
  }

  if (!user) {
    return <LoggedOutEmpty router={router} />;
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={{ padding: spacing.md, paddingBottom: 120 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={colors.forest} />}
      >
        <SectionTitle eyebrow={`Hej ${user.name.split(' ')[0]}`} title="Mina djur" subtitle="Ditt garage. Välj ett djur för att se logg, nästa vaccination och boka tid." />

        {loading && pets.length === 0 ? (
          <ActivityIndicator color={colors.forest} style={{ marginTop: 30 }} />
        ) : pets.length === 0 ? (
          <EmptyGarage router={router} />
        ) : (
          <View style={{ gap: 12 }}>
            {pets.map((p) => {
              const upcoming = getUpcomingLog(logsByPet[p.id] || []);
              const nextBooking = (bookingsByPet[p.id] || []).find((b) => b.status === 'requested' || b.status === 'confirmed');
              return (
                <PetCard key={p.id} pet={p} upcoming={upcoming} booking={nextBooking} onPress={() => router.push(`/djur/${p.id}`)} />
              );
            })}
          </View>
        )}

        <Pressable
          onPress={() => router.push('/djur/lagg-till')}
          style={({ pressed }) => [styles.addBtn, pressed && { opacity: 0.9 }]}
          data-testid="add-pet-btn"
        >
          <Ionicons name="add-circle-outline" size={22} color={colors.forest} />
          <Text style={styles.addText}>Lägg till djur</Text>
        </Pressable>
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

function PetCard({ pet, upcoming, booking, onPress }) {
  const rel = upcoming ? relativeSwedish(upcoming.nextDueDate) : null;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.petCard, pressed && { transform: [{ scale: 0.99 }] }]}
      data-testid={`pet-card-${pet.id}`}
    >
      <View style={styles.petIcon}>
        <Ionicons name={SPECIES_ICONS[pet.species] || 'paw'} size={26} color={colors.forest} />
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
          <Text style={styles.petName}>{pet.name}</Text>
          <Text style={styles.petMeta}> · {SPECIES_LABEL[pet.species]}</Text>
        </View>
        <Text style={styles.petSub}>
          {[pet.breed, petAge(pet.birthDate)].filter(Boolean).join(' · ')}
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
          {upcoming && (
            <StatusChip
              tint={rel?.overdue ? colors.danger : colors.forest}
              bg={rel?.overdue ? '#F7E4E0' : colors.sageSoft}
              text={rel?.overdue
                ? `${capitalize(upcoming.type)} förfallen`
                : `${capitalize(upcoming.type)} ${rel?.text}`}
            />
          )}
          {booking && (
            <StatusChip
              tint={colors.gold}
              bg={colors.creamAlt}
              text={booking.status === 'confirmed' ? 'Tid bekräftad' : 'Tid önskad'}
            />
          )}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={22} color={colors.muted} />
    </Pressable>
  );
}

function capitalize(s) {
  if (!s) return '';
  return s[0].toUpperCase() + s.slice(1);
}

function StatusChip({ text, tint, bg }) {
  return (
    <View style={{ backgroundColor: bg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill }}>
      <Text style={{ color: tint, fontSize: 11, fontWeight: '800', letterSpacing: 0.2 }}>{text}</Text>
    </View>
  );
}

function EmptyGarage({ router }) {
  return (
    <View style={styles.empty} data-testid="djur-empty">
      <View style={styles.emptyIcon}>
        <Ionicons name="paw" size={40} color={colors.forest} />
      </View>
      <Text style={styles.emptyTitle}>Inga djur ännu</Text>
      <Text style={styles.emptyBody}>Lägg till din hund, katt, kanin eller häst — precis som ett fordon i en garage-app.</Text>
    </View>
  );
}

function LoggedOutEmpty({ router }) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: 120 }}>
        <SectionTitle eyebrow="Ditt garage för djur" title="Mina djur" subtitle="Skapa ett konto för att spara dina djur, se nästa vaccination och önska tid." />
        <View style={styles.empty} data-testid="djur-loggedout">
          <View style={styles.emptyIcon}><Ionicons name="paw" size={40} color={colors.forest} /></View>
          <Text style={styles.emptyTitle}>Logga in för att lägga in dina djur</Text>
          <Text style={styles.emptyBody}>Dina djur, deras logg och kommande tider samlas här.</Text>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: spacing.lg }}>
            <Pressable onPress={() => router.push('/auth/logga-in')} style={({ pressed }) => [styles.primaryBtn, pressed && { opacity: 0.9 }]} data-testid="to-login">
              <Text style={styles.primaryBtnText}>Logga in</Text>
            </Pressable>
            <Pressable onPress={() => router.push('/auth/skapa-konto')} style={({ pressed }) => [styles.outlineBtn, pressed && { opacity: 0.9 }]} data-testid="to-signup">
              <Text style={styles.outlineBtnText}>Skapa konto</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  petCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.white, borderRadius: radius.lg, padding: 14,
    borderWidth: 1, borderColor: colors.border, ...shadow.card, gap: 12,
  },
  petIcon: {
    width: 52, height: 52, borderRadius: 16, backgroundColor: colors.sageSoft,
    alignItems: 'center', justifyContent: 'center',
  },
  petName: { fontSize: 18, fontWeight: '800', color: colors.forest },
  petMeta: { color: colors.inkSoft, fontSize: 13 },
  petSub: { color: colors.inkSoft, fontSize: 12, marginTop: 2 },
  addBtn: {
    marginTop: spacing.md, flexDirection: 'row', gap: 10, justifyContent: 'center', alignItems: 'center',
    padding: 18, borderRadius: radius.lg, borderWidth: 2, borderColor: colors.forest,
    borderStyle: 'dashed', backgroundColor: 'transparent',
  },
  addText: { color: colors.forest, fontWeight: '800', fontSize: 15, marginLeft: 8 },
  empty: { alignItems: 'center', paddingVertical: spacing.xl, gap: 10 },
  emptyIcon: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: colors.sageSoft,
    alignItems: 'center', justifyContent: 'center', marginBottom: 6,
  },
  emptyTitle: { color: colors.forest, fontSize: 18, fontWeight: '800', textAlign: 'center' },
  emptyBody: { color: colors.inkSoft, textAlign: 'center', maxWidth: 320, lineHeight: 20 },
  primaryBtn: { backgroundColor: colors.forest, paddingVertical: 14, paddingHorizontal: 22, borderRadius: radius.pill, ...shadow.strong },
  primaryBtnText: { color: colors.cream, fontWeight: '800' },
  outlineBtn: { paddingVertical: 14, paddingHorizontal: 22, borderRadius: radius.pill, borderWidth: 1.5, borderColor: colors.forest },
  outlineBtnText: { color: colors.forest, fontWeight: '800' },
});
