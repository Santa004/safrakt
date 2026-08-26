import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius, type } from '../../theme';
import { aboutText, clinic } from '../../data/clinic';
import Card from '../../components/Card';
import CallButton from '../../components/CallButton';

export default function OmOss() {
  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: 60 }}>
        <Text style={styles.eyebrow}>Grundad {clinic.founded.toLowerCase()}</Text>
        <Text style={styles.title}>{clinic.slogan}</Text>
        <Card style={{ marginTop: spacing.md }}>
          <Text style={styles.body}>{aboutText}</Text>
        </Card>

        <Card style={{ marginTop: spacing.md }} accent={colors.gold}>
          <Text style={styles.h3}>Bokning</Text>
          <Text style={styles.body}>
            All bokning sker per telefon. Vi tar inte emot bokningar via app eller e-post — det ger oss möjlighet att prioritera akuta fall och lyssna på dig som ringer.
          </Text>
        </Card>

        <View style={{ marginTop: spacing.lg }}>
          <CallButton />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  eyebrow: { color: colors.gold, fontSize: 12, letterSpacing: 1.5, fontWeight: '800', textTransform: 'uppercase' },
  title: { color: colors.forest, fontSize: 24, fontWeight: '800', lineHeight: 30, marginTop: 8 },
  body: { color: colors.ink, fontSize: 15, lineHeight: 22 },
  h3: { color: colors.forest, fontSize: 17, fontWeight: '800', marginBottom: 6 },
});
