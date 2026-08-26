import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius } from '../../theme';
import CallButton from '../../components/CallButton';
import Card from '../../components/Card';

export default function Glomt() {
  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={{ padding: spacing.md }}>
        <Text style={styles.title}>Glömt lösenord</Text>
        <Text style={styles.sub}>Vi har inte lösenordsåterställning via e-post ännu.</Text>
        <Card style={{ marginTop: spacing.md }} accent={colors.gold}>
          <Text style={styles.body}>
            Kontakta kliniken så hjälper vi dig återställa ditt lösenord.
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
  sub: { color: colors.inkSoft, marginTop: 6 },
  body: { color: colors.ink, fontSize: 15, lineHeight: 22 },
});
