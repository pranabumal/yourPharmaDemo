import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useLocalSearchParams } from 'expo-router';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/card';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { patients } from '@/data/mock';
import { useData } from '@/store/data';
import { formatLongDate, fullName } from '@/utils/format';

export default function FormsScreen() {
  const { patientId } = useLocalSearchParams<{ patientId: string }>();
  const { state } = useData();
  const patient = patients.find((p) => p.id === patientId);
  const forms = state.formSubmissions
    .filter((f) => f.patientId === patientId)
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));

  return (
    <FlatList
      data={forms}
      keyExtractor={(f) => f.id}
      contentContainerStyle={styles.list}
      ListHeaderComponent={
        patient ? <Text style={styles.intro}>Forms submitted for {fullName(patient)}</Text> : undefined
      }
      ListEmptyComponent={
        <Text style={styles.empty}>
          No forms yet. Pre-visit checklists you complete for appointments will show up here.
        </Text>
      }
      renderItem={({ item }) => (
        <Card style={styles.card}>
          <MaterialCommunityIcons name="file-check-outline" size={26} color={Colors.success} />
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.muted}>Submitted on {formatLongDate(item.submittedAt)}</Text>
          </View>
        </Card>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: Spacing.lg },
  intro: { color: Colors.textMuted, marginBottom: Spacing.md },
  card: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.md },
  name: { fontSize: FontSize.label, color: Colors.text, fontWeight: '500' },
  muted: { fontSize: FontSize.body, color: Colors.textMuted, marginTop: 2 },
  empty: { textAlign: 'center', color: Colors.textMuted, marginTop: Spacing.xl, lineHeight: 20 },
});
