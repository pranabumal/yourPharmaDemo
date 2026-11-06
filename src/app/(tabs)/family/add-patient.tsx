import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Button } from '@/components/button';
import { Colors, FontSize, Radius, Spacing } from '@/constants/theme';
import { useData } from '@/store/data';

const RELATIONS = ['Child', 'Parent', 'Spouse / partner', 'Other'];
const DOB_PATTERN = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/(19|20)\d{2}$/;

/** Adds slashes as the user types: 05172015 -> 05/17/2015 */
function maskDate(input: string): string {
  const digits = input.replace(/\D/g, '').slice(0, 8);
  return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4)].filter(Boolean).join('/');
}

export default function AddPatientScreen() {
  const { requestPatientLink } = useData();
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [relation, setRelation] = useState(RELATIONS[0]);
  const valid = !!name.trim() && DOB_PATTERN.test(dob);

  function submit() {
    requestPatientLink({ name: name.trim(), dob, relation: relation.toLowerCase() });
    Alert.alert(
      'Request sent',
      'The pharmacy will verify the details and add this person to your care. You can follow up in Messages.',
    );
    router.back();
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.intro}>
        Ask the pharmacy to link a family member&apos;s records to your account. For adults, the
        pharmacy may ask for their consent.
      </Text>

      <Text style={styles.label}>Full name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="e.g. Jake Paterson"
        placeholderTextColor={Colors.textMuted}
      />

      <Text style={styles.label}>Date of birth</Text>
      <TextInput
        style={styles.input}
        value={dob}
        onChangeText={(t) => setDob(maskDate(t))}
        placeholder="MM/DD/YYYY"
        placeholderTextColor={Colors.textMuted}
        keyboardType="number-pad"
        maxLength={10}
      />

      <Text style={styles.label}>Relationship to you</Text>
      <View style={styles.chips}>
        {RELATIONS.map((r) => {
          const active = r === relation;
          return (
            <Pressable
              key={r}
              onPress={() => setRelation(r)}
              accessibilityRole="radio"
              accessibilityState={{ checked: active }}
              style={[styles.chip, active && styles.chipActive]}>
              <Text style={[styles.chipText, active && { color: Colors.white }]}>{r}</Text>
            </Pressable>
          );
        })}
      </View>

      <Button title="Send request" disabled={!valid} onPress={submit} style={{ marginTop: Spacing.xl }} />
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
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  chip: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.surface,
  },
  chipActive: { backgroundColor: Colors.primary },
  chipText: { fontSize: FontSize.body, color: Colors.primary },
});
