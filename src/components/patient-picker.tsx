import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, FontSize, Radius, Spacing } from '@/constants/theme';
import { patients } from '@/data/mock';
import { fullName } from '@/utils/format';

type Props = {
  value: string;
  onChange: (patientId: string) => void;
};

function patientLabel(id: string) {
  const p = patients.find((x) => x.id === id);
  if (!p) return 'Unknown';
  return p.relation === 'self' ? 'Myself' : fullName(p);
}

/** Dropdown for "Viewing medications for: Myself / Jake / Arlene". */
export function PatientPicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Pressable
        style={styles.field}
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={`Viewing records for ${patientLabel(value)}. Change`}>
        <Text style={styles.value}>{patientLabel(value)}</Text>
        <Ionicons name="chevron-down" size={20} color={Colors.textMuted} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={styles.sheet}>
            {patients.map((p) => {
              const selected = p.id === value;
              return (
                <Pressable
                  key={p.id}
                  style={styles.option}
                  onPress={() => {
                    onChange(p.id);
                    setOpen(false);
                  }}>
                  <Text style={[styles.optionText, selected && styles.selected]}>
                    {patientLabel(p.id)}
                  </Text>
                  {selected && <Ionicons name="checkmark" size={20} color={Colors.primary} />}
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  field: {
    height: 48,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  value: { fontSize: FontSize.label, color: Colors.text },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  sheet: { backgroundColor: Colors.surface, borderRadius: Radius.lg, paddingVertical: Spacing.sm },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 14,
  },
  optionText: { fontSize: FontSize.label, color: Colors.text },
  selected: { color: Colors.primary, fontWeight: '600' },
});
