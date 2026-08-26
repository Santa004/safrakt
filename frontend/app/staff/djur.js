import React, { useCallback, useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable, TextInput, RefreshControl, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, shadow } from '../../theme';
import { api } from '../../utils/api';
import { petAge } from '../../utils/dates';

const SPECIES_ICONS = { hund: 'paw', katt: 'logo-octocat', kanin: 'egg-outline', hast: 'sparkles-outline', annat: 'help-circle-outline' };

export default function StaffDjur() {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [pets, setPets] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const path = q.trim() ? `/staff/pets?q=${encodeURIComponent(q.trim())}` : '/staff/pets';
      const d = await api(path);
      setPets(d.pets || []);
    } catch (e) {
      // ignore
    } finally { setRefreshing(false); }
  }, [q]);

  useFocusEffect(useCallback(() => { load(); }, [load]));
  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [q, load]);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={{ padding: spacing.md, paddingBottom: 0 }}>
        <View style={styles.search}>
          <Ionicons name="search" size={18} color={colors.muted} />
          <TextInput
            value={q} onChangeText={setQ} placeholder="Sök på djur, chip eller ägare"
            placeholderTextColor={colors.muted} style={styles.input} autoCorrect={false}
            data-testid="staff-search"
          />
        </View>
      </View>
      <ScrollView
        contentContainerStyle={{ padding: spacing.md, paddingBottom: 60 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={colors.forest} />}
      >
        {pets.length === 0 ? (
          <Text style={styles.empty}>Inga djur.</Text>
        ) : pets.map((p) => (
          <Pressable key={p.id} onPress={() => router.push(`/djur/${p.id}`)}
            style={({ pressed }) => [styles.row, pressed && { opacity: 0.9 }]}
            data-testid={`staff-pet-${p.id}`}>
            <View style={styles.icon}><Ionicons name={SPECIES_ICONS[p.species]} size={22} color={colors.forest} /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{p.name}</Text>
              <Text style={styles.sub}>{[p.breed, petAge(p.birthDate)].filter(Boolean).join(' · ')}</Text>
              {p.owner && <Text style={styles.owner}>Ägare: {p.owner.name} · {p.owner.phone}</Text>}
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.muted} />
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  search: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14, paddingVertical: 8, gap: 8 },
  input: { flex: 1, color: colors.ink, fontSize: 15, marginLeft: 8, paddingVertical: Platform.OS === 'ios' ? 6 : 4, outlineWidth: 0 },
  empty: { color: colors.muted, textAlign: 'center', paddingVertical: 40, fontStyle: 'italic' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, marginBottom: 8, ...shadow.card },
  icon: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.sageSoft, alignItems: 'center', justifyContent: 'center' },
  name: { color: colors.forest, fontWeight: '800', fontSize: 15 },
  sub: { color: colors.inkSoft, fontSize: 13, marginTop: 2 },
  owner: { color: colors.gold, fontSize: 12, marginTop: 3, fontWeight: '600' },
});
