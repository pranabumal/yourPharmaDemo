import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Colors, FontSize, Radius, Spacing } from '@/constants/theme';
import { pharmacy } from '@/data/mock';
import type { PickupMethod } from '@/data/types';
import { useData } from '@/store/data';

const PICKUP_OPTIONS: { key: PickupMethod; label: string; detail: string }[] = [
  { key: 'store', label: 'Pick up in store', detail: `${pharmacy.name} - ${pharmacy.branch}` },
  { key: 'delivery', label: 'Home delivery', detail: 'Usually 1–2 business days' },
];

export default function OrderScreen() {
  const { ids = '' } = useLocalSearchParams<{ ids: string }>();
  const { state, placeOrder } = useData();
  const meds = state.medications.filter((m) => ids.split(',').includes(m.id));

  const [pickup, setPickup] = useState<PickupMethod>('store');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setSubmitting(true);
    setError(null);
    try {
      const order = await placeOrder({
        patientId: meds[0].patientId,
        medicationIds: meds.map((m) => m.id),
        pickup,
        note: note.trim() || undefined,
      });
      router.replace({ pathname: '/meds/order-confirmed', params: { orderId: order.id } });
    } catch {
      setError('Could not submit your order. Please try again.');
      setSubmitting(false);
    }
  }

  if (!meds.length) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>No medications selected.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.section}>Prescriptions to refill</Text>
      <Card>
        {meds.map((m, i) => (
          <View key={m.id} style={[styles.medRow, i > 0 && styles.divider]}>
            <MaterialCommunityIcons name="pill" size={20} color={Colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.medName}>{m.name}</Text>
              <Text style={styles.muted}>Rx: {m.rxNumber}</Text>
            </View>
          </View>
        ))}
      </Card>

      <Text style={styles.section}>How would you like to get it?</Text>
      {PICKUP_OPTIONS.map((opt) => {
        const active = pickup === opt.key;
        return (
          <Pressable
            key={opt.key}
            onPress={() => setPickup(opt.key)}
            accessibilityRole="radio"
            accessibilityState={{ checked: active }}
            style={[styles.option, active && styles.optionActive]}>
            <MaterialCommunityIcons
              name={active ? 'radiobox-marked' : 'radiobox-blank'}
              size={22}
              color={active ? Colors.primary : Colors.textMuted}
            />
            <View>
              <Text style={styles.medName}>{opt.label}</Text>
              <Text style={styles.muted}>{opt.detail}</Text>
            </View>
          </Pressable>
        );
      })}

      <Text style={styles.section}>Note for the pharmacist (optional)</Text>
      <TextInput
        style={styles.note}
        value={note}
        onChangeText={setNote}
        placeholder="e.g. Please call when ready"
        placeholderTextColor={Colors.textMuted}
        multiline
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <Button
        title={`Submit order (${meds.length})`}
        loading={submitting}
        onPress={submit}
        style={{ marginTop: Spacing.xl }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  section: {
    fontSize: FontSize.label,
    fontWeight: '600',
    color: Colors.text,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  medRow: { flexDirection: 'row', gap: Spacing.md, paddingVertical: Spacing.sm },
  divider: { borderTopWidth: 1, borderTopColor: Colors.border },
  medName: { fontSize: FontSize.label, color: Colors.text, fontWeight: '500' },
  muted: { fontSize: FontSize.body, color: Colors.textMuted },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    marginBottom: Spacing.sm,
  },
  optionActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  note: {
    minHeight: 80,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    fontSize: FontSize.label,
    color: Colors.text,
    textAlignVertical: 'top',
  },
  error: { color: Colors.danger, marginTop: Spacing.md },
});
