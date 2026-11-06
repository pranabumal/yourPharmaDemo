import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Button } from '@/components/button';
import { PatientPicker } from '@/components/patient-picker';
import { TOPICS } from '@/components/topic-icon';
import { Colors, FontSize, Radius, Spacing } from '@/constants/theme';
import type { ThreadTopic } from '@/data/types';
import { useData } from '@/store/data';
import { pickPhoto } from '@/utils/pick-photo';

export default function NewMessageScreen() {
  const { currentPatientId, startThread } = useData();
  const [patientId, setPatientId] = useState(currentPatientId);
  const [topic, setTopic] = useState<ThreadTopic>('question');
  const [subject, setSubject] = useState('');
  const [text, setText] = useState('');
  const [imageUri, setImageUri] = useState<string | undefined>();

  const defaultSubject = TOPICS.find((t) => t.key === topic)?.subject ?? 'Message';

  function send() {
    const threadId = startThread({
      patientId,
      topic,
      subject: subject.trim() || defaultSubject,
      text: text.trim(),
      imageUri,
    });
    // Close this form, then open the new conversation full-screen.
    router.back();
    router.push({ pathname: '/chat/[threadId]', params: { threadId } });
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.label}>This message is about:</Text>
      <PatientPicker value={patientId} onChange={setPatientId} />

      <Text style={styles.label}>Topic</Text>
      <View style={styles.chips}>
        {TOPICS.map((t) => {
          const active = t.key === topic;
          return (
            <Pressable
              key={t.key}
              onPress={() => setTopic(t.key)}
              accessibilityRole="radio"
              accessibilityState={{ checked: active }}
              style={[styles.chip, active && styles.chipActive]}>
              <MaterialCommunityIcons
                name={t.icon}
                size={16}
                color={active ? Colors.white : Colors.primary}
              />
              <Text style={[styles.chipText, active && { color: Colors.white }]}>{t.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.label}>Subject</Text>
      <TextInput
        style={styles.input}
        value={subject}
        onChangeText={setSubject}
        placeholder={defaultSubject}
        placeholderTextColor={Colors.textMuted}
      />

      <Text style={styles.label}>Message</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={text}
        onChangeText={setText}
        placeholder="How can we help?"
        placeholderTextColor={Colors.textMuted}
        multiline
      />

      {imageUri ? (
        <View style={styles.preview}>
          <Image source={{ uri: imageUri }} style={styles.thumb} />
          <Pressable onPress={() => setImageUri(undefined)}>
            <Text style={styles.link}>Remove photo</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable style={styles.attach} onPress={() => pickPhoto(setImageUri)}>
          <Ionicons name="camera-outline" size={18} color={Colors.link} />
          <Text style={styles.link}>Attach a photo (prescription, insurance card)</Text>
        </Pressable>
      )}

      <Button
        title="Send message"
        onPress={send}
        disabled={!text.trim() && !imageUri}
        style={{ marginTop: Spacing.xl }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  label: { fontSize: FontSize.body, color: Colors.text, marginTop: Spacing.lg, marginBottom: 6 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.surface,
  },
  chipActive: { backgroundColor: Colors.primary },
  chipText: { fontSize: FontSize.body, color: Colors.primary },
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
  multiline: { height: 120, paddingTop: Spacing.md, textAlignVertical: 'top' },
  attach: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: Spacing.lg },
  link: { color: Colors.link, fontSize: FontSize.body },
  preview: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginTop: Spacing.lg },
  thumb: { width: 72, height: 72, borderRadius: 8 },
});
