import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppointmentCard } from '@/components/appointment-card';
import { SegmentedTabs } from '@/components/segmented-tabs';
import { ServiceCard } from '@/components/service-card';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { nextAvailable } from '@/data/availability';
import { pharmacy, services } from '@/data/mock';
import { usePullToRefresh } from '@/hooks/use-pull-to-refresh';
import { useData } from '@/store/data';

type Tab = 'upcoming' | 'past';

const TABS: { key: Tab; label: string }[] = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'past', label: 'Past' },
];

export default function AppointmentsScreen() {
  const [tab, setTab] = useState<Tab>('upcoming');
  const { state } = useData();
  const refreshControl = usePullToRefresh();
  const now = new Date().toISOString();

  const upcoming = state.appointments
    .filter((a) => !a.cancelled && a.at >= now)
    .sort((a, b) => a.at.localeCompare(b.at));
  const past = state.appointments
    .filter((a) => a.cancelled || a.at < now)
    .sort((a, b) => b.at.localeCompare(a.at));

  const open = (id: string) => router.push({ pathname: '/appointments/[id]', params: { id } });

  return (
    <View style={styles.flex}>
      <SegmentedTabs tabs={TABS} value={tab} onChange={setTab} />

      <ScrollView contentContainerStyle={styles.container} refreshControl={refreshControl}>
        {tab === 'upcoming' ? (
          <>
            {upcoming.length === 0 && <Text style={styles.empty}>No upcoming appointments.</Text>}
            {upcoming.map((a) => (
              <AppointmentCard key={a.id} appointment={a} onPress={() => open(a.id)} />
            ))}

            <Text style={styles.heading}>Make an appointment</Text>
            <Text style={styles.sub}>
              {pharmacy.name} - {pharmacy.branch}
            </Text>
            {services.map((s) => (
              <ServiceCard
                key={s.id}
                service={s}
                nextSlot={nextAvailable(s, state.appointments)}
                onFindTime={() =>
                  router.push({ pathname: '/appointments/book/[serviceId]', params: { serviceId: s.id } })
                }
              />
            ))}

            <Text style={styles.heading}>Don&apos;t see what you need?</Text>
            <Pressable onPress={() => router.navigate('/messages/new')}>
              <Text style={styles.sub}>
                Contact the pharmacy for further assistance with booking your appointment.{' '}
                <Text style={styles.link}>Send a message</Text>
              </Text>
            </Pressable>
          </>
        ) : (
          <>
            {past.length === 0 && <Text style={styles.empty}>No past appointments.</Text>}
            {past.map((a) => (
              <AppointmentCard key={a.id} appointment={a} past onPress={() => open(a.id)} />
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  heading: { fontSize: FontSize.title, fontWeight: '600', color: Colors.text, marginTop: Spacing.lg },
  sub: { fontSize: FontSize.body, color: Colors.textMuted, marginTop: 2, marginBottom: Spacing.md },
  link: { color: Colors.link },
  empty: { textAlign: 'center', color: Colors.textMuted, marginVertical: Spacing.lg },
});
