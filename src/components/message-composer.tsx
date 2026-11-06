import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Colors, FontSize, Spacing } from '@/constants/theme';
import { pickPhoto } from '@/utils/pick-photo';

type Props = { onSend: (text: string, imageUri?: string) => void };

/** Text box with photo attach and send buttons, shown at the bottom of a chat. */
export function MessageComposer({ onSend }: Props) {
  const [text, setText] = useState('');
  const [imageUri, setImageUri] = useState<string | undefined>();
  const canSend = !!text.trim() || !!imageUri;

  function send() {
    if (!canSend) return;
    onSend(text.trim(), imageUri);
    setText('');
    setImageUri(undefined);
  }

  return (
    <View style={styles.bar}>
      {imageUri && (
        <View style={styles.preview}>
          <Image source={{ uri: imageUri }} style={styles.thumb} />
          <Pressable
            style={styles.remove}
            onPress={() => setImageUri(undefined)}
            accessibilityLabel="Remove photo">
            <Ionicons name="close-circle" size={22} color={Colors.text} />
          </Pressable>
        </View>
      )}
      <View style={styles.row}>
        <Pressable
          onPress={() => pickPhoto(setImageUri)}
          style={styles.attach}
          accessibilityLabel="Attach a photo">
          <Ionicons name="ellipsis-horizontal" size={20} color={Colors.textMuted} />
        </Pressable>
        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Type a message"
            placeholderTextColor={Colors.textMuted}
            multiline
          />
          <Pressable
            onPress={send}
            disabled={!canSend}
            style={[styles.send, !canSend && { opacity: 0.4 }]}
            accessibilityLabel="Send message">
            <Ionicons name="paper-plane-outline" size={20} color={Colors.white} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    padding: Spacing.sm,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  attach: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8EBEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#7FB3E3',
    borderRadius: 8,
    paddingLeft: Spacing.md,
    paddingRight: 4,
  },
  input: { flex: 1, maxHeight: 110, fontSize: FontSize.label, color: Colors.text, paddingVertical: 8 },
  send: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.link,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  preview: { alignSelf: 'flex-start', marginBottom: Spacing.sm, marginLeft: 48 },
  thumb: { width: 72, height: 72, borderRadius: 8 },
  remove: { position: 'absolute', top: -8, right: -8, backgroundColor: Colors.surface, borderRadius: 11 },
});
