import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useNotesStore } from "@/store/notesStore";
import { useTheme } from "@/hooks/useTheme";

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const note = useNotesStore((state) => state.notes.find((n) => n.id === id));
  const deleteNote = useNotesStore((state) => state.deleteNote);

  if (!note) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.colors.background }}>
        <Text style={{ color: theme.colors.text }}>Nota no encontrada</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      "Eliminar nota",
      "¿Estás segura de que quieres eliminar esta nota?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            deleteNote(note.id);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }} contentContainerStyle={{ padding: theme.spacing.lg }}>
      <Text style={{ color: theme.colors.text, fontSize: theme.typography.sizes["2xl"], fontWeight: theme.typography.weights.bold, marginBottom: theme.spacing.md }}>
        {note.title}
      </Text>
      <Text style={{ color: theme.colors.textSecondary, fontSize: theme.typography.sizes.sm, marginBottom: theme.spacing.lg }}>
        {new Date(note.updatedAt).toLocaleDateString("es-ES")}
      </Text>
      <Text style={{ color: theme.colors.text, fontSize: theme.typography.sizes.base, lineHeight: 24, marginBottom: theme.spacing.xl }}>
        {note.content}
      </Text>
      <Pressable
        onPress={handleDelete}
        style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", padding: theme.spacing.md, borderRadius: theme.radius.md, borderWidth: 1, borderColor: "#D33" }}
      >
        <Ionicons name="trash-outline" size={20} color="#D33" />
        <Text style={{ color: "#D33", fontSize: theme.typography.sizes.base, marginLeft: theme.spacing.sm }}>Eliminar nota</Text>
      </Pressable>
    </ScrollView>
  );
}