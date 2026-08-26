import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TextInput, Pressable, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors, spacing, radius, shadow } from '../../../theme';
import { api } from '../../../utils/api';

export default function Redigera() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [pet, setPet] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    api(`/pets/${id}`).then((r) => setPet(r.pet)).catch(() => {});
  }, [id]);

  const save = async () => {
    setBusy(true); setError(null);
    try {
      await api(`/pets/${id}`, { method: 'PATCH', body: {
        name: pet.name, breed: pet.breed, sex: pet.sex,
        birthDate: pet.birthDate, chip: pet.chip, color: pet.color, notes: pet.notes,
      } });
      router.replace(`/djur/${id}`);
    } catch (e) {
      setError(e.message);
    } finally { setBusy(false); }
  };

  const archive = async () => {
    try {
      await api(`/pets/${id}`, { method: 'PATCH', body: { archived: true } });
      router.replace('/djur');
    } catch (e) { setError(e.message); }
  };

  if (!pet) return <SafeAreaView style={styles.safe}><Text style={{ padding: 20 }}>Läser in…</Text></SafeAreaView>;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={{ padding: spacing.md }}>
        <TextInput value={pet.name} onChangeText={(v) => setPet({ ...pet, name: v })} placeholder="Namn" placeholderTextColor={colors.muted} style={styles.input} />
        <TextInput value={pet.breed || ''} onChangeText={(v) => setPet({ ...pet, breed: v })} placeholder="Ras" placeholderTextColor={colors.muted} style={styles.input} />
        <TextInput value={pet.birthDate || ''} onChangeText={(v) => setPet({ ...pet, birthDate: v })} placeholder="Födelsedatum ÅÅÅÅ-MM-DD" placeholderTextColor={colors.muted} style={styles.input} />
        <TextInput value={pet.chip || ''} onChangeText={(v) => setPet({ ...pet, chip: v })} placeholder="Chipnummer" placeholderTextColor={colors.muted} style={styles.input} />
        <TextInput value={pet.color || ''} onChangeText={(v) => setPet({ ...pet, color: v })} placeholder="Färg" placeholderTextColor={colors.muted} style={styles.input} />
        <TextInput value={pet.notes || ''} onChangeText={(v) => setPet({ ...pet, notes: v })} placeholder="Anteckning" placeholderTextColor={colors.muted} multiline style={[styles.input, { minHeight: 80, textAlignVertical: 'top' }]} />
        {error ? <Text style={{ color: colors.danger }}>{error}</Text> : null}
        <Pressable onPress={save} disabled={busy} style={({ pressed }) => [styles.save, pressed && { opacity: 0.9 }]}>
          <Text style={styles.saveText}>{busy ? 'Sparar…' : 'Spara'}</Text>
        </Pressable>
        <Pressable onPress={archive} style={styles.archive}>
          <Text style={styles.archiveText}>Arkivera djur</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  input: { backgroundColor: colors.white, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14, paddingVertical: Platform.OS === 'ios' ? 14 : 12, color: colors.ink, fontSize: 15, marginBottom: 10 },
  save: { backgroundColor: colors.forest, padding: 16, borderRadius: radius.pill, alignItems: 'center', marginTop: 8, ...shadow.strong },
  saveText: { color: colors.cream, fontWeight: '800' },
  archive: { padding: 12, alignItems: 'center', marginTop: 20 },
  archiveText: { color: colors.danger, fontWeight: '700' },
});
