import { Stack } from 'expo-router';

import { Colors } from '@/constants/theme';

export default function AppointmentsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.surface },
        headerTintColor: Colors.primary,
        headerTitleStyle: { color: Colors.text },
        contentStyle: { backgroundColor: Colors.background },
      }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[id]" options={{ title: 'Appointment' }} />
      <Stack.Screen name="book/[serviceId]" options={{ title: 'Book Appointment' }} />
      <Stack.Screen name="checklist/[id]" options={{ title: 'Pre-visit checklist' }} />
    </Stack>
  );
}
