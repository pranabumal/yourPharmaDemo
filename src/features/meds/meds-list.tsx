import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { MedCard } from '@/components/med-card';
import { PatientPicker } from '@/components/patient-picker';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { pharmacy } from '@/data/mock';
import { usePullToRefresh } from '@/hooks/use-pull-to-refresh';
import { useData } from '@/store/data';
import { canOrder, refillStatus } from '@/utils/refill-status';

export function MedsList() {
  const { state, currentPatientId, selectPatient, setArchived } = useData();
  const refreshControl = usePullToRefresh();
  const [selected, setSelected] = useState<string[]>([]);
  const [newestFirst, setNewestFirst] = useState(true);

  const meds = state.medications
    .filter((m) => m.patientId === currentPatientId && !m.archived)
    .sort((a, b) => {
      const diff = new Date(b.lastFilled).getTime() - new Date(a.lastFilled).getTime();
      return newestFirst ? diff : -diff;
    });

  // Ignore selections that can no longer be ordered (archived or already ordered).
  const orderable = selected.filter((id) => {
    const med = meds.find((m) => m.id === id);
    return med && canOrder(med, state.orders);
  });

  function toggle(id: string) {
    setSelected((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  }

  function changePatient(id: string) {
    selectPatient(id);
    setSelected([]);
  }

  const header = (
    <View style={styles.header}>
      <View style={styles.location}>
        <Ionicons name="location-outline" size={16} color={Colors.textMuted} />
        <Text style={styles.muted}>
          {pharmacy.name} - {pharmacy.branch}
        </Text>
      </View>

      <Text style={styles.label}>Viewing medications for:</Text>
      <PatientPicker value={currentPatientId} onChange={changePatient} />

      <View style={styles.tools}>
        <Pressable style={styles.tool} onPress={() => setNewestFirst((v) => !v)}>
          <Ionicons name={newestFirst ? 'caret-down' : 'caret-up'} size={12} color={Colors.link} />
          <Text style={styles.toolText}>Last filled date</Text>
        </Pressable>
        <Pressable style={styles.tool} onPress={() => router.push('/meds/add')}>
          <Ionicons name="add" size={18} color={Colors.link} />
          <Text style={styles.toolText}>Add meds</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.flex}>
      <FlatList
        refreshControl={refreshControl}
        data={meds}
        keyExtractor={(m) => m.id}
        ListHeaderComponent={header}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No active medications.</Text>}
        renderItem={({ item }) => {
          const orderableNow = canOrder(item, state.orders);
          return (
            <MedCard
              med={item}
              status={refillStatus(item, state.orders)}
              onPress={() => router.push({ pathname: '/meds/[id]', params: { id: item.id } })}
              selection={{
                checked: orderable.includes(item.id),
                disabled: !orderableNow,
                onToggle: () => toggle(item.id),
              }}
              action={
                item.autoRefill ? undefined : { label: 'Archive', onPress: () => setArchived(item.id, true) }
              }
            />
          );
        }}
      />

      <View style={styles.footer}>
        <Button
          title={orderable.length ? `Order (${orderable.length})` : 'Order'}
          disabled={!orderable.length}
          onPress={() =>
            router.push({ pathname: '/meds/order', params: { ids: orderable.join(',') } })
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  list: { padding: Spacing.lg, paddingBottom: 100 },
  header: { marginBottom: Spacing.md },
  location: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: Spacing.md },
  muted: { color: Colors.textMuted, fontSize: FontSize.body },
  label: { color: Colors.text, fontSize: FontSize.body, marginBottom: Spacing.sm },
  tools: { flexDirection: 'row', justifyContent: 'flex-end', gap: Spacing.lg, marginTop: Spacing.md },
  tool: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  toolText: { color: Colors.link, fontSize: FontSize.body },
  empty: { textAlign: 'center', color: Colors.textMuted, marginTop: Spacing.xl },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: Spacing.lg,
    backgroundColor: Colors.background,
  },
});
