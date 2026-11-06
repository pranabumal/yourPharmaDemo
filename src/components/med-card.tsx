import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/card';
import { Checkbox } from '@/components/checkbox';
import { IconLine, StatusLine } from '@/components/status-line';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import type { Medication } from '@/data/types';
import { formatDate } from '@/utils/format';
import type { RefillStatus } from '@/utils/refill-status';

type Props = {
  med: Medication;
  status: RefillStatus;
  onPress: () => void;
  /** Shown when the med can be selected for an order. */
  selection?: { checked: boolean; disabled: boolean; onToggle: () => void };
  action?: { label: string; onPress: () => void };
};

export function MedCard({ med, status, onPress, selection, action }: Props) {
  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        {selection && (
          <View style={styles.check}>
            <Checkbox
              checked={selection.checked}
              disabled={selection.disabled}
              onToggle={selection.onToggle}
              label={`Select ${med.name}`}
            />
          </View>
        )}

        <Pressable style={styles.body} onPress={onPress} accessibilityRole="button">
          <View style={styles.titleRow}>
            <Text style={styles.name}>{med.name}</Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </View>
          <Text style={styles.rx}>
            Rx: {med.rxNumber}
            {med.enteredManually ? ' (Entered manually)' : ''}
          </Text>
          <StatusLine status={status} />
          <IconLine icon="calendar-blank-outline" text={`Last filled: ${formatDate(med.lastFilled)}`} />
        </Pressable>
      </View>

      {action && (
        <Pressable onPress={action.onPress} hitSlop={8} style={styles.action}>
          <Text style={styles.actionText}>{action.label}</Text>
        </Pressable>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: Spacing.md, paddingVertical: Spacing.md },
  row: { flexDirection: 'row' },
  check: { marginRight: Spacing.md, paddingTop: 1 },
  body: { flex: 1 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { flex: 1, fontSize: FontSize.label, fontWeight: '600', color: Colors.text },
  rx: { fontSize: FontSize.body, color: Colors.textMuted, marginTop: 2 },
  action: { marginTop: Spacing.sm, alignSelf: 'flex-start' },
  actionText: { color: Colors.link, fontSize: FontSize.body, fontWeight: '500' },
});
