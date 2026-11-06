import { Stack } from 'expo-router';

import { Colors } from '@/constants/theme';

export default function FamilyLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.surface },
        headerTintColor: Colors.primary,
        headerTitleStyle: { color: Colors.text },
        contentStyle: { backgroundColor: Colors.background },
      }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="patient/[id]" options={{ title: 'Patient details' }} />
      <Stack.Screen name="forms/[patientId]" options={{ title: 'Forms' }} />
      <Stack.Screen name="caregiver/[id]" options={{ title: 'Caregiver request' }} />
      <Stack.Screen name="invite" options={{ title: 'Invite a caregiver' }} />
      <Stack.Screen name="add-patient" options={{ title: 'Add a patient' }} />
    </Stack>
  );
}
