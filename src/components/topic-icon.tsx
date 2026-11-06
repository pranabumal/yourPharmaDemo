import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ComponentProps } from 'react';
import { StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/theme';
import type { ThreadTopic } from '@/data/types';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export const TOPICS: { key: ThreadTopic; label: string; icon: IconName; subject: string }[] = [
  { key: 'refill', label: 'Refill', icon: 'pill', subject: 'Question about a refill' },
  { key: 'prescription', label: 'Prescription', icon: 'clipboard-text-outline', subject: 'Question about a prescription' },
  { key: 'appointment', label: 'Appointment', icon: 'calendar-blank-outline', subject: 'Question about an appointment' },
  { key: 'question', label: 'Other', icon: 'chat-question-outline', subject: 'General question' },
];

export function TopicIcon({ topic }: { topic: ThreadTopic }) {
  const icon = TOPICS.find((t) => t.key === topic)?.icon ?? 'chat-outline';
  return (
    <View style={styles.circle}>
      <MaterialCommunityIcons name={icon} size={18} color={Colors.white} />
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#9AA5B1',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
