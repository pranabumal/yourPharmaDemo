import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Colors, FontSize, Spacing } from '@/constants/theme';

type Props = {
  title: string;
  phase: number;
  icon: ComponentProps<typeof MaterialCommunityIcons>['name'];
};

// Placeholder for screens that later build phases fill in.
export function ComingSoon({ title, phase, icon }: Props) {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name={icon} size={56} color={Colors.primary} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.sub}>Coming in Phase {phase}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    gap: Spacing.sm,
  },
  title: { fontSize: FontSize.title, fontWeight: '600', color: Colors.text },
  sub: { fontSize: FontSize.body, color: Colors.textMuted },
});
