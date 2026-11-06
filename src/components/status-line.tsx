import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Colors, FontSize } from '@/constants/theme';
import type { RefillStatus, RefillStatusKind } from '@/utils/refill-status';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

const LOOK: Record<RefillStatusKind, { icon: IconName; color: string }> = {
  'past-due': { icon: 'alert-circle-outline', color: Colors.warning },
  auto: { icon: 'autorenew', color: Colors.success },
  due: { icon: 'calendar-clock', color: Colors.textMuted },
  ordered: { icon: 'progress-clock', color: Colors.primary },
  ready: { icon: 'check-circle-outline', color: Colors.success },
  none: { icon: 'minus', color: Colors.textMuted },
};

export function StatusLine({ status }: { status: RefillStatus }) {
  if (status.kind === 'none') return null;
  const { icon, color } = LOOK[status.kind];
  return <IconLine icon={icon} color={color} text={status.label} />;
}

/** Small icon + text row, e.g. "📅 Last filled: 10/20/2025". */
export function IconLine({
  icon,
  text,
  color = Colors.textMuted,
}: {
  icon: IconName;
  text: string;
  color?: string;
}) {
  return (
    <View style={styles.row}>
      <MaterialCommunityIcons name={icon} size={16} color={color} />
      <Text style={[styles.text, { color }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  text: { fontSize: FontSize.body },
});
