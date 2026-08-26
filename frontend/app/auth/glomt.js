import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, Pressable, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, shadow } from '../../theme';
import { api } from '../../utils/api';
import CallButton from '../../components/CallButton';
import Card from '../../components/Card';

export default function Glomt() {
  const [step, setStep] = useState('request'); // 'request' | 'reset' | 'done'
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);

  const requestReset = async () => {
    setError(null); setBusy(true);
    try {
      await api('/auth/forgot-password', { method: 'POST', body: { email: email.trim() }, auth: false });
      setInfo('Om e-posten finns hos oss får du en återställningslänk. Har du redan en token kan du ange den nedan.');
      setStep('reset');
    } catch (e) {
      setError(e.message || 'Något gick fel');
    } finally { setBusy(false); }
  };

  const doReset = async () => {
    setError(null);
    if (password.length < 8) { setError('Lösenord måste vara minst 8 tecken'); return; }
    setBusy(true);
    try {
      await api('/auth/reset-password', { method: 'POST', body: { token: token.trim(), password }, auth: false });
      setStep('done');
    } catch (e) {
      setError(e.message || 'Kunde inte återställa');
    } finally { setBusy(false); }
  };

  if (step === 'done') {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.doneWrap}>
          <View style={styles.doneIcon}><Ionicons name="checkmark" size={40} color={colors.cream} /></View>
          <Text style={styles.doneTitle}>Lösenordet är återställt</Text>
          <Text style={styles.doneSub}>Logga in med ditt nya lösenord.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={{ padding: spacing.md }} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Glömt lösenord</Text>
        <Text style={styles.sub}>
          Vi skickar en återställningslänk. Har du inte fått den? Ring kliniken så hjälper vi dig.
        </Text>

        {step === 'request' && (
          <>
            <TextInput
              placeholder="E-post" placeholderTextColor={colors.muted}
              value={email} onChangeText={setEmail}
              autoCapitalize="none" keyboardType="email-address"
              style={styles.input}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Pressable onPress={requestReset} disabled={busy}
              style={({ pressed }) => [styles.btn, (busy || pressed) && { opacity: 0.9 }]}>
              <Text style={styles.btnText}>{busy ? 'Skickar…' : 'Skicka återställningslänk'}</Text>
            </Pressable>
          </>
        )}

        {step === 'reset' && (
          <>
            {info ? <Text style={styles.info}>{info}</Text> : null}
            <Text style={styles.label}>Återställningstoken</Text>
            <TextInput
              placeholder="Klistra in token från e-post" placeholderTextColor={colors.muted}
              value={token} onChangeText={setToken}
              autoCapitalize="none" style={styles.input}
            />
            <Text style={styles.label}>Nytt lösenord</Text>
            <TextInput
              placeholder="Minst 8 tecken" placeholderTextColor={colors.muted}
              value={password} onChangeText={setPassword}
              secureTextEntry style={styles.input}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Pressable onPress={doReset} disabled={busy}
              style={({ pressed }) => [styles.btn, (busy || pressed) && { opacity: 0.9 }]}>
              <Text style={styles.btnText}>{busy ? 'Återställer…' : 'Återställ lösenord'}</Text>
            </Pressable>
          </>
        )}

        <Card style={{ marginTop: spacing.lg }} accent={colors.gold}>
          <Text style={styles.helpTitle}>Får du inget mail?</Text>
          <Text style={styles.helpBody}>
            Vi rullar just nu ut e-post­utskick. Kontakta kliniken så återställer vi manuellt.
          </Text>
        </Card>
        <View style={{ marginTop: spacing.md }}>
          <CallButton />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  title: { color: colors.forest, fontSize: 24, fontWeight: '800' },
  sub: { color: colors.inkSoft, marginTop: 6, marginBottom: spacing.md, lineHeight: 20 },
  label: { color: colors.forest, fontWeight: '800', fontSize: 12, letterSpacing: 0.4, textTransform: 'uppercase', marginTop: spacing.md, marginBottom: 6 },
  input: { backgroundColor: colors.white, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14, paddingVertical: Platform.OS === 'ios' ? 14 : 12, color: colors.ink, fontSize: 15, marginBottom: 10 },
  btn: { backgroundColor: colors.forest, paddingVertical: 16, borderRadius: radius.pill, alignItems: 'center', marginTop: 4, ...shadow.strong },
  btnText: { color: colors.cream, fontWeight: '800' },
  info: { color: colors.forest, backgroundColor: colors.sageSoft, padding: 12, borderRadius: radius.md, fontSize: 13, lineHeight: 18 },
  error: { color: colors.danger, marginBottom: 6, fontSize: 13 },
  helpTitle: { color: colors.forest, fontWeight: '800', fontSize: 14 },
  helpBody: { color: colors.ink, marginTop: 4, lineHeight: 20 },
  doneWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: 8 },
  doneIcon: { width: 84, height: 84, borderRadius: 42, backgroundColor: colors.forest, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  doneTitle: { color: colors.forest, fontSize: 20, fontWeight: '800' },
  doneSub: { color: colors.inkSoft, textAlign: 'center' },
});
