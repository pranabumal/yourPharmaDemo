import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput } from 'react-native';

import { Button } from '@/components/button';
import { Colors, FontSize, Radius, Spacing } from '@/constants/theme';
import { useData } from '@/store/data';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function InviteCaregiverScreen() {
  const { inviteCaregiver } = useData();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const valid = !!name.trim() && EMAIL_PATTERN.test(email.trim());

  function send() {
    inviteCaregiver(name.trim(), email.trim());
    Alert.alert('Invitation sent', `We emailed ${email.trim()} with instructions to join.`);
    router.back();
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.intro}>
        Invite someone you trust, like a family member, to help manage your prescriptions and
        appointments.
      </Text>

      <Text style={styles.label}>Full name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="e.g. Jennifer Smith"
        placeholderTextColor={Colors.textMuted}
        autoComplete="name"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="name@example.com"
        placeholderTextColor={Colors.textMuted}
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
      />

      <Button title="Send invitation" disabled={!valid} onPress={send} style={{ marginTop: Spacing.xl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.lg },
  intro: { fontSize: FontSize.body, color: Colors.textMuted, lineHeight: 20 },
  label: { fontSize: FontSize.body, color: Colors.text, marginTop: Spacing.lg, marginBottom: 6 },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    fontSize: FontSize.label,
    color: Colors.text,
  },
});
