import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TextInput, Pressable, StyleSheet, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, shadow } from '../../../theme';
import { api } from '../../../utils/api';
import Card from '../../../components/Card';

const ROLES = [
  { id: 'coowner', label: 'Samägare', hint: 'Kan se, boka och logga' },
  { id: 'viewer', label: 'Läsbehörighet', hint: 'Kan bara se logg och tider' },
];

export default function Dela() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [pet, setPet] = useState(null);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('coowner');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      const r = await api(`/pets/${id}`);
      setPet(r.pet);
    } catch (e) { /* ignore */ }
  };

  useEffect(() => { load(); }, [id]);

  const invite = async () => {
    setError(null);
    if (!email.trim()) { setError('Ange e-post'); return; }
    setBusy(true);
    try {
      await api(`/pets/${id}/share`, { method: 'POST', body: { email: email.trim(), role } });
      setEmail('');
      await load();
    } catch (e) {
      setError(e.message);
    } finally { setBusy(false); }
  };

  const remove = async (userId) => {
    try {
      await api(`/pets/${id}/share/${userId}`, { method: 'DELETE' });
      await load();
    } catch (e) {
      Alert.alert('Fel', e.message);
    }
  };

  const shared = pet?.sharedUsers || [];
  const isOwner = pet?.isOwner;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={{ padding: spacing.md }} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Dela {pet?.name || 'djur'}</Text>
        <Text style={styles.sub}>
          Bjud in en familjemedlem eller sambo så ni båda ser samma djurfil, logg och tider.
        </Text>

        {isOwner ? (
          <>
            <Text style={styles.label}>E-post</Text>
            <TextInput value={email} onChangeText={setEmail}
              placeholder="familj@exempel.se" placeholderTextColor={colors.muted}
              autoCapitalize="none" keyboardType="email-address" style={styles.input} />

            <Text style={styles.label}>Behörighet</Text>
            <View style={{ gap: 8 }}>
              {ROLES.map((r) => {
                const sel = role === r.id;
                return (
                  <Pressable key={r.id} onPress={() => setRole(r.id)}
                    style={({ pressed }) => [styles.roleBtn, sel && styles.roleSel, pressed && { opacity: 0.9 }]}>
                    <Ionicons name={sel ? 'radio-button-on' : 'radio-button-off'} size={18} color={sel ? colors.cream : colors.forest} />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={[styles.roleLabel, sel && { color: colors.cream }]}>{r.label}</Text>
                      <Text style={[styles.roleHint, sel && { color: colors.sageSoft }]}>{r.hint}</Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Pressable onPress={invite} disabled={busy}
              style={({ pressed }) => [styles.btn, (busy || pressed) && { opacity: 0.9 }]}>
              <Ionicons name="person-add" size={18} color={colors.cream} />
              <Text style={styles.btnText}>{busy ? 'Delar…' : 'Bjud in'}</Text>
            </Pressable>
            <Text style={styles.tinyHint}>
              Personen måste redan ha ett konto. Har hen inte det — be dem skapa konto först.
            </Text>
          </>
        ) : (
          <Card accent={colors.gold}>
            <Text style={styles.helpTitle}>Detta djur är delat med dig</Text>
            <Text style={styles.helpBody}>
              Endast ägaren kan bjuda in fler. Du kan avsluta ditt medlemskap nedan om du vill.
            </Text>
          </Card>
        )}

        {shared.length > 0 && (
          <View style={{ marginTop: spacing.lg }}>
            <Text style={styles.sectionTitle}>Delat med</Text>
            <View style={styles.list}>
              {shared.map((s, i) => (
                <View key={s.userId} style={[styles.row, i < shared.length - 1 && styles.rowBorder]}>
                  <View style={styles.avatar}>
                    <Ionicons name="person" size={18} color={colors.forest} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{s.name}</Text>
                    <Text style={styles.meta}>{s.email} · {s.role === 'coowner' ? 'Samägare' : 'Läsbehörighet'}</Text>
                  </View>
                  {isOwner && (
                    <Pressable onPress={() => remove(s.userId)}>
                      <Ionicons name="close-circle" size={22} color={colors.danger} />
                    </Pressable>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  title: { color: colors.forest, fontSize: 24, fontWeight: '800' },
  sub: { color: colors.inkSoft, marginTop: 6, lineHeight: 20, marginBottom: spacing.lg },
  label: { color: colors.forest, fontWeight: '800', fontSize: 12, letterSpacing: 0.4, textTransform: 'uppercase', marginTop: spacing.md, marginBottom: 8 },
  input: { backgroundColor: colors.white, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14, paddingVertical: Platform.OS === 'ios' ? 14 : 12, color: colors.ink, fontSize: 15 },
  roleBtn: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.forest, backgroundColor: colors.white },
  roleSel: { backgroundColor: colors.forest },
  roleLabel: { color: colors.forest, fontWeight: '800' },
  roleHint: { color: colors.inkSoft, fontSize: 12, marginTop: 2 },
  btn: { marginTop: spacing.md, backgroundColor: colors.forest, paddingVertical: 14, borderRadius: radius.pill, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, ...shadow.strong },
  btnText: { color: colors.cream, fontWeight: '800', marginLeft: 6 },
  tinyHint: { color: colors.muted, fontSize: 12, textAlign: 'center', marginTop: 10 },
  error: { color: colors.danger, marginTop: 8, fontSize: 13 },
  sectionTitle: { color: colors.gold, fontSize: 12, letterSpacing: 1.2, fontWeight: '800', textTransform: 'uppercase', marginBottom: 8, marginLeft: 4 },
  list: { backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, ...shadow.card, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.sageSoft, alignItems: 'center', justifyContent: 'center' },
  name: { color: colors.forest, fontWeight: '800' },
  meta: { color: colors.inkSoft, fontSize: 12, marginTop: 2 },
  helpTitle: { color: colors.forest, fontWeight: '800' },
  helpBody: { color: colors.ink, marginTop: 4, lineHeight: 20 },
});
