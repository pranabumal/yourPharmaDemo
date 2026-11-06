import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput } from 'react-native';

import { Button } from '@/components/button';
import { Colors, FontSize, Radius, Spacing } from '@/constants/theme';
import { patients } from '@/data/mock';
import { useData } from '@/store/data';
import { fullName } from '@/utils/format';

export default function AddMedicationScreen() {
  const { currentPatientId, addMedication } = useData();
  const patient = patients.find((p) => p.id === currentPatientId);

  const [name, setName] = useState('');
  const [rxNumber, setRxNumber] = useState('');
  const [instructions, setInstructions] = useState('');

  function save() {
    addMedication({
      patientId: currentPatientId,
      name: name.trim(),
      rxNumber: rxNumber.trim() || 'Not provided',
      enteredManually: true,
      lastFilled: new Date().toISOString(),
      instructions: instructions.trim() || 'No instructions added.',
    });
    router.back();
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      {patient && (
        <Text style={styles.intro}>
          Adding a medication for {patient.relation === 'self' ? 'yourself' : fullName(patient)}.
          Medications you add yourself are marked &quot;Entered manually&quot;.
        </Text>
      )}

      <Text style={styles.label}>Medication name and strength *</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="e.g. Lisinopril 10mg tablet"
        placeholderTextColor={Colors.textMuted}
      />

      <Text style={styles.label}>Rx number</Text>
      <TextInput
        style={styles.input}
        value={rxNumber}
        onChangeText={setRxNumber}
        placeholder="Found on your prescription label"
        placeholderTextColor={Colors.textMuted}
        keyboardType="number-pad"
      />

      <Text style={styles.label}>Instructions</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={instructions}
        onChangeText={setInstructions}
        placeholder="e.g. Take 1 tablet daily"
        placeholderTextColor={Colors.textMuted}
        multiline
      />

      <Button
        title="Save medication"
        onPress={save}
        disabled={!name.trim()}
        style={{ marginTop: Spacing.xl }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.lg },
  intro: { fontSize: FontSize.body, color: Colors.textMuted, marginBottom: Spacing.sm },
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
  multiline: { height: 90, paddingTop: Spacing.md, textAlignVertical: 'top' },
});
