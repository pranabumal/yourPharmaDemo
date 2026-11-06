import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/card';
import { IconLine } from '@/components/status-line';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { patients, pharmacy, services } from '@/data/mock';
import type { Appointment } from '@/data/types';
import { formatAppointment, fullName } from '@/utils/format';

export const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${pharmacy.coords.latitude},${pharmacy.coords.longitude}`;

type Props = { appointment: Appointment; onPress: () => void; past?: boolean };

export function AppointmentCard({ appointment, onPress, past }: Props) {
  const service = services.find((s) => s.id === appointment.serviceId);
  const patient = patients.find((p) => p.id === appointment.patientId);

  return (
    <Card style={styles.card}>
      <Pressable style={styles.row} onPress={onPress} accessibilityRole="button">
        <MaterialCommunityIcons name="calendar-blank-outline" size={32} color={Colors.textMuted} />
        <View style={styles.body}>
          <View style={styles.titleRow}>
            <Text style={styles.date}>{formatAppointment(appointment.at)}</Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </View>
          <Text style={styles.service}>{service?.name}</Text>
          {patient && patient.relation !== 'self' && (
            <Text style={styles.muted}>For {fullName(patient)}</Text>
          )}
          {appointment.cancelled ? (
            <IconLine icon="close-circle-outline" text="Cancelled" color={Colors.danger} />
          ) : past ? (
            <IconLine icon="check-circle-outline" text="Completed" />
          ) : appointment.checklistComplete ? (
            <IconLine icon="check-circle-outline" text="Checklist completed" color={Colors.success} />
          ) : (
            <IconLine icon="alert-circle-outline" text="Checklist needed" color={Colors.warning} />
          )}
          <Text style={[styles.muted, { marginTop: 4 }]}>
            {pharmacy.name} - {pharmacy.branch}
          </Text>
        </View>
      </Pressable>

      {!past && !appointment.cancelled && (
        <View style={styles.links}>
          <Pressable onPress={() => Linking.openURL(`tel:${pharmacy.phone}`)} hitSlop={8}>
            <Text style={styles.link}>{pharmacy.phone}</Text>
          </Pressable>
          <Pressable style={styles.linkRow} onPress={() => Linking.openURL(directionsUrl)} hitSlop={8}>
            <Ionicons name="location-outline" size={16} color={Colors.link} />
            <Text style={styles.link}>Get directions</Text>
          </Pressable>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: Spacing.md },
  row: { flexDirection: 'row', gap: Spacing.md },
  body: { flex: 1 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  date: { fontSize: FontSize.label, color: Colors.text, fontWeight: '500' },
  service: { fontSize: FontSize.body, color: Colors.text, fontWeight: '600', marginTop: 2 },
  muted: { fontSize: FontSize.body, color: Colors.textMuted },
  links: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
    paddingLeft: 44,
  },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  link: { color: Colors.link, fontSize: FontSize.body },
});
