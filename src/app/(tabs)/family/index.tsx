import { useState } from 'react';
import { View } from 'react-native';

import { SegmentedTabs } from '@/components/segmented-tabs';
import { CaregiversList } from '@/features/family/caregivers-list';
import { PatientsList } from '@/features/family/patients-list';

type Tab = 'patients' | 'caregivers';

const TABS: { key: Tab; label: string }[] = [
  { key: 'patients', label: 'Patients under care' },
  { key: 'caregivers', label: 'Caregivers' },
];

export default function FamilyScreen() {
  const [tab, setTab] = useState<Tab>('patients');
  return (
    <View style={{ flex: 1 }}>
      <SegmentedTabs tabs={TABS} value={tab} onChange={setTab} />
      {tab === 'patients' ? <PatientsList /> : <CaregiversList />}
    </View>
  );
}
