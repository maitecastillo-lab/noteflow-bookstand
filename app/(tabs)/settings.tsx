import { View, Text, ScrollView, useColorScheme } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { useNotesStore } from "@/store/notesStore";

export default function SettingsScreen() {
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const notes = useNotesStore((state) => state.notes);
  const checklists = useNotesStore((state) => state.checklists);
  const ideas = useNotesStore((state) => state.ideas);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }} contentContainerStyle={{ padding: theme.spacing.lg }}>
      <Text style={{ color: theme.colors.text, fontSize: theme.typography.sizes["2xl"], fontWeight: theme.typography.weights.bold, marginBottom: theme.spacing.lg }}>
        Ajustes
      </Text>

      <View style={{ backgroundColor: theme.colors.surface, padding: theme.spacing.md, borderRadius: theme.radius.md, borderWidth: 1, borderColor: theme.colors.border, marginBottom: theme.spacing.md }}>
        <Text style={{ color: theme.colors.text, fontSize: theme.typography.sizes.base, fontWeight: theme.typography.weights.medium, marginBottom: theme.spacing.sm }}>
          Tema
        </Text>
        <Text style={{ color: theme.colors.textSecondary, fontSize: theme.typography.sizes.sm }}>
          Modo actual: {colorScheme === "dark" ? "Oscuro" : "Claro"} (automático según el sistema)
        </Text>
      </View>

      <View style={{ backgroundColor: theme.colors.surface, padding: theme.spacing.md, borderRadius: theme.radius.md, borderWidth: 1, borderColor: theme.colors.border }}>
        <Text style={{ color: theme.colors.text, fontSize: theme.typography.sizes.base, fontWeight: theme.typography.weights.medium, marginBottom: theme.spacing.sm }}>
          Estadísticas
        </Text>
        <Text style={{ color: theme.colors.textSecondary, fontSize: theme.typography.sizes.sm, marginBottom: 4 }}>
          Notas: {notes.length}
        </Text>
        <Text style={{ color: theme.colors.textSecondary, fontSize: theme.typography.sizes.sm, marginBottom: 4 }}>
          Listas de tareas: {checklists.length}
        </Text>
        <Text style={{ color: theme.colors.textSecondary, fontSize: theme.typography.sizes.sm }}>
          Ideas: {ideas.length}
        </Text>
      </View>
    </ScrollView>
  );
}