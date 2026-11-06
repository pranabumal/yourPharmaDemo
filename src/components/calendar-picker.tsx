import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, FontSize, Spacing } from '@/constants/theme';
import { formatMonth } from '@/utils/format';

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

type Props = {
  selected: Date | null;
  onSelect: (day: Date) => void;
  isAvailable: (day: Date) => boolean;
};

/** Month grid. Days with free slots get a blue background; the chosen day is solid blue. */
export function CalendarPicker({ selected, onSelect, isAvailable }: Props) {
  const today = new Date();
  const [month, setMonth] = useState(
    () => new Date((selected ?? today).getFullYear(), (selected ?? today).getMonth(), 1),
  );

  const isCurrentMonth =
    month.getFullYear() === today.getFullYear() && month.getMonth() === today.getMonth();
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells: (Date | null)[] = [
    ...Array<null>(month.getDay()).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1)),
  ];

  const shift = (delta: number) =>
    setMonth(new Date(month.getFullYear(), month.getMonth() + delta, 1));

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.month}>{formatMonth(month)}</Text>
        <View style={styles.arrows}>
          <Pressable
            onPress={() => shift(-1)}
            disabled={isCurrentMonth}
            hitSlop={10}
            accessibilityLabel="Previous month">
            <Ionicons name="chevron-back" size={22} color={isCurrentMonth ? Colors.border : Colors.text} />
          </Pressable>
          <Pressable onPress={() => shift(1)} hitSlop={10} accessibilityLabel="Next month">
            <Ionicons name="chevron-forward" size={22} color={Colors.text} />
          </Pressable>
        </View>
      </View>

      <View style={styles.grid}>
        {WEEKDAYS.map((w) => (
          <Text key={w} style={[styles.cell, styles.weekday]}>
            {w}
          </Text>
        ))}
        {cells.map((day, i) => {
          if (!day) return <View key={`empty-${i}`} style={styles.cell} />;
          const available = isAvailable(day);
          const isSelected = selected?.toDateString() === day.toDateString();
          const isToday = today.toDateString() === day.toDateString();
          return (
            <View key={day.toISOString()} style={styles.cell}>
              <Pressable
                disabled={!available}
                onPress={() => onSelect(day)}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected, disabled: !available }}
                accessibilityLabel={day.toDateString()}
                style={[styles.day, available && styles.available, isSelected && styles.selected]}>
                <Text
                  style={[
                    styles.dayText,
                    !available && styles.unavailableText,
                    isSelected && styles.selectedText,
                  ]}>
                  {day.getDate()}
                </Text>
                {isToday && <View style={[styles.todayDot, isSelected && { backgroundColor: Colors.white }]} />}
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: Spacing.sm,
  },
  month: { fontSize: FontSize.title, color: Colors.text },
  arrows: { flexDirection: 'row', gap: Spacing.lg },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: `${100 / 7}%`, alignItems: 'center', paddingVertical: 3 },
  weekday: { fontSize: 11, color: Colors.textMuted, paddingVertical: 6 },
  day: { width: 40, height: 40, borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
  available: { backgroundColor: Colors.primaryLight },
  selected: { backgroundColor: Colors.link },
  dayText: { fontSize: FontSize.label, color: Colors.text },
  unavailableText: { color: '#B8BEC6' },
  selectedText: { color: Colors.white, fontWeight: '600' },
  todayDot: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.text,
  },
});
