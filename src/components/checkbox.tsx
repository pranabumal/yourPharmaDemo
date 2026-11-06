import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable } from 'react-native';

import { Colors } from '@/constants/theme';

type Props = {
  checked: boolean;
  onToggle: () => void;
  disabled?: boolean;
  label: string; // for screen readers
};

export function Checkbox({ checked, onToggle, disabled, label }: Props) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      accessibilityLabel={label}
      onPress={onToggle}
      disabled={disabled}
      hitSlop={10}>
      <MaterialCommunityIcons
        name={checked ? 'checkbox-marked' : 'checkbox-blank-outline'}
        size={24}
        color={disabled ? Colors.border : checked ? Colors.primary : Colors.textMuted}
      />
    </Pressable>
  );
}
