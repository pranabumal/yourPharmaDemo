import { router } from 'expo-router';
import { FlatList, StyleSheet, Text } from 'react-native';

import { MedCard } from '@/components/med-card';
import { Colors, Spacing } from '@/constants/theme';
import { usePullToRefresh } from '@/hooks/use-pull-to-refresh';
import { useData } from '@/store/data';
import { refillStatus } from '@/utils/refill-status';

export function ArchiveList() {
  const { state, currentPatientId, setArchived } = useData();
  const refreshControl = usePullToRefresh();
  const meds = state.medications.filter((m) => m.patientId === currentPatientId && m.archived);

  return (
    <FlatList
      refreshControl={refreshControl}
      data={meds}
      keyExtractor={(m) => m.id}
      contentContainerStyle={styles.list}
      ListHeaderComponent={
        <Text style={styles.intro}>Archived medications are hidden from your active list.</Text>
      }
      ListEmptyComponent={<Text style={styles.empty}>No archived medications.</Text>}
      renderItem={({ item }) => (
        <MedCard
          med={item}
          status={{ ...refillStatus(item, state.orders), kind: 'none' }}
          onPress={() => router.push({ pathname: '/meds/[id]', params: { id: item.id } })}
          action={{ label: 'Restore', onPress: () => setArchived(item.id, false) }}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: Spacing.lg },
  intro: { color: Colors.textMuted, marginBottom: Spacing.md },
  empty: { textAlign: 'center', color: Colors.textMuted, marginTop: Spacing.xl },
});
