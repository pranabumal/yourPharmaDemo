import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { CalendarPicker } from '@/components/calendar-picker';
import { Card } from '@/components/card';
import { PatientPicker } from '@/components/patient-picker';
import { IconLine } from '@/components/status-line';
import { Colors, FontSize, Radius, Spacing } from '@/constants/theme';
import { nextAvailable, slotsFor } from '@/data/availability';
import { pharmacy, services } from '@/data/mock';
import { useData } from '@/store/data';
import { formatShortAppointment, formatTime } from '@/utils/format';

/** Books a new visit, or reschedules one when `appointmentId` is passed. */
export default function BookAppointmentScreen() {
  const { serviceId, appointmentId } = useLocalSearchParams<{
    serviceId: string;
    appointmentId?: string;
  }>();
  const { state, currentPatientId, bookAppointment, rescheduleAppointment } = useData();
  const service = services.find((s) => s.id === serviceId);
  const existing = state.appointments.find((a) => a.id === appointmentId);

  const [patientId, setPatientId] = useState(existing?.patientId ?? currentPatientId);
  const [day, setDay] = useState<Date | null>(() => {
    const first = service && nextAvailable(service, state.appointments);
    return first ? new Date(first) : null;
  });
  const [slot, setSlot] = useState<string | null>(null);

  if (!service) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>Service not found.</Text>
      </View>
    );
  }

  const slots = day ? slotsFor(service, day, state.appointments) : [];

  function confirm() {
    if (!slot || !service) return;
    if (existing) {
      rescheduleAppointment(existing.id, slot);
      router.back();
      return;
    }
    const id = bookAppointment({ patientId, serviceId: service.id, at: slot });
    router.replace({ pathname: '/appointments/[id]', params: { id, booked: '1' } });
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{service.name}</Text>
      <Text style={styles.description}>{service.description}</Text>

      <View style={styles.facts}>
        <IconLine icon="map-marker-outline" text={`${pharmacy.name} - ${pharmacy.branch}`} color={Colors.text} />
        <Text style={styles.address}>
          {pharmacy.address1}
          {'\n'}
          {pharmacy.address2}
        </Text>
        <IconLine icon="clock-outline" text={`${service.durationMin} Minutes`} color={Colors.text} />
        <IconLine icon="earth" text="Central Time" color={Colors.text} />
      </View>

      {!existing && (
        <>
          <Text style={styles.label}>Who is this appointment for?</Text>
          <PatientPicker value={patientId} onChange={setPatientId} />
        </>
      )}

      <Card style={styles.calendar}>
        <CalendarPicker
          selected={day}
          onSelect={(d) => {
            setDay(d);
            setSlot(null);
          }}
          isAvailable={(d) => slotsFor(service, d, state.appointments).length > 0}
        />
      </Card>

      {day && (
        <>
          <Text style={styles.label}>Available times</Text>
          <View style={styles.slots}>
            {slots.map((s) => {
              const active = s === slot;
              return (
                <Pressable
                  key={s}
                  onPress={() => setSlot(s)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: active }}
                  style={[styles.slot, active && styles.slotActive]}>
                  <Text style={[styles.slotText, active && styles.slotTextActive]}>{formatTime(s)}</Text>
                </Pressable>
              );
            })}
          </View>
        </>
      )}

      <Button
        title={
          slot
            ? `${existing ? 'Reschedule to' : 'Book'} ${formatShortAppointment(slot)}`
            : 'Choose a time'
        }
        disabled={!slot}
        onPress={confirm}
        style={{ marginTop: Spacing.xl }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  muted: { color: Colors.textMuted },
  title: { fontSize: FontSize.heading, color: Colors.text, fontWeight: '500' },
  description: { fontSize: FontSize.body, color: Colors.text, marginTop: Spacing.sm, lineHeight: 20 },
  facts: { marginTop: Spacing.md, gap: 4 },
  address: { fontSize: FontSize.body, color: Colors.textMuted, marginLeft: 22 },
  label: {
    fontSize: FontSize.label,
    fontWeight: '600',
    color: Colors.text,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  calendar: { marginTop: Spacing.lg },
  slots: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  slot: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: Radius.sm,
    paddingVertical: 8,
    width: '31%',
    alignItems: 'center',
    backgroundColor: Colors.surface,
  },
  slotActive: { backgroundColor: Colors.primary },
  slotText: { color: Colors.primary, fontSize: FontSize.body, fontWeight: '500' },
  slotTextActive: { color: Colors.white },
});
