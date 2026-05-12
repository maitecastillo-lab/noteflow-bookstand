import { View, Text, ScrollView } from "react-native";
import { useNotesStore } from "@/store/notesStore";
import { useTheme } from "@/hooks/useTheme";

export default function ArchivadasScreen() {
  const theme = useTheme();
  const archivedNotes = useNotesStore((state) => state.notes.filter((n) => n.isArchived));
  const archivedChecklists = useNotesStore((state) => state.checklists.filter((c) => c.isArchived));
  const archivedIdeas = useNotesStore((state) => state.ideas.filter((i) => i.isArchived));

  const total = archivedNotes.length + archivedChecklists.length + archivedIdeas.length;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }} contentContainerStyle={{ padding: theme.spacing.lg }}>
      <Text style={{ color: theme.colors.text, fontSize: theme.typography.sizes["2xl"], fontWeight: theme.typography.weights.bold, marginBottom: theme.spacing.lg }}>
        Archivadas
      </Text>

      {total === 0 ? (
        <Text style={{ color: theme.colors.textSecondary, fontSize: theme.typography.sizes.base, textAlign: "center", marginTop: theme.spacing.xl }}>
          No tienes nada archivado.
        </Text>
      ) : (
        <>
          {archivedNotes.map((n) => (
            <View key={n.id} style={{ backgroundColor: theme.colors.surface, padding: theme.spacing.md, borderRadius: theme.radius.md, marginBottom: theme.spacing.sm, borderWidth: 1, borderColor: theme.colors.border }}>
              <Text style={{ color: theme.colors.text, fontWeight: theme.typography.weights.semibold }}>📝 {n.title}</Text>
            </View>
          ))}
          {archivedChecklists.map((c) => (
            <View key={c.id} style={{ backgroundColor: theme.colors.surface, padding: theme.spacing.md, borderRadius: theme.radius.md, marginBottom: theme.spacing.sm, borderWidth: 1, borderColor: theme.colors.border }}>
              <Text style={{ color: theme.colors.text, fontWeight: theme.typography.weights.semibold }}>✓ {c.title}</Text>
            </View>
          ))}
          {archivedIdeas.map((i) => (
            <View key={i.id} style={{ backgroundColor: theme.colors.surface, padding: theme.spacing.md, borderRadius: theme.radius.md, marginBottom: theme.spacing.sm, borderWidth: 1, borderColor: theme.colors.border }}>
              <Text style={{ color: theme.colors.text, fontWeight: theme.typography.weights.semibold }}>💡 {i.title}</Text>
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
}