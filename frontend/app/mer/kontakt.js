import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TextInput, Pressable, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, shadow } from '../../theme';
import { clinic, dropIn } from '../../data/clinic';
import { callClinic, smsClinic, emailClinic, openMaps } from '../../utils/actions';
import Card from '../../components/Card';
import CallButton from '../../components/CallButton';

export default function Kontakt() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [msg, setMsg] = useState('');

  const send = () => {
    const subject = 'Kontakt via Mantorpsklinikens app';
    const body = `Namn: ${name}\nTelefon: ${phone}\n\nMeddelande:\n${msg}\n\n— Skickat från appen`;
    emailClinic(subject, body);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: 80 }} keyboardShouldPersistTaps="handled">
        <View style={{ marginBottom: spacing.md }}>
          <CallButton />
        </View>

        <View style={styles.quickRow}>
          <QuickBtn icon="chatbubble-outline" label="SMS" onPress={smsClinic} testID="sms-btn" />
          <QuickBtn icon="mail-outline" label="E-post" onPress={() => emailClinic()} testID="email-btn" />
          <QuickBtn icon="navigate-outline" label="Hitta hit" onPress={openMaps} testID="maps-btn" />
        </View>

        <Card style={{ marginTop: spacing.md }} testID="contact-info">
          <InfoRow icon="call-outline" label="Telefon" value={clinic.phoneDisplay} />
          <InfoRow icon="time-outline" label="Telefontid" value={clinic.phoneHours} />
          <InfoRow icon="mail-outline" label="E-post" value={clinic.email} />
          <InfoRow icon="location-outline" label="Adress" value={`${clinic.address.street}, ${clinic.address.zip} ${clinic.address.city}`} />
          <InfoRow icon="car-outline" label="Parkering" value="Utanför mottagningen" last />
        </Card>

        <Card style={{ marginTop: spacing.md }} accent={colors.sage}>
          <Text style={styles.h3}>Drop-in vaccination</Text>
          <Text style={styles.body}>{dropIn.day} {dropIn.time} · max {dropIn.maxAnimals} djur</Text>
        </Card>

        <Text style={styles.formLabel}>Skicka meddelande</Text>
        <Text style={styles.formHint}>Formuläret ersätter inte tidsbokning — ring oss. Akut = ring, inte formulär.</Text>

        <View style={styles.form}>
          <TextInput
            placeholder="Ditt namn"
            placeholderTextColor={colors.muted}
            value={name}
            onChangeText={setName}
            style={styles.input}
            data-testid="form-name"
          />
          <TextInput
            placeholder="Ditt telefonnummer"
            placeholderTextColor={colors.muted}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            style={styles.input}
            data-testid="form-phone"
          />
          <TextInput
            placeholder="Meddelande"
            placeholderTextColor={colors.muted}
            value={msg}
            onChangeText={setMsg}
            multiline
            style={[styles.input, styles.textarea]}
            data-testid="form-msg"
          />
          <Pressable
            onPress={send}
            style={({ pressed }) => [styles.send, pressed && { opacity: 0.9 }]}
            data-testid="form-send"
          >
            <Ionicons name="send" size={16} color={colors.cream} />
            <Text style={styles.sendText}>Öppna e-post och skicka</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function QuickBtn({ icon, label, onPress, testID }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.quick, pressed && { opacity: 0.9 }]} data-testid={testID}>
      <Ionicons name={icon} size={22} color={colors.forest} />
      <Text style={styles.quickLabel}>{label}</Text>
    </Pressable>
  );
}

function InfoRow({ icon, label, value, last }) {
  return (
    <View style={[styles.infoRow, !last && styles.infoBorder]}>
      <Ionicons name={icon} size={18} color={colors.forest} />
      <View style={{ marginLeft: 12, flex: 1 }}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  quickRow: { flexDirection: 'row', gap: 10 },
  quick: {
    flex: 1, alignItems: 'center', paddingVertical: 14, backgroundColor: colors.white,
    borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, ...shadow.card,
  },
  quickLabel: { marginTop: 6, color: colors.forest, fontWeight: '700', fontSize: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  infoBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  infoLabel: { color: colors.muted, fontSize: 11, letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: '700' },
  infoValue: { color: colors.ink, fontSize: 15, marginTop: 2 },
  h3: { color: colors.forest, fontSize: 16, fontWeight: '800' },
  body: { color: colors.ink, fontSize: 14, marginTop: 4 },
  formLabel: { color: colors.forest, fontSize: 18, fontWeight: '800', marginTop: spacing.xl },
  formHint: { color: colors.inkSoft, fontSize: 12, marginTop: 4 },
  form: { marginTop: spacing.md, gap: 10 },
  input: {
    backgroundColor: colors.white, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: 14, paddingVertical: Platform.OS === 'ios' ? 14 : 10, color: colors.ink, fontSize: 15,
  },
  textarea: { minHeight: 100, textAlignVertical: 'top' },
  send: {
    marginTop: 6, backgroundColor: colors.forest, paddingVertical: 14, borderRadius: radius.pill,
    alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8,
  },
  sendText: { color: colors.cream, fontWeight: '800', letterSpacing: 0.3, marginLeft: 6 },
});
