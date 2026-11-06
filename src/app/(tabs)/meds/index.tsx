import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { SegmentedTabs } from '@/components/segmented-tabs';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { patients } from '@/data/mock';
import { ArchiveList } from '@/features/meds/archive-list';
import { MedsList } from '@/features/meds/meds-list';
import { OrdersList } from '@/features/meds/orders-list';
import { useData } from '@/store/data';
import { fullName } from '@/utils/format';

type Tab = 'meds' | 'orders' | 'archive';

const TABS: { key: Tab; label: string }[] = [
  { key: 'meds', label: 'Meds' },
  { key: 'orders', label: 'Orders' },
  { key: 'archive', label: 'Archive' },
];

export default function MedsScreen() {
  const [tab, setTab] = useState<Tab>('meds');
  const { currentPatientId } = useData();
  const patient = patients.find((p) => p.id === currentPatientId);

  return (
    <View style={styles.flex}>
      <SegmentedTabs tabs={TABS} value={tab} onChange={setTab} />
      {tab !== 'meds' && patient && (
        <Text style={styles.viewing}>
          Showing {tab} for {patient.relation === 'self' ? 'myself' : fullName(patient)}
        </Text>
      )}
      {tab === 'meds' && <MedsList />}
      {tab === 'orders' && <OrdersList />}
      {tab === 'archive' && <ArchiveList />}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  viewing: {
    fontSize: FontSize.small,
    color: Colors.textMuted,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
});
