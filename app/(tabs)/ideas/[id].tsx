import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useNotesStore } from "@/store/notesStore";
import { useTheme } from "@/hooks/useTheme";

export default function IdeaDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const idea = useNotesStore((state) => state.ideas.find((i) => i.id === id));
  const deleteIdea = useNotesStore((state) => state.deleteIdea);

  if (!idea) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.colors.background }}>
        <Text style={{ color: theme.colors.text }}>Idea no encontrada</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      "Eliminar idea",
      "¿Estás segura de que quieres eliminar esta idea?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            deleteIdea(idea.id);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }} contentContainerStyle={{ padding: theme.spacing.lg }}>
      <View style={{ backgroundColor: idea.color, padding: theme.spacing.lg, borderRadius: theme.radius.lg, marginBottom: theme.spacing.lg }}>
        <Text style={{ color: theme.colors.text, fontSize: theme.typography.sizes["2xl"], fontWeight: theme.typography.weights.bold }}>
          {idea.title}
        </Text>
      </View>

      <Text style={{ color: theme.colors.text, fontSize: theme.typography.sizes.sm, fontWeight: theme.typography.weights.medium, marginBottom: theme.spacing.sm }}>
        Etiquetas
      </Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: theme.spacing.xs, marginBottom: theme.spacing.xl }}>
        {idea.tags.map((tag, index) => (
          <View
            key={index}
            style={{ backgroundColor: theme.colors.surface, paddingVertical: 4, paddingHorizontal: theme.spacing.sm, borderRadius: theme.radius.full, borderWidth: 1, borderColor: theme.colors.border }}
          >
            <Text style={{ color: theme.colors.textSecondary, fontSize: theme.typography.sizes.sm }}>
              #{tag}
            </Text>
          </View>
        ))}
      </View>

      <Pressable
        onPress={handleDelete}
        style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", padding: theme.spacing.md, borderRadius: theme.radius.md, borderWidth: 1, borderColor: "#D33" }}
      >
        <Ionicons name="trash-outline" size={20} color="#D33" />
        <Text style={{ color: "#D33", fontSize: theme.typography.sizes.base, marginLeft: theme.spacing.sm }}>Eliminar idea</Text>
      </Pressable>
    </ScrollView>
  );
}