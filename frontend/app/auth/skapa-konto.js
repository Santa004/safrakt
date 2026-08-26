import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, Pressable, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, spacing, radius, shadow } from '../../theme';
import { useAuth } from '../../context/AuthContext';

export default function SkapaKonto() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setError(null);
    if (password.length < 8) { setError('Lösenord måste vara minst 8 tecken'); return; }
    if (!name.trim() || !phone.trim() || !email.trim()) { setError('Fyll i alla fält'); return; }
    setBusy(true);
    try {
      await register({ name: name.trim(), phone: phone.trim(), email: email.trim(), password });
      router.replace('/djur');
    } catch (e) {
      setError(e.message || 'Kunde inte skapa konto');
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={{ padding: spacing.md }} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Skapa konto</Text>
        <Text style={styles.sub}>Din uppgifter används för att spara dina djur och koppla dig till kliniken.</Text>

        <TextInput placeholder="Namn" placeholderTextColor={colors.muted}
          value={name} onChangeText={setName} style={styles.input}
          data-testid="signup-name" />
        <TextInput placeholder="Telefon" placeholderTextColor={colors.muted}
          value={phone} onChangeText={setPhone} keyboardType="phone-pad" style={styles.input}
          data-testid="signup-phone" />
        <TextInput placeholder="E-post" placeholderTextColor={colors.muted}
          value={email} onChangeText={setEmail} autoCapitalize="none"
          keyboardType="email-address" style={styles.input}
          data-testid="signup-email" />
        <TextInput placeholder="Lösenord (minst 8 tecken)" placeholderTextColor={colors.muted}
          value={password} onChangeText={setPassword} secureTextEntry style={styles.input}
          data-testid="signup-password" />

        {error ? <Text style={styles.error} data-testid="signup-error">{error}</Text> : null}

        <Pressable onPress={submit} disabled={busy}
          style={({ pressed }) => [styles.btn, (busy || pressed) && { opacity: 0.85 }]}
          data-testid="signup-submit">
          <Text style={styles.btnText}>{busy ? 'Skapar konto…' : 'Skapa konto'}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  title: { color: colors.forest, fontSize: 26, fontWeight: '800', marginTop: 8 },
  sub: { color: colors.inkSoft, marginTop: 6, marginBottom: spacing.lg },
  input: { backgroundColor: colors.white, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14, paddingVertical: Platform.OS === 'ios' ? 14 : 12, marginBottom: 12, color: colors.ink, fontSize: 15 },
  btn: { backgroundColor: colors.forest, paddingVertical: 16, borderRadius: radius.pill, alignItems: 'center', marginTop: 6, ...shadow.strong },
  btnText: { color: colors.cream, fontWeight: '800', fontSize: 15 },
  error: { color: colors.danger, marginBottom: 6, fontSize: 13 },
});
