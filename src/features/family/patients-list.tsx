import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import type { ComponentProps, ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/card';
import { IconLine } from '@/components/status-line';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { patients } from '@/data/mock';
import type { Patient } from '@/data/types';
import { usePullToRefresh } from '@/hooks/use-pull-to-refresh';
import { useData } from '@/store/data';
import { formatDate, fullName } from '@/utils/format';
import { refillStatus } from '@/utils/refill-status';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

function SummaryRow({
  icon,
  title,
  badge,
  subtitle,
  onView,
  children,
}: {
  icon: IconName;
  title: string;
  badge?: number;
  subtitle?: string;
  onView: () => void;
  children?: ReactNode;
}) {
  return (
    <View style={styles.summary}>
      <View style={styles.summaryTop}>
        <MaterialCommunityIcons name={icon} size={22} color={Colors.textMuted} />
        <View style={styles.flex}>
          <View style={styles.titleRow}>
            <Text style={styles.summaryTitle}>{title}</Text>
            {!!badge && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{badge}</Text>
              </View>
            )}
          </View>
          {subtitle && <Text style={styles.muted}>{subtitle}</Text>}
        </View>
        <Pressable onPress={onView} hitSlop={10} accessibilityLabel={`View ${title}`}>
          <Text style={styles.link}>View</Text>
        </Pressable>
      </View>
      {children}
    </View>
  );
}

function PatientCard({ patient }: { patient: Patient }) {
  const { state, selectPatient } = useData();
  const now = new Date().toISOString();

  const nextAppt = state.appointments
    .filter((a) => a.patientId === patient.id && !a.cancelled && a.at >= now)
    .sort((a, b) => a.at.localeCompare(b.at))[0];
  const lastForm = state.formSubmissions
    .filter((f) => f.patientId === patient.id)
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))[0];
  const meds = state.medications.filter((m) => m.patientId === patient.id && !m.archived);

  return (
    <Card style={styles.card}>
      <View style={styles.nameRow}>
        <Text style={styles.name}>{fullName(patient)}</Text>
        <Pressable
          onPress={() => router.push({ pathname: '/family/patient/[id]', params: { id: patient.id } })}
          hitSlop={10}>
          <Text style={styles.link}>Details</Text>
        </Pressable>
      </View>
      <Text style={styles.muted}>
        {formatDate(patient.dob)} ({patient.relation === 'child' ? 'Child' : 'Adult'})
      </Text>

      <View style={styles.divider} />

      <SummaryRow
        icon="calendar-blank-outline"
        title="Appointments"
        subtitle={nextAppt ? `Coming up: ${formatDate(nextAppt.at)}` : 'None upcoming'}
        onView={() => router.navigate('/appointments')}
      />
      <SummaryRow
        icon="file-document-outline"
        title="Forms"
        subtitle={lastForm ? `Last submission: ${formatDate(lastForm.submittedAt)}` : 'No forms submitted'}
        onView={() =>
          router.push({ pathname: '/family/forms/[patientId]', params: { patientId: patient.id } })
        }
      />
      <SummaryRow
        icon="medical-bag"
        title="Medications"
        badge={meds.length}
        subtitle={meds.length ? undefined : 'No active medications'}
        onView={() => {
          selectPatient(patient.id);
          router.navigate('/meds');
        }}>
        {meds.map((m) => {
          const status = refillStatus(m, state.orders);
          return (
            <Pressable
              key={m.id}
              style={styles.med}
              onPress={() => router.navigate({ pathname: '/meds/[id]', params: { id: m.id } })}>
              <View style={styles.medName}>
                <Text style={styles.medText}>{m.name}</Text>
                <Ionicons name="information-circle-outline" size={16} color={Colors.textMuted} />
              </View>
              {status.kind === 'past-due' ? (
                <IconLine icon="alert-outline" text={status.label} color={Colors.warning} />
              ) : (
                status.label !== '' && <Text style={styles.muted}>{status.label}</Text>
              )}
            </Pressable>
          );
        })}
      </SummaryRow>
    </Card>
  );
}

export function PatientsList() {
  const refreshControl = usePullToRefresh();
  const dependents = patients.filter((p) => p.relation !== 'self');

  return (
    <ScrollView contentContainerStyle={styles.container} refreshControl={refreshControl}>
      <View style={styles.headingRow}>
        <Text style={styles.heading}>Patients under your care</Text>
        <Pressable
          onPress={() => router.push('/family/add-patient')}
          hitSlop={10}
          accessibilityLabel="Add a patient">
          <Ionicons name="add" size={28} color={Colors.text} />
        </Pressable>
      </View>
      {dependents.map((p) => (
        <PatientCard key={p.id} patient={p} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  flex: { flex: 1 },
  headingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  heading: { fontSize: FontSize.title, fontWeight: '600', color: Colors.text },
  card: { marginBottom: Spacing.lg },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: FontSize.heading, color: Colors.text },
  muted: { fontSize: FontSize.body, color: Colors.textMuted },
  link: { color: Colors.link, fontSize: FontSize.body },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.md },
  summary: { paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  summaryTop: { flexDirection: 'row', gap: Spacing.md },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  summaryTitle: { fontSize: FontSize.label, color: Colors.text },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E8EBEF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  badgeText: { fontSize: FontSize.small, color: Colors.text },
  med: { marginLeft: 34, marginTop: Spacing.md },
  medName: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  medText: { fontSize: FontSize.body, fontWeight: '500', color: Colors.text },
});
