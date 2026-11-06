import { FlatList, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { IconLine } from '@/components/status-line';
import { Colors, FontSize, Radius, Spacing } from '@/constants/theme';
import type { OrderStatus } from '@/data/types';
import { useData } from '@/store/data';
import { formatDate, formatTime } from '@/utils/format';

const STATUS: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  submitted: { label: 'Submitted', color: Colors.primary, bg: Colors.primaryLight },
  ready: { label: 'Ready for pickup', color: Colors.success, bg: '#E7F6EC' },
  'picked-up': { label: 'Picked up', color: Colors.textMuted, bg: '#EEF0F3' },
};

export function OrdersList() {
  const { state, currentPatientId, setOrderStatus } = useData();
  const orders = state.orders
    .filter((o) => o.patientId === currentPatientId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const medName = (id: string) => state.medications.find((m) => m.id === id)?.name ?? 'Unknown';

  return (
    <FlatList
      data={orders}
      keyExtractor={(o) => o.id}
      contentContainerStyle={styles.list}
      ListEmptyComponent={<Text style={styles.empty}>No orders yet.</Text>}
      renderItem={({ item }) => {
        const look = STATUS[item.status];
        return (
          <Card style={styles.card}>
            <View style={styles.top}>
              <Text style={styles.date}>
                {formatDate(item.createdAt)} · {formatTime(item.createdAt)}
              </Text>
              <View style={[styles.chip, { backgroundColor: look.bg }]}>
                <Text style={[styles.chipText, { color: look.color }]}>{look.label}</Text>
              </View>
            </View>

            {item.medicationIds.map((id) => (
              <Text key={id} style={styles.med}>
                • {medName(id)}
              </Text>
            ))}

            <IconLine
              icon={item.pickup === 'store' ? 'storefront-outline' : 'truck-delivery-outline'}
              text={item.pickup === 'store' ? 'Pick up in store' : 'Home delivery'}
            />
            {item.status === 'submitted' && (
              <Text style={styles.hint}>The pharmacy is preparing this order.</Text>
            )}
            {item.status === 'ready' && (
              <Button
                title="Mark as picked up"
                variant="outline"
                onPress={() => setOrderStatus(item.id, 'picked-up')}
                style={{ marginTop: Spacing.md }}
              />
            )}
          </Card>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: Spacing.lg },
  card: { marginBottom: Spacing.md },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  date: { fontSize: FontSize.body, color: Colors.textMuted },
  chip: { borderRadius: Radius.sm, paddingHorizontal: 8, paddingVertical: 3 },
  chipText: { fontSize: FontSize.small, fontWeight: '600' },
  med: { fontSize: FontSize.label, color: Colors.text, marginBottom: 2 },
  hint: { fontSize: FontSize.small, color: Colors.textMuted, marginTop: Spacing.sm },
  empty: { textAlign: 'center', color: Colors.textMuted, marginTop: Spacing.xl },
});
