import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Logo } from '@/components/logo';
import { Colors, Spacing } from '@/constants/theme';

export function AppHeader() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
      <Logo />
      <Pressable
        accessibilityLabel="Open account menu"
        hitSlop={12}
        onPress={() => router.navigate('/account')}>
        <Ionicons name="menu" size={28} color={Colors.white} />
        <View style={styles.dot} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.header,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dot: {
    position: 'absolute',
    top: 0,
    right: -2,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: Colors.danger,
    borderWidth: 1.5,
    borderColor: Colors.header,
  },
});
