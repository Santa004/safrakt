import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, Pressable, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, shadow } from '../../../theme';
import { api } from '../../../utils/api';
import CallButton from '../../../components/CallButton';

const REASONS = ['Vaccination', 'Rabies', 'Tandvård', 'Hälsokoll', 'Kastration', 'Akut', 'Ultraljud', 'Rehab', 'Annat'];
const TIMES = [
  { id: 'formiddag', label: 'Förmiddag' },
  { id: 'eftermiddag', label: 'Eftermiddag' },
  { id: 'kvall', label: 'Kväll (mån/tis/tor)' },
];

export default function BokaPet() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [reason, setReason] = useState('Vaccination');
  const [date, setDate] = useState('');
  const [timeOfDay, setTimeOfDay] = useState('formiddag');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  const submit = async () => {
    setError(null);
    if (!date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      setError('Ange datum som ÅÅÅÅ-MM-DD, t.ex. 2026-09-10');
      return;
    }
    setBusy(true);
    try {
      await api(`/pets/${id}/bookings`, {
        method: 'POST',
        body: { reason, preferredDate: date, timeOfDay, message },
      });
      setDone(true);
      setTimeout(() => router.replace(`/djur/${id}`), 1200);
    } catch (e) {
      setError(e.message || 'Kunde inte skicka förfrågan');
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.doneWrap} data-testid="booking-done">
          <View style={styles.doneIcon}><Ionicons name="checkmark" size={40} color={colors.cream} /></View>
          <Text style={styles.doneTitle}>Förfrågan mottagen</Text>
          <Text style={styles.doneSub}>Vi ringer och låser tiden.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={{ padding: spacing.md }} keyboardShouldPersistTaps="handled">
        <Text style={styles.hint}>Kliniken har ingen webbaserad kalender — det här är en förfrågan som personalen ringer tillbaka på.</Text>

        <Text style={styles.label}>Anledning</Text>
        <View style={styles.reasonGrid}>
          {REASONS.map((r) => {
            const sel = reason === r;
            return (
              <Pressable key={r} onPress={() => setReason(r)}
                style={({ pressed }) => [styles.reasonBtn, sel && styles.reasonSel, pressed && { opacity: 0.9 }]}
                data-testid={`reason-${r.toLowerCase()}`}>
                <Text style={[styles.reasonText, sel && { color: colors.cream }]}>{r}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>Önskat datum</Text>
        <TextInput
          value={date} onChangeText={setDate}
          placeholder="ÅÅÅÅ-MM-DD" placeholderTextColor={colors.muted}
          style={styles.input} data-testid="date-input"
        />

        <Text style={styles.label}>Tid på dagen</Text>
        <View style={{ gap: 8 }}>
          {TIMES.map((t) => {
            const sel = timeOfDay === t.id;
            return (
              <Pressable key={t.id} onPress={() => setTimeOfDay(t.id)}
                style={({ pressed }) => [styles.timeBtn, sel && styles.timeSel, pressed && { opacity: 0.9 }]}
                data-testid={`time-${t.id}`}>
                <Ionicons name={sel ? 'radio-button-on' : 'radio-button-off'} size={18} color={sel ? colors.cream : colors.forest} />
                <Text style={[styles.timeText, sel && { color: colors.cream }]}>{t.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>Meddelande (frivilligt)</Text>
        <TextInput
          value={message} onChangeText={setMessage}
          placeholder="t.ex. dålig andedräkt sedan några veckor"
          placeholderTextColor={colors.muted}
          multiline style={[styles.input, { minHeight: 90, textAlignVertical: 'top' }]}
          data-testid="message-input"
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable onPress={submit} disabled={busy}
          style={({ pressed }) => [styles.submit, (busy || pressed) && { opacity: 0.9 }]}
          data-testid="submit-booking">
          <Text style={styles.submitText}>{busy ? 'Skickar…' : 'Skicka förfrågan'}</Text>
        </Pressable>

        <Text style={styles.emergency}>Akut? Ring 0142-66 19 80.</Text>

        <View style={{ marginTop: spacing.md }}>
          <CallButton variant="secondary" size="sm" label="Ring kliniken direkt" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  hint: { color: colors.inkSoft, fontSize: 13, marginBottom: spacing.md, lineHeight: 18 },
  label: { color: colors.forest, fontWeight: '800', fontSize: 13, letterSpacing: 0.3, textTransform: 'uppercase', marginTop: spacing.md, marginBottom: 8 },
  input: {
    backgroundColor: colors.white, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: 14, paddingVertical: Platform.OS === 'ios' ? 14 : 12, color: colors.ink, fontSize: 15,
  },
  reasonGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  reasonBtn: {
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: radius.pill,
    borderWidth: 1.5, borderColor: colors.forest, backgroundColor: colors.white,
  },
  reasonSel: { backgroundColor: colors.forest },
  reasonText: { color: colors.forest, fontWeight: '700', fontSize: 13 },
  timeBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14,
    borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.forest, backgroundColor: colors.white,
  },
  timeSel: { backgroundColor: colors.forest },
  timeText: { color: colors.forest, fontWeight: '700', marginLeft: 6 },
  submit: {
    marginTop: spacing.lg, backgroundColor: colors.forest, paddingVertical: 16,
    borderRadius: radius.pill, alignItems: 'center', ...shadow.strong,
  },
  submitText: { color: colors.cream, fontWeight: '800', fontSize: 15 },
  emergency: { color: colors.gold, fontSize: 12, fontWeight: '700', textAlign: 'center', marginTop: 12 },
  error: { color: colors.danger, marginTop: 8 },
  doneWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: 12 },
  doneIcon: {
    width: 84, height: 84, borderRadius: 42, backgroundColor: colors.forest,
    alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  doneTitle: { color: colors.forest, fontSize: 20, fontWeight: '800' },
  doneSub: { color: colors.inkSoft, fontSize: 14, textAlign: 'center' },
});
