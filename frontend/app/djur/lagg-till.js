import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, Pressable, StyleSheet, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, shadow } from '../../theme';
import { api } from '../../utils/api';
import { pickPetPhoto } from '../../utils/photo';

const SPECIES = [
  { id: 'hund', label: 'Hund', icon: 'paw' },
  { id: 'katt', label: 'Katt', icon: 'logo-octocat' },
  { id: 'kanin', label: 'Kanin', icon: 'egg-outline' },
  { id: 'hast', label: 'Häst', icon: 'sparkles-outline' },
  { id: 'annat', label: 'Annat', icon: 'help-circle-outline' },
];

const SEX = [
  { id: 'hane', label: 'Hane' },
  { id: 'hona', label: 'Hona' },
  { id: 'okant', label: 'Okänt' },
];

export default function LaggTill() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [pet, setPet] = useState({
    species: null, name: '', breed: '', birthDate: '',
    sex: 'okant', chip: '', color: '', notes: '',
  });

  const set = (k, v) => setPet((p) => ({ ...p, [k]: v }));

  const canNext = () => {
    if (step === 0) return !!pet.species;
    if (step === 1) return pet.name.trim().length > 0;
    return true;
  };

  const next = () => {
    if (!canNext()) return;
    setStep((s) => Math.min(6, s + 1));
  };
  const back = () => {
    if (step === 0) { router.back(); return; }
    setStep((s) => s - 1);
  };

  const submit = async () => {
    setBusy(true); setError(null);
    try {
      const payload = { ...pet };
      if (!payload.birthDate) delete payload.birthDate;
      const data = await api('/pets', { method: 'POST', body: payload });
      router.replace(`/djur/${data.pet.id}`);
    } catch (e) {
      setError(e.message || 'Kunde inte spara');
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: 60 }} keyboardShouldPersistTaps="handled">
        <StepBar step={step} />

        {step === 0 && (
          <View>
            <Text style={styles.q}>Vilket djur vill du lägga till?</Text>
            <View style={styles.grid}>
              {SPECIES.map((s) => {
                const sel = pet.species === s.id;
                return (
                  <Pressable
                    key={s.id}
                    onPress={() => { set('species', s.id); }}
                    style={({ pressed }) => [styles.speciesCard, sel && styles.speciesSel, pressed && { opacity: 0.9 }]}
                    data-testid={`species-${s.id}`}
                  >
                    <Ionicons name={s.icon} size={30} color={sel ? colors.cream : colors.forest} />
                    <Text style={[styles.speciesLabel, sel && { color: colors.cream }]}>{s.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {step === 1 && (
          <Field q="Vad heter djuret?" testID="pet-name">
            <TextInput value={pet.name} onChangeText={(v) => set('name', v)} placeholder="Namn"
              placeholderTextColor={colors.muted} style={styles.input} autoFocus data-testid="input-name" />
          </Field>
        )}

        {step === 2 && (
          <Field q="Ras (frivilligt)" testID="pet-breed">
            <TextInput value={pet.breed} onChangeText={(v) => set('breed', v)} placeholder="t.ex. Labrador"
              placeholderTextColor={colors.muted} style={styles.input} data-testid="input-breed" />
          </Field>
        )}

        {step === 3 && (
          <Field q="Födelsedatum (frivilligt)" hint="Format ÅÅÅÅ-MM-DD">
            <TextInput value={pet.birthDate} onChangeText={(v) => set('birthDate', v)} placeholder="2022-03-10"
              placeholderTextColor={colors.muted} style={styles.input} data-testid="input-birth" />
          </Field>
        )}

        {step === 4 && (
          <View>
            <Text style={styles.q}>Kön</Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {SEX.map((s) => {
                const sel = pet.sex === s.id;
                return (
                  <Pressable key={s.id} onPress={() => set('sex', s.id)}
                    style={({ pressed }) => [styles.chipBtn, sel && styles.chipSel, pressed && { opacity: 0.9 }]}
                    data-testid={`sex-${s.id}`}>
                    <Text style={[styles.chipText, sel && { color: colors.cream }]}>{s.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {step === 5 && (
          <View style={{ gap: 12 }}>
            <Text style={styles.q}>Chip, färg och anteckning (frivilligt)</Text>
            <TextInput value={pet.chip} onChangeText={(v) => set('chip', v)} placeholder="Chipnummer"
              placeholderTextColor={colors.muted} style={styles.input} data-testid="input-chip" />
            <TextInput value={pet.color} onChangeText={(v) => set('color', v)} placeholder="Färg"
              placeholderTextColor={colors.muted} style={styles.input} data-testid="input-color" />
            <TextInput value={pet.notes} onChangeText={(v) => set('notes', v)} placeholder="Anteckning"
              placeholderTextColor={colors.muted} multiline style={[styles.input, { minHeight: 80, textAlignVertical: 'top' }]} data-testid="input-notes" />
          </View>
        )}

        {step === 6 && (
          <View>
            <Text style={styles.q}>Se över och spara</Text>

            <Pressable
              onPress={async () => { const p = await pickPetPhoto(); if (p) set('photo', p.base64DataUri); }}
              style={({ pressed }) => [styles.photoRow, pressed && { opacity: 0.9 }]}>
              {pet.photo ? (
                <Image source={{ uri: pet.photo }} style={styles.photoLarge} />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Ionicons name="camera-outline" size={28} color={colors.forest} />
                </View>
              )}
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.photoTitle}>{pet.photo ? 'Byt foto' : 'Lägg till foto (frivilligt)'}</Text>
                <Text style={styles.photoHint}>Bilden syns i garaget och på profilen.</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.muted} />
            </Pressable>

            <View style={styles.review}>
              <ReviewRow label="Art" value={SPECIES.find((s) => s.id === pet.species)?.label} />
              <ReviewRow label="Namn" value={pet.name} />
              <ReviewRow label="Ras" value={pet.breed || '—'} />
              <ReviewRow label="Födelsedatum" value={pet.birthDate || '—'} />
              <ReviewRow label="Kön" value={SEX.find((s) => s.id === pet.sex)?.label} />
              <ReviewRow label="Chip" value={pet.chip || '—'} />
              <ReviewRow label="Färg" value={pet.color || '—'} />
              <ReviewRow label="Anteckning" value={pet.notes || '—'} last />
            </View>
            {error ? <Text style={styles.error}>{error}</Text> : null}
          </View>
        )}

        <View style={styles.nav}>
          <Pressable onPress={back} style={({ pressed }) => [styles.back, pressed && { opacity: 0.9 }]} data-testid="wizard-back">
            <Ionicons name="chevron-back" size={18} color={colors.forest} />
            <Text style={styles.backText}>Tillbaka</Text>
          </Pressable>
          {step < 6 ? (
            <Pressable onPress={next} disabled={!canNext()}
              style={({ pressed }) => [styles.next, !canNext() && { opacity: 0.5 }, pressed && { opacity: 0.9 }]}
              data-testid="wizard-next">
              <Text style={styles.nextText}>Nästa</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.cream} />
            </Pressable>
          ) : (
            <Pressable onPress={submit} disabled={busy}
              style={({ pressed }) => [styles.next, busy && { opacity: 0.7 }, pressed && { opacity: 0.9 }]}
              data-testid="wizard-save">
              <Text style={styles.nextText}>{busy ? 'Sparar…' : 'Spara'}</Text>
              <Ionicons name="checkmark" size={18} color={colors.cream} />
            </Pressable>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StepBar({ step }) {
  const total = 7;
  return (
    <View style={{ flexDirection: 'row', gap: 6, marginBottom: 20 }}>
      {[...Array(total)].map((_, i) => (
        <View key={i} style={[styles.stepBar, i <= step && styles.stepActive]} />
      ))}
    </View>
  );
}

function Field({ q, hint, children, testID }) {
  return (
    <View data-testid={testID}>
      <Text style={styles.q}>{q}</Text>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      {children}
    </View>
  );
}

function ReviewRow({ label, value, last }) {
  return (
    <View style={[styles.reviewRow, !last && styles.reviewBorder]}>
      <Text style={styles.reviewLabel}>{label}</Text>
      <Text style={styles.reviewValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  stepBar: { flex: 1, height: 4, borderRadius: 2, backgroundColor: colors.border },
  stepActive: { backgroundColor: colors.forest },
  q: { color: colors.forest, fontSize: 22, fontWeight: '800', marginBottom: 8 },
  hint: { color: colors.inkSoft, fontSize: 13, marginBottom: 10 },
  input: {
    backgroundColor: colors.white, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: 14, paddingVertical: Platform.OS === 'ios' ? 14 : 12, color: colors.ink, fontSize: 15,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 8 },
  speciesCard: {
    width: '48%', backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border,
    padding: 18, alignItems: 'center', gap: 8, ...shadow.card,
  },
  speciesSel: { backgroundColor: colors.forest, borderColor: colors.forest },
  speciesLabel: { color: colors.forest, fontWeight: '800' },
  chipBtn: {
    paddingHorizontal: 18, paddingVertical: 12, borderRadius: radius.pill,
    borderWidth: 1.5, borderColor: colors.forest,
  },
  chipSel: { backgroundColor: colors.forest },
  chipText: { color: colors.forest, fontWeight: '700' },
  review: { backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 12 },
  reviewRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, gap: 12 },
  reviewBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  reviewLabel: { color: colors.muted, fontSize: 12, letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: '700' },
  reviewValue: { color: colors.ink, fontSize: 14, textAlign: 'right', flex: 1 },
  nav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.xl },
  back: { flexDirection: 'row', alignItems: 'center', padding: 10 },
  backText: { color: colors.forest, fontWeight: '700', marginLeft: 4 },
  next: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.forest, paddingHorizontal: 20, paddingVertical: 14, borderRadius: radius.pill, gap: 6, ...shadow.strong },
  nextText: { color: colors.cream, fontWeight: '800' },
  error: { color: colors.danger, marginTop: 8 },
  photoRow: {
    flexDirection: 'row', alignItems: 'center', padding: 12, marginBottom: 12,
    backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, ...shadow.card,
  },
  photoLarge: { width: 60, height: 60, borderRadius: 16 },
  photoPlaceholder: {
    width: 60, height: 60, borderRadius: 16, backgroundColor: colors.sageSoft,
    alignItems: 'center', justifyContent: 'center',
  },
  photoTitle: { color: colors.forest, fontWeight: '800' },
  photoHint: { color: colors.inkSoft, fontSize: 12, marginTop: 2 },
});
