import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { IconLine } from '@/components/status-line';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { pharmacy } from '@/data/mock';
import type { Caregiver } from '@/data/types';
import { usePullToRefresh } from '@/hooks/use-pull-to-refresh';
import { useData } from '@/store/data';
import { formatLongDate } from '@/utils/format';

function CaregiverCard({ caregiver }: { caregiver: Caregiver }) {
  const { removeCaregiver } = useData();

  function confirmRemove(title: string, message: string, action: string) {
    Alert.alert(title, message, [
      { text: 'Cancel', style: 'cancel' },
      { text: action, style: 'destructive', onPress: () => removeCaregiver(caregiver.id) },
    ]);
  }

  const action =
    caregiver.status === 'authorized' ? (
      <Pressable
        hitSlop={10}
        onPress={() =>
          confirmRemove(
            'Revoke access?',
            `${caregiver.name} will no longer be able to see or manage your records.`,
            'Revoke',
          )
        }>
        <Text style={[styles.action, { color: Colors.danger }]}>Revoke access</Text>
      </Pressable>
    ) : caregiver.status === 'pending' ? (
      <Pressable
        hitSlop={10}
        onPress={() =>
          router.push({ pathname: '/family/caregiver/[id]', params: { id: caregiver.id } })
        }>
        <Text style={styles.action}>Review request…</Text>
      </Pressable>
    ) : (
      <Pressable
        hitSlop={10}
        onPress={() =>
          confirmRemove('Cancel invitation?', `${caregiver.email} will not be able to accept it.`, 'Cancel invite')
        }>
        <Text style={styles.action}>Cancel invite</Text>
      </Pressable>
    );

  return (
    <Card style={styles.card}>
      <View style={styles.top}>
        <Text style={styles.name}>{caregiver.name}</Text>
        {action}
      </View>
      <Text style={styles.email}>{caregiver.email}</Text>
      {caregiver.status === 'authorized' && (
        <IconLine icon="calendar-blank-outline" text={`Authorized on ${formatLongDate(caregiver.date)}`} />
      )}
      {caregiver.status === 'pending' && (
        <IconLine
          icon="calendar-blank-outline"
          text={`Pending: submitted on ${formatLongDate(caregiver.date)}`}
          color={Colors.warning}
        />
      )}
      {caregiver.status === 'invited' && (
        <IconLine
          icon="email-outline"
          text={`Invitation sent on ${formatLongDate(caregiver.date)}`}
          color={Colors.primary}
        />
      )}
    </Card>
  );
}

export function CaregiversList() {
  const refreshControl = usePullToRefresh();
  const { state } = useData();

  return (
    <ScrollView contentContainerStyle={styles.container} refreshControl={refreshControl}>
      <Text style={styles.heading}>Caregivers</Text>
      <View style={styles.location}>
        <Ionicons name="location-outline" size={16} color={Colors.textMuted} />
        <Text style={styles.muted}>
          {pharmacy.name} - {pharmacy.branch}
        </Text>
      </View>
      <Text style={[styles.muted, { marginBottom: Spacing.lg }]}>
        Caregivers can view your medications, order refills, book appointments, and message the
        pharmacy for you.
      </Text>

      {state.caregivers.length === 0 && <Text style={styles.empty}>No caregivers yet.</Text>}
      {state.caregivers.map((c) => (
        <CaregiverCard key={c.id} caregiver={c} />
      ))}

      <Button
        title="Invite a caregiver"
        variant="outline"
        onPress={() => router.push('/family/invite')}
        style={{ marginTop: Spacing.md }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  heading: { fontSize: FontSize.title, fontWeight: '600', color: Colors.text },
  location: { flexDirection: 'row', alignItems: 'center', gap: 4, marginVertical: Spacing.sm },
  muted: { fontSize: FontSize.body, color: Colors.textMuted },
  card: { marginBottom: Spacing.md },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: FontSize.label, color: Colors.text },
  email: { fontSize: FontSize.small, color: Colors.text, marginTop: 2 },
  action: { fontSize: FontSize.body, color: Colors.link },
  empty: { textAlign: 'center', color: Colors.textMuted, marginVertical: Spacing.lg },
});
