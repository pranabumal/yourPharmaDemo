import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { directionsUrl } from '@/components/appointment-card';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { PharmacyMap } from '@/components/pharmacy-map';
import { IconLine } from '@/components/status-line';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { patients, pharmacy, services } from '@/data/mock';
import { useData } from '@/store/data';
import { formatAppointment, fullName } from '@/utils/format';

export default function AppointmentDetailScreen() {
  const { id, booked } = useLocalSearchParams<{ id: string; booked?: string }>();
  const { state, cancelAppointment } = useData();
  const appt = state.appointments.find((a) => a.id === id);

  if (!appt) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>Appointment not found.</Text>
      </View>
    );
  }

  const service = services.find((s) => s.id === appt.serviceId);
  const patient = patients.find((p) => p.id === appt.patientId);
  const upcoming = !appt.cancelled && new Date(appt.at) > new Date();

  function confirmCancel() {
    Alert.alert('Cancel appointment?', 'This time slot will be released for other patients.', [
      { text: 'Keep it', style: 'cancel' },
      {
        text: 'Cancel appointment',
        style: 'destructive',
        onPress: () => {
          cancelAppointment(appt!.id);
          router.back();
        },
      },
    ]);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {booked && upcoming && (
        <View style={styles.banner}>
          <Ionicons name="checkmark-circle" size={22} color={Colors.success} />
          <Text style={styles.bannerText}>You&apos;re booked! We sent a confirmation to Messages.</Text>
        </View>
      )}

      <Card>
        <Text style={styles.service}>{service?.name}</Text>
        <Text style={styles.date}>{formatAppointment(appt.at)}</Text>
        {patient && <Text style={styles.muted}>For {fullName(patient)}</Text>}
        <View style={{ marginTop: Spacing.sm }}>
          <IconLine icon="clock-outline" text={`${service?.durationMin ?? 0} minutes · Central Time`} />
          {appt.cancelled && (
            <IconLine icon="close-circle-outline" text="Cancelled" color={Colors.danger} />
          )}
        </View>
      </Card>

      {upcoming && (
        <Card style={styles.gap}>
          <Text style={styles.section}>Pre-visit checklist</Text>
          {appt.checklistComplete ? (
            <IconLine icon="check-circle-outline" text="Checklist completed" color={Colors.success} />
          ) : (
            <>
              <Text style={styles.muted}>
                Answer a few health questions before your visit so we can get you in and out faster.
              </Text>
              <Button
                title="Complete checklist"
                style={{ marginTop: Spacing.md }}
                onPress={() =>
                  router.push({ pathname: '/appointments/checklist/[id]', params: { id: appt.id } })
                }
              />
            </>
          )}
        </Card>
      )}

      <Card style={styles.gap}>
        <Text style={styles.section}>Location</Text>
        <PharmacyMap pharmacy={pharmacy} height={130} />
        <Text style={styles.pharmacy}>
          {pharmacy.name} - {pharmacy.branch}
        </Text>
        <Text style={styles.muted}>{pharmacy.address1}</Text>
        <Text style={styles.muted}>{pharmacy.address2}</Text>
        <View style={styles.links}>
          <Pressable onPress={() => Linking.openURL(`tel:${pharmacy.phone}`)}>
            <Text style={styles.link}>{pharmacy.phone}</Text>
          </Pressable>
          <Pressable onPress={() => Linking.openURL(directionsUrl)}>
            <Text style={styles.link}>Get directions</Text>
          </Pressable>
        </View>
      </Card>

      {upcoming && (
        <>
          <Button
            title="Reschedule"
            variant="outline"
            style={styles.gap}
            onPress={() =>
              router.push({
                pathname: '/appointments/book/[serviceId]',
                params: { serviceId: appt.serviceId, appointmentId: appt.id },
              })
            }
          />
          <Pressable onPress={confirmCancel} style={styles.cancel}>
            <Text style={styles.cancelText}>Cancel appointment</Text>
          </Pressable>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  gap: { marginTop: Spacing.lg },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: '#E7F6EC',
    padding: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.lg,
  },
  bannerText: { flex: 1, color: Colors.text, fontSize: FontSize.body },
  service: { fontSize: FontSize.title, fontWeight: '600', color: Colors.text },
  date: { fontSize: FontSize.label, color: Colors.text, marginTop: 4 },
  muted: { fontSize: FontSize.body, color: Colors.textMuted },
  section: { fontSize: FontSize.label, fontWeight: '600', color: Colors.text, marginBottom: Spacing.sm },
  pharmacy: { fontSize: FontSize.label, fontWeight: '600', color: Colors.text, marginTop: Spacing.md },
  links: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.md },
  link: { color: Colors.link, fontSize: FontSize.body },
  cancel: { alignItems: 'center', padding: Spacing.lg },
  cancelText: { color: Colors.danger, fontSize: FontSize.body, fontWeight: '500' },
});
