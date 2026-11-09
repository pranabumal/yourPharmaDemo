import { router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Logo } from '@/components/logo';
import { Colors, FontSize, Radius, Spacing } from '@/constants/theme';
import { DEMO_CREDENTIALS } from '@/data/mock';
import { useAuth } from '@/store/auth';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSignIn(e = email, p = password) {
    setError(null);
    setLoading(true);
    try {
      await signIn(e, p);
      // Native apps are redirected by the route guard; the browser URL needs a push.
      if (Platform.OS === 'web') router.replace('/meds');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  function useDemoAccount() {
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
    handleSignIn(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password);
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior="padding">
      <ScrollView
        contentContainerStyle={[styles.container, { paddingTop: insets.top + Spacing.xxl }]}
        keyboardShouldPersistTaps="handled">
        <View style={styles.logo}>
          <Logo size="large" />
        </View>

        <Card style={styles.card}>
          <Text style={styles.title}>Sign in</Text>

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor={Colors.textMuted}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor={Colors.textMuted}
            secureTextEntry
            autoComplete="password"
            onSubmitEditing={() => handleSignIn()}
          />

          {error && <Text style={styles.error}>{error}</Text>}

          <Button
            title="Sign in"
            onPress={() => handleSignIn()}
            loading={loading}
            disabled={!email || !password}
            style={{ marginTop: Spacing.lg }}
          />

          <Pressable onPress={useDemoAccount} disabled={loading} style={styles.demo}>
            <Text style={styles.demoText}>Use demo account</Text>
            <Text style={styles.demoHint}>
              {DEMO_CREDENTIALS.email} / {DEMO_CREDENTIALS.password}
            </Text>
          </Pressable>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.header },
  container: { flexGrow: 1, padding: Spacing.xl },
  logo: { alignItems: 'center', marginBottom: Spacing.xxl },
  card: { padding: Spacing.xl },
  title: { fontSize: FontSize.heading, fontWeight: '600', color: Colors.text, marginBottom: Spacing.lg },
  label: { fontSize: FontSize.body, color: Colors.text, marginBottom: Spacing.xs, marginTop: Spacing.md },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    fontSize: FontSize.label,
    color: Colors.text,
  },
  error: { color: Colors.danger, marginTop: Spacing.md },
  demo: { alignItems: 'center', marginTop: Spacing.lg, padding: Spacing.sm },
  demoText: { color: Colors.link, fontSize: FontSize.label, fontWeight: '500' },
  demoHint: { color: Colors.textMuted, fontSize: FontSize.small, marginTop: 2 },
});
