import { StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import type { Pharmacy } from '@/data/types';

type Props = { pharmacy: Pharmacy; height?: number };

export function PharmacyMap({ pharmacy, height = 150 }: Props) {
  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      style={[styles.map, { height }]}
      initialRegion={{ ...pharmacy.coords, latitudeDelta: 0.01, longitudeDelta: 0.01 }}
      scrollEnabled={false}
      zoomEnabled={false}
      rotateEnabled={false}
      pitchEnabled={false}
      toolbarEnabled={false}>
      <Marker coordinate={pharmacy.coords} title={pharmacy.name} description={pharmacy.address1} />
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { width: '100%', borderRadius: 8 },
});
