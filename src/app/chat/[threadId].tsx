import { Stack, useLocalSearchParams } from 'expo-router';
import { useHeaderHeight } from 'expo-router/react-navigation';
import { useEffect, useRef } from 'react';
import { FlatList, KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ChatBubble, TypingBubble } from '@/components/chat-bubble';
import { MessageComposer } from '@/components/message-composer';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { patients } from '@/data/mock';
import { useData } from '@/store/data';
import { formatDayHeader, fullName, isSameDay } from '@/utils/format';

// Full-screen chat (outside the tabs) so the message box sits directly above the keyboard.
export default function ThreadScreen() {
  const { threadId } = useLocalSearchParams<{ threadId: string }>();
  const { state, sendMessage, markThreadRead, replyingThreadIds } = useData();
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList>(null);

  const thread = state.threads.find((t) => t.id === threadId);
  const isUnread = !!thread?.unread;
  const typing = replyingThreadIds.includes(threadId);

  // Anything that arrives while this screen is open counts as read.
  useEffect(() => {
    if (isUnread) markThreadRead(threadId);
  }, [isUnread, threadId, markThreadRead]);

  if (!thread) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>Conversation not found.</Text>
      </View>
    );
  }

  const patient = patients.find((p) => p.id === thread.patientId);
  const title = patient?.relation === 'self' ? 'Me' : patient ? fullName(patient) : 'Message';

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior="padding"
      keyboardVerticalOffset={headerHeight}>
      <Stack.Screen options={{ title }} />
      <FlatList
        ref={listRef}
        data={thread.messages}
        keyExtractor={(m) => m.id}
        style={styles.flex}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => listRef.current?.scrollToEnd({ animated: false })}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.greeting}>Greetings from your local pharmacy!</Text>
            <Text style={styles.subject}>{thread.subject}</Text>
          </View>
        }
        ListFooterComponent={typing ? <TypingBubble /> : undefined}
        renderItem={({ item, index }) => {
          const prev = thread.messages[index - 1];
          const newDay = !prev || !isSameDay(prev.at, item.at);
          return (
            <>
              {newDay && <Text style={styles.day}>{formatDayHeader(item.at)}</Text>}
              <ChatBubble message={item} showAuthor={newDay || prev.author !== item.author} />
            </>
          );
        }}
      />
      <View style={{ paddingBottom: insets.bottom, backgroundColor: Colors.surface }}>
        <MessageComposer onSend={(text, imageUri) => sendMessage(thread.id, text, imageUri)} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.surface },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  muted: { color: Colors.textMuted },
  list: { padding: Spacing.lg },
  header: { alignItems: 'center', marginBottom: Spacing.md },
  greeting: { fontSize: FontSize.body, fontWeight: '600', color: Colors.text },
  subject: { fontSize: FontSize.small, color: Colors.textMuted, marginTop: 2, textAlign: 'center' },
  day: {
    textAlign: 'center',
    fontSize: FontSize.small,
    fontWeight: '600',
    color: Colors.text,
    marginVertical: Spacing.md,
  },
});
