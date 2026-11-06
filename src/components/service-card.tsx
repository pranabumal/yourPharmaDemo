import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useState, type ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/card';
import { IconLine } from '@/components/status-line';
import { Colors, FontSize, Radius, Spacing } from '@/constants/theme';
import type { Service } from '@/data/types';
import { formatShortAppointment } from '@/utils/format';

type Props = { service: Service; nextSlot?: string; onFindTime: () => void };

export function ServiceCard({ service, nextSlot, onFindTime }: Props) {
  const [expanded, setExpanded] = useState(false);
  const bookable = service.available && !!nextSlot;

  return (
    <Card style={styles.card}>
      <View style={styles.top}>
        <View style={styles.flex}>
          <Text style={styles.name}>{service.name}</Text>
          <Text style={styles.description} numberOfLines={expanded ? undefined : 2}>
            {service.description}
          </Text>
          <Pressable onPress={() => setExpanded((v) => !v)} hitSlop={6}>
            <Text style={styles.link}>{expanded ? 'Show less' : 'Learn more'}</Text>
          </Pressable>
        </View>
        <MaterialCommunityIcons
          name={service.icon as ComponentProps<typeof MaterialCommunityIcons>['name']}
          size={52}
          color={Colors.primary}
        />
      </View>

      <View style={styles.bottom}>
        <View>
          <Text style={styles.label}>Next available</Text>
          <IconLine
            icon="calendar-blank-outline"
            text={bookable ? formatShortAppointment(nextSlot) : 'Currently not available'}
          />
        </View>
        {bookable && (
          <Pressable style={styles.button} onPress={onFindTime} accessibilityRole="button">
            <Text style={styles.buttonText}>Find a time</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.text} />
          </Pressable>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: Spacing.md },
  flex: { flex: 1 },
  top: { flexDirection: 'row', gap: Spacing.md },
  name: { fontSize: FontSize.label, fontWeight: '600', color: Colors.link },
  description: { fontSize: FontSize.body, color: Colors.text, marginTop: 4, lineHeight: 19 },
  link: { color: Colors.link, fontSize: FontSize.small, marginTop: 4 },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: Spacing.md,
  },
  label: { fontSize: FontSize.body, fontWeight: '600', color: Colors.text },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.text,
    borderRadius: Radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  buttonText: { fontSize: FontSize.body, color: Colors.text },
});
