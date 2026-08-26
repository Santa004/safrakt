import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius, shadow } from '../../theme';
import { team } from '../../data/clinic';

export default function Team() {
  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: 60 }}>
        <Group title="Ägare" people={team.owners} />
        <Group title="Veterinärer" people={team.vets} />
        <Group title="Djursjukskötare" people={team.nurses} />
        <Group title="Övrig personal" people={team.others} />
        <Group title="Konsulter" people={team.consultants} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Group({ title, people }) {
  return (
    <View style={{ marginBottom: spacing.lg }}>
      <Text style={styles.groupTitle}>{title}</Text>
      <View style={styles.card}>
        {people.map((p, i) => (
          <View
            key={p.name}
            style={[styles.person, i < people.length - 1 && styles.border]}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials(p.name)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{p.name}</Text>
              <Text style={styles.role}>{p.role}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function initials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((s) => s[0])
    .join('')
    .toUpperCase();
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  groupTitle: {
    color: colors.gold, fontSize: 12, letterSpacing: 1.2,
    fontWeight: '800', textTransform: 'uppercase', marginBottom: 8, marginLeft: 4,
  },
  card: {
    backgroundColor: colors.white, borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.border, ...shadow.card, overflow: 'hidden',
  },
  person: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  border: { borderBottomWidth: 1, borderBottomColor: colors.border },
  avatar: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: colors.sageSoft,
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  avatarText: { color: colors.forest, fontWeight: '800', fontSize: 13 },
  name: { color: colors.forest, fontSize: 15, fontWeight: '700' },
  role: { color: colors.inkSoft, fontSize: 12, marginTop: 2, lineHeight: 16 },
});
