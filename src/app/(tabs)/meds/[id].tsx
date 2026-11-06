import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { IconLine, StatusLine } from '@/components/status-line';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { patients } from '@/data/mock';
import { useData } from '@/store/data';
import { formatDate, fullName } from '@/utils/format';
import { canOrder, refillStatus } from '@/utils/refill-status';

export default function MedicationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, setArchived, setAutoRefill } = useData();
  const med = state.medications.find((m) => m.id === id);

  if (!med) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>Medication not found.</Text>
      </View>
    );
  }

  const patient = patients.find((p) => p.id === med.patientId);
  const orderable = canOrder(med, state.orders);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card>
        <Text style={styles.name}>{med.name}</Text>
        <Text style={styles.muted}>
          Rx: {med.rxNumber}
          {med.enteredManually ? ' (Entered manually)' : ''}
        </Text>
        {patient && <Text style={styles.muted}>For: {fullName(patient)}</Text>}

        <View style={styles.lines}>
          <StatusLine status={refillStatus(med, state.orders)} />
          <IconLine icon="calendar-blank-outline" text={`Last filled: ${formatDate(med.lastFilled)}`} />
          {med.refillDue && (
            <IconLine icon="calendar-arrow-right" text={`Next refill: ${formatDate(med.refillDue)}`} />
          )}
        </View>
      </Card>

      <Card style={styles.gap}>
        <Text style={styles.section}>How to take</Text>
        <Text style={styles.body}>{med.instructions}</Text>
      </Card>

      {!med.archived && (
        <Card style={[styles.gap, styles.switchRow]}>
          <View style={styles.flex}>
            <Text style={styles.section}>Auto-refill</Text>
            <Text style={styles.muted}>We&apos;ll refill this automatically when it&apos;s due.</Text>
          </View>
          <Switch
            value={!!med.autoRefill}
            onValueChange={(v) => setAutoRefill(med.id, v)}
            trackColor={{ true: Colors.primary }}
            accessibilityLabel="Auto-refill"
          />
        </Card>
      )}

      {orderable && (
        <Button
          title="Order refill"
          style={styles.gap}
          onPress={() => router.push({ pathname: '/meds/order', params: { ids: med.id } })}
        />
      )}
      <Button
        title={med.archived ? 'Restore to active list' : 'Archive'}
        variant="outline"
        style={styles.gap}
        onPress={() => {
          setArchived(med.id, !med.archived);
          router.back();
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  flex: { flex: 1 },
  gap: { marginTop: Spacing.lg },
  name: { fontSize: FontSize.title, fontWeight: '600', color: Colors.text, marginBottom: 4 },
  muted: { fontSize: FontSize.body, color: Colors.textMuted },
  lines: { marginTop: Spacing.sm },
  section: { fontSize: FontSize.label, fontWeight: '600', color: Colors.text, marginBottom: 4 },
  body: { fontSize: FontSize.body, color: Colors.text, lineHeight: 20 },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
});
