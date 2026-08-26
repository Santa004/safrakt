import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../../theme';
import { privacyText, clinic } from '../../data/clinic';
import Card from '../../components/Card';

export default function Integritet() {
  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: 60 }}>
        <Card>
          <Text style={styles.body}>{privacyText}</Text>
        </Card>
        <Text style={styles.small}>{clinic.companyLegal} · Org.nr {clinic.orgNr}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  body: { color: colors.ink, fontSize: 15, lineHeight: 22 },
  small: { color: colors.muted, fontSize: 12, marginTop: spacing.lg, textAlign: 'center' },
});
