import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { patients, pharmacy } from '@/data/mock';
import { useData } from '@/store/data';
import { ageInYears, formatDate, fullName } from '@/utils/format';

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

export default function PatientDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { selectPatient } = useData();
  const patient = patients.find((p) => p.id === id);

  if (!patient) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>Patient not found.</Text>
      </View>
    );
  }

  // Switch the app to this person, then open another tab.
  const openFor = (href: '/meds' | '/appointments' | '/messages/new') => {
    selectPatient(patient.id);
    router.navigate(href);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card>
        <Text style={styles.name}>{fullName(patient)}</Text>
        <Row label="Date of birth" value={formatDate(patient.dob)} />
        <Row label="Age" value={`${ageInYears(patient.dob)} years`} />
        <Row label="Relationship" value={patient.relation === 'child' ? 'Child' : 'Adult family member'} />
        <Row label="Pharmacy" value={`${pharmacy.name} - ${pharmacy.branch}`} />
      </Card>

      <Text style={styles.section}>Manage care for {patient.firstName}</Text>
      <Button title="View medications" onPress={() => openFor('/meds')} />
      <Button
        title="Book an appointment"
        variant="outline"
        style={styles.gap}
        onPress={() => openFor('/appointments')}
      />
      <Button
        title={`Message the pharmacy about ${patient.firstName}`}
        variant="outline"
        style={styles.gap}
        onPress={() => openFor('/messages/new')}
      />
      <Button
        title="View submitted forms"
        variant="outline"
        style={styles.gap}
        onPress={() =>
          router.push({ pathname: '/family/forms/[patientId]', params: { patientId: patient.id } })
        }
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  muted: { color: Colors.textMuted },
  name: { fontSize: FontSize.heading, color: Colors.text, marginBottom: Spacing.md },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  label: { fontSize: FontSize.body, color: Colors.textMuted },
  value: { fontSize: FontSize.body, color: Colors.text, fontWeight: '500' },
  section: {
    fontSize: FontSize.label,
    fontWeight: '600',
    color: Colors.text,
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  gap: { marginTop: Spacing.md },
});
