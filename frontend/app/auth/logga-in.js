import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, Pressable, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, shadow } from '../../theme';
import { useAuth } from '../../context/AuthContext';

export default function LoggaIn() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setError(null);
    setBusy(true);
    try {
      const u = await login(email.trim(), password);
      if (u.role === 'staff') router.replace('/staff');
      else router.replace('/djur');
    } catch (e) {
      setError(e.message || 'Kunde inte logga in');
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={{ padding: spacing.md }} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Välkommen tillbaka</Text>
        <Text style={styles.sub}>Logga in för att se dina djur.</Text>

        <TextInput
          placeholder="E-post"
          placeholderTextColor={colors.muted}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
          data-testid="login-email"
        />
        <TextInput
          placeholder="Lösenord"
          placeholderTextColor={colors.muted}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          data-testid="login-password"
        />

        {error ? <Text style={styles.error} data-testid="login-error">{error}</Text> : null}

        <Pressable
          onPress={submit}
          disabled={busy}
          style={({ pressed }) => [styles.btn, (busy || pressed) && { opacity: 0.85 }]}
          data-testid="login-submit"
        >
          <Text style={styles.btnText}>{busy ? 'Loggar in…' : 'Logga in'}</Text>
        </Pressable>

        <View style={styles.linksRow}>
          <Link href="/auth/glomt" asChild>
            <Pressable data-testid="link-glomt"><Text style={styles.link}>Glömt lösenord?</Text></Pressable>
          </Link>
          <Link href="/auth/skapa-konto" asChild>
            <Pressable data-testid="link-skapa"><Text style={styles.link}>Skapa konto</Text></Pressable>
          </Link>
        </View>

        <View style={styles.demo}>
          <Text style={styles.demoTitle}>Demo</Text>
          <Text style={styles.demoLine}>Ägare: anna@test.se · Test1234</Text>
          <Text style={styles.demoLine}>Personal: staff@mantorpssmadjursklinik.se · Staff1234</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  title: { color: colors.forest, fontSize: 26, fontWeight: '800', marginTop: 8 },
  sub: { color: colors.inkSoft, marginTop: 6, marginBottom: spacing.lg },
  input: {
    backgroundColor: colors.white, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: 14, paddingVertical: Platform.OS === 'ios' ? 14 : 12, marginBottom: 12,
    color: colors.ink, fontSize: 15,
  },
  btn: { backgroundColor: colors.forest, paddingVertical: 16, borderRadius: radius.pill, alignItems: 'center', marginTop: 6, ...shadow.strong },
  btnText: { color: colors.cream, fontWeight: '800', fontSize: 15, letterSpacing: 0.3 },
  linksRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  link: { color: colors.forest, fontWeight: '700' },
  error: { color: colors.danger, marginBottom: 6, fontSize: 13 },
  demo: {
    marginTop: spacing.xl, padding: 12, borderRadius: radius.md,
    backgroundColor: colors.creamAlt, borderWidth: 1, borderColor: colors.border,
  },
  demoTitle: { color: colors.forest, fontWeight: '800', marginBottom: 6, fontSize: 12, letterSpacing: 0.8, textTransform: 'uppercase' },
  demoLine: { color: colors.inkSoft, fontSize: 12, lineHeight: 18 },
});
