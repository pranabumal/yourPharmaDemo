import Ionicons from '@expo/vector-icons/Ionicons';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { PharmacyMap } from '@/components/pharmacy-map';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { patients, pharmacy } from '@/data/mock';
import { useAuth } from '@/store/auth';

export default function AccountScreen() {
  const { user, signOut } = useAuth();
  const me = patients.find((p) => p.id === user?.patientId);
  const family = patients.filter((p) => p.id !== user?.patientId);

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${pharmacy.coords.latitude},${pharmacy.coords.longitude}`;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card>
        <Text style={styles.name}>
          {me?.firstName} {me?.lastName}
        </Text>
        <Text style={styles.muted}>{user?.email}</Text>
        <Text style={[styles.muted, { marginTop: Spacing.sm }]}>
          Managing: {family.map((p) => p.firstName).join(', ')}
        </Text>
      </Card>

      <Card style={styles.gap}>
        <Text style={styles.section}>My pharmacy</Text>
        <PharmacyMap pharmacy={pharmacy} />
        <Text style={styles.pharmacyName}>
          {pharmacy.name} – {pharmacy.branch}
        </Text>
        <Text style={styles.muted}>{pharmacy.address1}</Text>
        <Text style={styles.muted}>{pharmacy.address2}</Text>
        <Text style={[styles.muted, { marginTop: Spacing.xs }]}>{pharmacy.hours}</Text>

        <View style={styles.links}>
          <Pressable style={styles.link} onPress={() => Linking.openURL(`tel:${pharmacy.phone}`)}>
            <Ionicons name="call-outline" size={16} color={Colors.link} />
            <Text style={styles.linkText}>{pharmacy.phone}</Text>
          </Pressable>
          <Pressable style={styles.link} onPress={() => Linking.openURL(directionsUrl)}>
            <Ionicons name="location-outline" size={16} color={Colors.link} />
            <Text style={styles.linkText}>Get directions</Text>
          </Pressable>
        </View>
      </Card>

      <Button title="Sign out" variant="outline" onPress={signOut} style={styles.gap} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  gap: { marginTop: Spacing.lg },
  name: { fontSize: FontSize.title, fontWeight: '600', color: Colors.text },
  muted: { fontSize: FontSize.body, color: Colors.textMuted },
  section: { fontSize: FontSize.label, fontWeight: '600', color: Colors.text, marginBottom: Spacing.md },
  pharmacyName: { fontSize: FontSize.label, fontWeight: '600', color: Colors.text, marginTop: Spacing.md },
  links: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.md },
  link: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  linkText: { color: Colors.link, fontSize: FontSize.body },
});
