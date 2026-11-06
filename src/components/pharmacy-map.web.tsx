import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';
import type { Pharmacy } from '@/data/types';

// react-native-maps has no web support; show a simple box in the browser.
export function PharmacyMap({ pharmacy, height = 150 }: { pharmacy: Pharmacy; height?: number }) {
  return (
    <View style={[styles.box, { height }]}>
      <Text style={styles.text}>📍 {pharmacy.address1}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    width: '100%',
    borderRadius: 8,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { color: Colors.text },
});
