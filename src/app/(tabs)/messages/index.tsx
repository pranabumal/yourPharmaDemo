import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, SectionList, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { TopicIcon } from '@/components/topic-icon';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { patients, pharmacy } from '@/data/mock';
import type { Thread } from '@/data/types';
import { useData } from '@/store/data';
import { formatDate, fullName } from '@/utils/format';

const lastAt = (t: Thread) => t.messages[t.messages.length - 1]?.at ?? '';

export default function MessagesScreen() {
  const { state } = useData();

  // One section per person, newest conversation first; people with no messages are skipped.
  const sections = patients
    .map((p) => ({
      title: p.relation === 'self' ? 'Me' : fullName(p),
      data: state.threads
        .filter((t) => t.patientId === p.id)
        .sort((a, b) => lastAt(b).localeCompare(lastAt(a))),
    }))
    .filter((s) => s.data.length > 0);

  return (
    <View style={styles.flex}>
      <SectionList
        sections={sections}
        keyExtractor={(t) => t.id}
        contentContainerStyle={styles.list}
        stickySectionHeadersEnabled={false}
        ListHeaderComponent={
          <View style={styles.intro}>
            <Text style={styles.muted}>You are chatting with:</Text>
            <View style={styles.location}>
              <Ionicons name="location-outline" size={16} color={Colors.textMuted} />
              <Text style={styles.muted}>
                {pharmacy.name} - {pharmacy.branch}
              </Text>
            </View>
          </View>
        }
        renderSectionHeader={({ section }) => <Text style={styles.section}>{section.title}</Text>}
        renderItem={({ item }) => (
          <Pressable
            style={styles.row}
            onPress={() =>
              router.push({ pathname: '/chat/[threadId]', params: { threadId: item.id } })
            }>
            <View style={[styles.dot, !item.unread && { opacity: 0 }]} />
            <TopicIcon topic={item.topic} />
            <Text style={[styles.subject, item.unread && styles.unread]} numberOfLines={1}>
              {item.subject}
            </Text>
            <Text style={[styles.date, item.unread && styles.unread]}>
              {formatDate(lastAt(item))}
            </Text>
          </Pressable>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No messages yet.</Text>}
      />

      <View style={styles.footer}>
        <Button title="New message" onPress={() => router.push('/messages/new')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  list: { padding: Spacing.lg, paddingBottom: 100 },
  intro: { marginBottom: Spacing.sm },
  location: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  muted: { fontSize: FontSize.body, color: Colors.textMuted },
  section: {
    fontSize: FontSize.title,
    color: Colors.text,
    marginTop: Spacing.lg,
    paddingBottom: 6,
    marginBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#9AA5B1',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: 8 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.link },
  subject: { flex: 1, fontSize: FontSize.body, color: Colors.text },
  unread: { fontWeight: '700' },
  date: { fontSize: FontSize.small, color: Colors.text },
  empty: { textAlign: 'center', color: Colors.textMuted, marginTop: Spacing.xl },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: Spacing.lg,
    backgroundColor: Colors.background,
  },
});
