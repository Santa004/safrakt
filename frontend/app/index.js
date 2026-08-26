import React from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, spacing, radius, type, shadow } from '../theme';
import { clinic, hours, hoursOrder, dropIn, emergency } from '../data/clinic';
import { formatDayHours, isOpenNow } from '../data/hours';
import CallButton from '../components/CallButton';
import StatusChip from '../components/StatusChip';
import Card from '../components/Card';
import StickyCall from '../components/StickyCall';
import { openMaps } from '../utils/actions';

export default function Hem() {
  const router = useRouter();
  const status = isOpenNow();
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={{ padding: spacing.md, paddingBottom: 200 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <StatusChip />
          <Text style={[type.h1, { marginTop: spacing.md, fontSize: 32, lineHeight: 38 }]}>
            {clinic.appName}
          </Text>
          <Text style={[type.body, { marginTop: 8, color: colors.forestDeep }]}>
            {clinic.slogan}
          </Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={16} color={colors.gold} />
            <Text style={styles.ratingText}>
              {clinic.googleRating} på Google
            </Text>
            <View style={styles.dotSep} />
            <Ionicons name="location-outline" size={14} color={colors.inkSoft} />
            <Text style={styles.ratingSub}>Mantorp</Text>
          </View>
        </View>

        {/* Giant Call */}
        <View style={{ marginTop: spacing.lg }}>
          <CallButton />
          <Text style={styles.tinySub}>Bokning sker endast per telefon · telefontid {clinic.phoneHours}</Text>
        </View>

        {/* Öppettider */}
        <Card style={{ marginTop: spacing.lg }} testID="hours-card">
          <View style={styles.cardHeader}>
            <Ionicons name="time-outline" size={20} color={colors.forest} />
            <Text style={styles.cardTitle}>Öppettider</Text>
          </View>
          {hoursOrder.map((k) => {
            const d = hours[k];
            const isToday = status.todayLabel === d.label;
            return (
              <View key={k} style={[styles.hourRow, isToday && styles.hourRowToday]}>
                <Text style={[styles.hourDay, isToday && { color: colors.forest, fontWeight: '800' }]}>
                  {d.label}{isToday ? ' · idag' : ''}
                </Text>
                <Text style={[styles.hourTime, d.open == null && { color: colors.muted }]}>
                  {formatDayHours(d)}
                </Text>
                {d.evening && (
                  <View style={styles.eveningPill}>
                    <Text style={styles.eveningText}>Kväll</Text>
                  </View>
                )}
              </View>
            );
          })}
          <Text style={styles.smallNote}>Kvällsöppet mån/tis/tor till 19:00 · Öppettider kan variera.</Text>
        </Card>

        {/* Drop-in */}
        <Card style={{ marginTop: spacing.md }} accent={colors.sage} testID="dropin-card">
          <View style={styles.cardHeader}>
            <Ionicons name="calendar-outline" size={20} color={colors.forest} />
            <Text style={styles.cardTitle}>Drop-in vaccination</Text>
          </View>
          <Text style={[type.body, { marginTop: 4 }]}>
            {dropIn.day} {dropIn.time} · max {dropIn.maxAnimals} djur
          </Text>
          <Text style={[type.small, { marginTop: 4 }]}>{dropIn.pricesInline}</Text>
        </Card>

        {/* Akut */}
        <Card style={{ marginTop: spacing.md }} accent={colors.gold} testID="emergency-card">
          <View style={styles.cardHeader}>
            <Ionicons name="alert-circle-outline" size={20} color={colors.gold} />
            <Text style={[styles.cardTitle, { color: colors.forest }]}>{emergency.headline}</Text>
          </View>
          <Text style={[type.body, { marginTop: 4 }]}>{emergency.body}</Text>
          <Text style={[type.small, { marginTop: 6 }]}>{emergency.fee}</Text>
        </Card>

        {/* Shortcuts */}
        <View style={styles.shortcuts}>
          <Shortcut
            testID="shortcut-tandvard"
            icon="medkit-outline"
            label="Tandvård"
            sub="Vår spetskompetens"
            onPress={() => router.push('/tandvard')}
          />
          <Shortcut
            testID="shortcut-priser"
            icon="pricetag-outline"
            label="Priser"
            sub="Alla priser & sök"
            onPress={() => router.push('/priser')}
          />
          <Shortcut
            testID="shortcut-hitta"
            icon="navigate-outline"
            label="Hitta hit"
            sub={clinic.address.street}
            onPress={openMaps}
          />
        </View>

        {/* Om oss teaser */}
        <Pressable
          onPress={() => router.push('/mer/om-oss')}
          style={({ pressed }) => [styles.aboutCard, pressed && { opacity: 0.9 }]}
          data-testid="about-teaser"
        >
          <Text style={type.label}>Om kliniken</Text>
          <Text style={[type.h3, { marginTop: 6, color: colors.cream }]}>
            Personlig vård i mindre skala, sedan 2019.
          </Text>
          <Text style={[type.small, { color: colors.sageSoft, marginTop: 6 }]}>
            Grundad av Linda Billehag och Linda Samuelsson Bäckgren. Läs mer →
          </Text>
        </Pressable>
      </ScrollView>
      <StickyCall />
    </SafeAreaView>
  );
}

function Shortcut({ icon, label, sub, onPress, testID }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.shortcut, pressed && { transform: [{ scale: 0.98 }] }]}
      data-testid={testID}
    >
      <Ionicons name={icon} size={22} color={colors.forest} />
      <Text style={styles.shortcutLabel}>{label}</Text>
      <Text style={styles.shortcutSub} numberOfLines={1}>{sub}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  hero: { marginTop: spacing.sm },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  ratingText: { marginLeft: 6, color: colors.forest, fontWeight: '700', fontSize: 13 },
  ratingSub: { marginLeft: 4, color: colors.inkSoft, fontSize: 13 },
  dotSep: { width: 3, height: 3, borderRadius: 2, backgroundColor: colors.border, marginHorizontal: 10 },
  tinySub: { marginTop: 10, color: colors.inkSoft, fontSize: 12, textAlign: 'center' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  cardTitle: { fontSize: 16, fontWeight: '800', color: colors.forest, marginLeft: 6 },
  hourRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  hourRowToday: { backgroundColor: colors.sageSoft, borderRadius: radius.sm, paddingHorizontal: 10 },
  hourDay: { color: colors.ink, fontSize: 15, fontWeight: '600', width: 90 },
  hourTime: { color: colors.inkSoft, fontSize: 15, flex: 1, textAlign: 'right' },
  eveningPill: {
    backgroundColor: colors.forest, paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: radius.pill, marginLeft: 10,
  },
  eveningText: { color: colors.cream, fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  smallNote: { color: colors.muted, fontSize: 12, marginTop: 10 },
  shortcuts: { flexDirection: 'row', gap: 10, marginTop: spacing.lg },
  shortcut: {
    flex: 1, backgroundColor: colors.white, padding: 14, borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.border, ...shadow.card,
  },
  shortcutLabel: { marginTop: 8, color: colors.forest, fontWeight: '800', fontSize: 14 },
  shortcutSub: { color: colors.inkSoft, fontSize: 11, marginTop: 2 },
  aboutCard: {
    marginTop: spacing.lg, backgroundColor: colors.forest, padding: 18, borderRadius: radius.lg,
    ...shadow.card,
  },
});
