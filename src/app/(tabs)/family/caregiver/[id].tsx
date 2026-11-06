import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { useData } from '@/store/data';
import { formatLongDate } from '@/utils/format';

const PERMISSIONS = [
  'View your medications and prescription history',
  'Order refills for you',
  'Book and manage your appointments',
  'Message the pharmacy on your behalf',
];

export default function CaregiverRequestScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, approveCaregiver, removeCaregiver } = useData();
  const caregiver = state.caregivers.find((c) => c.id === id);

  if (!caregiver) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>This request is no longer available.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card>
        <Text style={styles.name}>{caregiver.name}</Text>
        <Text style={styles.muted}>{caregiver.email}</Text>
        <Text style={[styles.muted, { marginTop: Spacing.sm }]}>
          Requested on {formatLongDate(caregiver.date)}
        </Text>
      </Card>

      <Text style={styles.section}>If you approve, {caregiver.name.split(' ')[0]} can:</Text>
      {PERMISSIONS.map((p) => (
        <View key={p} style={styles.permission}>
          <MaterialCommunityIcons name="check" size={18} color={Colors.success} />
          <Text style={styles.body}>{p}</Text>
        </View>
      ))}
      <Text style={[styles.muted, { marginTop: Spacing.md }]}>
        You can revoke access at any time from the Caregivers tab.
      </Text>

      <Button
        title="Approve request"
        style={{ marginTop: Spacing.xl }}
        onPress={() => {
          approveCaregiver(caregiver.id);
          router.back();
        }}
      />
      <Pressable
        style={styles.decline}
        onPress={() => {
          removeCaregiver(caregiver.id);
          router.back();
        }}>
        <Text style={styles.declineText}>Decline</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: FontSize.title, fontWeight: '600', color: Colors.text },
  muted: { fontSize: FontSize.body, color: Colors.textMuted },
  section: {
    fontSize: FontSize.label,
    fontWeight: '600',
    color: Colors.text,
    marginTop: Spacing.xl,
    marginBottom: Spacing.sm,
  },
  permission: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: 4 },
  body: { flex: 1, fontSize: FontSize.body, color: Colors.text },
  decline: { alignItems: 'center', padding: Spacing.lg },
  declineText: { color: Colors.danger, fontSize: FontSize.body, fontWeight: '500' },
});
