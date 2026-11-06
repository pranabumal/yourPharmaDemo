import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { PharmacyMap } from '@/components/pharmacy-map';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { pharmacy } from '@/data/mock';
import { useData } from '@/store/data';

export default function OrderConfirmedScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const { state } = useData();
  const order = state.orders.find((o) => o.id === orderId);
  const isDelivery = order?.pickup === 'delivery';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Ionicons name="checkmark-circle" size={48} color={Colors.success} />
        <Text style={styles.title}>Your order is submitted</Text>
        <View style={styles.divider} />

        <PharmacyMap pharmacy={pharmacy} height={120} />
        <Text style={styles.pharmacy}>{pharmacy.name}</Text>
        <Text style={styles.address}>{pharmacy.address1}</Text>
        <Text style={styles.address}>{pharmacy.address2}</Text>
        <View style={styles.divider} />

        <Text style={styles.body}>
          {isDelivery
            ? 'We will let you know when your order is on its way. '
            : 'We will contact you when your prescription is ready. '}
          If you have any questions or need further assistance, please let us know!
        </Text>
      </Card>

      <Button title="Done" onPress={() => router.dismissTo('/meds')} style={styles.gap} />
      <Pressable style={styles.message} onPress={() => router.navigate('/messages/new')}>
        <Ionicons name="chatbox-outline" size={18} color={Colors.text} />
        <Text style={styles.messageText}>Send a secure message</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  card: { alignItems: 'center', padding: Spacing.xl },
  title: { fontSize: FontSize.heading, fontWeight: '600', color: Colors.text, marginTop: Spacing.sm },
  divider: {
    alignSelf: 'stretch',
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.lg,
  },
  pharmacy: { fontSize: FontSize.title, fontWeight: '600', color: Colors.text, marginTop: Spacing.md },
  address: { fontSize: FontSize.label, color: Colors.textMuted, marginTop: 2 },
  body: { fontSize: FontSize.body, color: Colors.text, textAlign: 'center', lineHeight: 20 },
  gap: { marginTop: Spacing.xl },
  message: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    padding: Spacing.lg,
  },
  messageText: { fontSize: FontSize.body, color: Colors.text },
});
