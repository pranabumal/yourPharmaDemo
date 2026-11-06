import { Stack } from 'expo-router';

import { Colors } from '@/constants/theme';

export default function MedsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.surface },
        headerTintColor: Colors.primary,
        headerTitleStyle: { color: Colors.text },
        contentStyle: { backgroundColor: Colors.background },
      }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[id]" options={{ title: 'Medication' }} />
      <Stack.Screen name="order" options={{ title: 'Fill Prescriptions' }} />
      <Stack.Screen
        name="order-confirmed"
        options={{ title: 'Fill Prescriptions', headerBackVisible: false, gestureEnabled: false }}
      />
      <Stack.Screen name="add" options={{ title: 'Add medication' }} />
    </Stack>
  );
}
