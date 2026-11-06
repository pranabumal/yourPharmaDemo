import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { Colors, FontSize, Spacing } from '@/constants/theme';
import type { Message } from '@/data/types';
import { formatTime } from '@/utils/format';

type Props = { message: Message; showAuthor: boolean };

export function ChatBubble({ message, showAuthor }: Props) {
  const mine = message.fromMe;
  return (
    <View style={[styles.wrap, mine ? styles.right : styles.left]}>
      {showAuthor && <Text style={styles.author}>{message.author}</Text>}
      <View style={[styles.bubble, mine ? styles.mine : styles.theirs]}>
        {message.imageUri && (
          <Image source={{ uri: message.imageUri }} style={styles.image} contentFit="cover" />
        )}
        {!!message.text && <Text style={styles.text}>{message.text}</Text>}
      </View>
      <Text style={styles.time}>{formatTime(message.at)}</Text>
    </View>
  );
}

export function TypingBubble() {
  return (
    <View style={[styles.wrap, styles.left]}>
      <View style={[styles.bubble, styles.theirs]}>
        <Text style={[styles.text, { color: Colors.textMuted }]}>Pharmacy is typing…</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { maxWidth: '80%', marginBottom: Spacing.md },
  left: { alignSelf: 'flex-start', alignItems: 'flex-start' },
  right: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  author: { fontSize: FontSize.small, color: Colors.textMuted, marginBottom: 3 },
  bubble: { borderRadius: 10, paddingHorizontal: 12, paddingVertical: 9, gap: 6 },
  mine: { backgroundColor: '#CFE8FC' },
  theirs: { backgroundColor: '#E8EBEF' },
  text: { fontSize: FontSize.label, color: Colors.text, lineHeight: 21 },
  image: { width: 200, height: 150, borderRadius: 8 },
  time: { fontSize: FontSize.small, color: Colors.textMuted, marginTop: 3 },
});
