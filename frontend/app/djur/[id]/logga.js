import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, Pressable, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, shadow } from '../../../theme';
import { api } from '../../../utils/api';

const TYPES = ['vaccination', 'rabies', 'tandvard', 'halsokoll', 'kastration', 'ultraljud', 'rehab', 'akut', 'annat'];

export default function LoggaBesok() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [type, setType] = useState('vaccination');
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [notes, setNotes] = useState('');
  const [nextDue, setNextDue] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const submit = async () => {
    setError(null);
    if (!date.match(/^\d{4}-\d{2}-\d{2}$/)) { setError('Datum måste vara ÅÅÅÅ-MM-DD'); return; }
    setBusy(true);
    try {
      await api(`/pets/${id}/logs`, {
        method: 'POST',
        body: {
          type, title: cap(type), date,
          notes, nextDueDate: nextDue || null,
        },
      });
      router.replace(`/djur/${id}`);
    } catch (e) {
      setError(e.message || 'Kunde inte spara');
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={{ padding: spacing.md }} keyboardShouldPersistTaps="handled">
        <Text style={styles.hint}>Fyll i vad som gjordes. Om du inte anger nästa gång räknar vi ungefärligt automatiskt (vaccin/tand +12 mån).</Text>

        <Text style={styles.label}>Typ</Text>
        <View style={styles.grid}>
          {TYPES.map((t) => {
            const sel = type === t;
            return (
              <Pressable key={t} onPress={() => setType(t)}
                style={({ pressed }) => [styles.chip, sel && styles.chipSel, pressed && { opacity: 0.9 }]}
                data-testid={`type-${t}`}>
                <Text style={[styles.chipText, sel && { color: colors.cream }]}>{cap(t)}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>Datum</Text>
        <TextInput value={date} onChangeText={setDate} placeholder="ÅÅÅÅ-MM-DD"
          placeholderTextColor={colors.muted} style={styles.input} data-testid="log-date" />

        <Text style={styles.label}>Anteckning</Text>
        <TextInput value={notes} onChangeText={setNotes} placeholder="t.ex. utan komplikationer"
          placeholderTextColor={colors.muted} multiline
          style={[styles.input, { minHeight: 90, textAlignVertical: 'top' }]} data-testid="log-notes" />

        <Text style={styles.label}>Nästa gång (frivilligt)</Text>
        <TextInput value={nextDue} onChangeText={setNextDue} placeholder="ÅÅÅÅ-MM-DD (auto om tomt)"
          placeholderTextColor={colors.muted} style={styles.input} data-testid="log-nextdue" />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable onPress={submit} disabled={busy}
          style={({ pressed }) => [styles.submit, (busy || pressed) && { opacity: 0.9 }]}
          data-testid="submit-log">
          <Ionicons name="save-outline" size={18} color={colors.cream} />
          <Text style={styles.submitText}>{busy ? 'Sparar…' : 'Spara i logg'}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function cap(s) { return s[0].toUpperCase() + s.slice(1); }

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  hint: { color: colors.inkSoft, fontSize: 13, lineHeight: 18 },
  label: { color: colors.forest, fontWeight: '800', fontSize: 13, letterSpacing: 0.3, textTransform: 'uppercase', marginTop: spacing.md, marginBottom: 8 },
  input: {
    backgroundColor: colors.white, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: 14, paddingVertical: Platform.OS === 'ios' ? 14 : 12, color: colors.ink, fontSize: 15,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: radius.pill, borderWidth: 1.5, borderColor: colors.forest },
  chipSel: { backgroundColor: colors.forest },
  chipText: { color: colors.forest, fontWeight: '700', fontSize: 13 },
  submit: {
    marginTop: spacing.lg, backgroundColor: colors.forest, paddingVertical: 16,
    borderRadius: radius.pill, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, ...shadow.strong,
  },
  submitText: { color: colors.cream, fontWeight: '800', fontSize: 15, marginLeft: 6 },
  error: { color: colors.danger, marginTop: 8 },
});
