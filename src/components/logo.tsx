import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';

type Props = { size?: 'small' | 'large'; color?: string };

export function Logo({ size = 'small', color = Colors.white }: Props) {
  const scale = size === 'large' ? 1.5 : 1;
  return (
    <View style={styles.row}>
      <FontAwesome5 name="mortar-pestle" size={34 * scale} color={color} />
      <View style={{ marginLeft: 8 * scale }}>
        <Text style={[styles.your, { color, fontSize: 16 * scale }]}>Your</Text>
        <Text style={[styles.pharmacy, { color, fontSize: 22 * scale }]}>Pharmacy</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  your: { fontFamily: 'serif', lineHeight: undefined },
  pharmacy: { fontFamily: 'serif', marginTop: -4 },
});
