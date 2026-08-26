import React from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, spacing, radius, shadow } from '../../theme';
import { clinic } from '../../data/clinic';
import { useAuth } from '../../context/AuthContext';
import SectionTitle from '../../components/SectionTitle';

export default function MerIndex() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const isStaff = user?.role === 'staff';

  const clinicRows = [
    { id: 'om-oss', icon: 'information-circle-outline', title: 'Om oss', sub: 'Historia & filosofi' },
    { id: 'team', icon: 'people-outline', title: 'Team', sub: 'Veterinärer, sköterskor & konsulter' },
    { id: 'kontakt', icon: 'call-outline', title: 'Kontakt', sub: 'Ring, sms, mejl & formulär' },
    { id: 'hitta-hit', icon: 'navigate-outline', title: 'Hitta hit', sub: 'Adress & parkering' },
    { id: 'integritet', icon: 'shield-outline', title: 'Integritet', sub: 'Kort & rakt på sak' },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: 120 }}>
        <SectionTitle eyebrow={clinic.companyLegal} title="Mer" subtitle={`Org.nr ${clinic.orgNr}`} />

        {isStaff && (
          <Pressable
            onPress={() => router.push('/staff')}
            style={({ pressed }) => [styles.staffCard, pressed && { opacity: 0.9 }]}
            data-testid="klinik-mode"
          >
            <View style={styles.staffIcon}><Ionicons name="briefcase" size={22} color={colors.cream} /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.staffTitle}>Klinikläge</Text>
              <Text style={styles.staffSub}>Tidsförfrågningar och djur i systemet</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.cream} />
          </Pressable>
        )}

        {/* Konto */}
        <View style={styles.list} data-testid="account-list">
          {user ? (
            <>
              <View style={styles.userRow}>
                <View style={styles.iconWrap}><Ionicons name="person" size={22} color={colors.forest} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowTitle}>{user.name}</Text>
                  <Text style={styles.rowSub}>{user.email}</Text>
                </View>
              </View>
              <Pressable onPress={logout}
                style={({ pressed }) => [styles.row, styles.rowBorder, pressed && { backgroundColor: colors.creamAlt }]}
                data-testid="logout-btn">
                <View style={styles.iconWrap}><Ionicons name="log-out-outline" size={22} color={colors.danger} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.rowTitle, { color: colors.danger }]}>Logga ut</Text>
                </View>
              </Pressable>
            </>
          ) : (
            <>
              <Pressable onPress={() => router.push('/auth/logga-in')}
                style={({ pressed }) => [styles.row, styles.rowBorder, pressed && { backgroundColor: colors.creamAlt }]}
                data-testid="mer-login">
                <View style={styles.iconWrap}><Ionicons name="log-in-outline" size={22} color={colors.forest} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowTitle}>Logga in</Text>
                  <Text style={styles.rowSub}>För att lägga in dina djur</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.muted} />
              </Pressable>
              <Pressable onPress={() => router.push('/auth/skapa-konto')}
                style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.creamAlt }]}
                data-testid="mer-signup">
                <View style={styles.iconWrap}><Ionicons name="person-add-outline" size={22} color={colors.forest} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowTitle}>Skapa konto</Text>
                  <Text style={styles.rowSub}>Namn, telefon, e-post, lösenord</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.muted} />
              </Pressable>
            </>
          )}
        </View>

        {/* Klinik */}
        <View style={[styles.list, { marginTop: spacing.md }]}>
          {clinicRows.map((r, i) => (
            <Pressable
              key={r.id}
              onPress={() => router.push(`/mer/${r.id}`)}
              style={({ pressed }) => [
                styles.row,
                i < clinicRows.length - 1 && styles.rowBorder,
                pressed && { backgroundColor: colors.creamAlt },
              ]}
              data-testid={`more-row-${r.id}`}
            >
              <View style={styles.iconWrap}>
                <Ionicons name={r.icon} size={22} color={colors.forest} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>{r.title}</Text>
                <Text style={styles.rowSub}>{r.sub}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.muted} />
            </Pressable>
          ))}
        </View>

        <Text style={styles.footer}>{clinic.fullName}</Text>
        <Text style={styles.footerSmall}>{clinic.address.street}, {clinic.address.zip} {clinic.address.city}</Text>
        <Text style={styles.footerSmall}>{clinic.phoneDisplay} · {clinic.email}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  staffCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.forest,
    padding: 14, borderRadius: radius.lg, gap: 12, marginBottom: spacing.md, ...shadow.strong,
  },
  staffIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  staffTitle: { color: colors.cream, fontSize: 16, fontWeight: '800' },
  staffSub: { color: colors.sageSoft, fontSize: 12, marginTop: 2 },
  list: {
    backgroundColor: colors.white, borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.border, ...shadow.card, overflow: 'hidden',
  },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 14 },
  userRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 14, backgroundColor: colors.creamAlt },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  iconWrap: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: colors.sageSoft,
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  rowTitle: { color: colors.forest, fontWeight: '800', fontSize: 15 },
  rowSub: { color: colors.inkSoft, fontSize: 12, marginTop: 2 },
  footer: { marginTop: spacing.xl, textAlign: 'center', color: colors.forest, fontWeight: '700' },
  footerSmall: { textAlign: 'center', color: colors.inkSoft, fontSize: 12, marginTop: 2 },
});
