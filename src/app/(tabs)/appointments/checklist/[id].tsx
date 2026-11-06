import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Colors, FontSize, Radius, Spacing } from '@/constants/theme';
import { patients, services } from '@/data/mock';
import { useData } from '@/store/data';
import { formatAppointment, fullName } from '@/utils/format';

const QUESTIONS = [
  'Are you feeling sick today?',
  'Have you ever had a serious reaction after a vaccine or injection?',
  'Do you have allergies to any medications, food, or latex?',
  'Are you pregnant, or could you become pregnant in the next month?',
  'Have you received any vaccines in the past 4 weeks?',
];

type Answer = 'yes' | 'no';

export default function ChecklistScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, completeChecklist } = useData();
  const appt = state.appointments.find((a) => a.id === id);
  const [answers, setAnswers] = useState<(Answer | undefined)[]>(() => QUESTIONS.map(() => undefined));
  const [notes, setNotes] = useState('');

  if (!appt) return null;

  const service = services.find((s) => s.id === appt.serviceId);
  const patient = patients.find((p) => p.id === appt.patientId);
  const allAnswered = answers.every(Boolean);

  function answer(index: number, value: Answer) {
    setAnswers((cur) => cur.map((a, i) => (i === index ? value : a)));
  }

  function submit() {
    completeChecklist(appt!.id);
    router.back();
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.intro}>
        {service?.name} · {formatAppointment(appt.at)}
        {patient ? `\nFor ${fullName(patient)}` : ''}
      </Text>

      {QUESTIONS.map((q, i) => (
        <Card key={q} style={styles.question}>
          <Text style={styles.qText}>
            {i + 1}. {q}
          </Text>
          <View style={styles.options}>
            {(['yes', 'no'] as const).map((value) => {
              const active = answers[i] === value;
              return (
                <Pressable
                  key={value}
                  onPress={() => answer(i, value)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: active }}
                  style={[styles.option, active && styles.optionActive]}>
                  <Text style={[styles.optionText, active && { color: Colors.white }]}>
                    {value === 'yes' ? 'Yes' : 'No'}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Card>
      ))}

      <Text style={styles.label}>Anything else the pharmacist should know? (optional)</Text>
      <TextInput
        style={styles.notes}
        value={notes}
        onChangeText={setNotes}
        multiline
        placeholder="e.g. I feel faint around needles"
        placeholderTextColor={Colors.textMuted}
      />

      <Button
        title={allAnswered ? 'Submit checklist' : 'Answer all questions to submit'}
        disabled={!allAnswered}
        onPress={submit}
        style={{ marginTop: Spacing.xl }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  intro: { fontSize: FontSize.body, color: Colors.textMuted, marginBottom: Spacing.md, lineHeight: 20 },
  question: { marginBottom: Spacing.md },
  qText: { fontSize: FontSize.label, color: Colors.text, lineHeight: 22 },
  options: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md },
  option: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: Radius.md,
  },
  optionActive: { backgroundColor: Colors.primary },
  optionText: { color: Colors.primary, fontWeight: '600', fontSize: FontSize.body },
  label: { fontSize: FontSize.body, color: Colors.text, marginTop: Spacing.md, marginBottom: 6 },
  notes: {
    minHeight: 80,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    fontSize: FontSize.label,
    color: Colors.text,
    textAlignVertical: 'top',
  },
});
