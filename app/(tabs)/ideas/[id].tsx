import { useState } from "react";
import { View, Text, TextInput, ScrollView, Pressable, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useNotesStore } from "@/store/notesStore";
import { useTheme } from "@/hooks/useTheme";

const IDEA_COLORS = ["#FFD6A5", "#FDFFB6", "#CAFFBF", "#9BF6FF", "#A0C4FF", "#BDB2FF", "#FFC6FF", "#FFE4F1"];

export default function IdeaDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();

  const idea = useNotesStore((state) => state.ideas.find((i) => i.id === id));
  const updateIdea = useNotesStore((state) => state.updateIdea);
  const deleteIdea = useNotesStore((state) => state.deleteIdea);
  const archiveIdea = useNotesStore((state) => state.archiveIdea);

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(idea?.title ?? "");
  const [editColor, setEditColor] = useState(idea?.color ?? IDEA_COLORS[0]);
  const [editTags, setEditTags] = useState(idea?.tags.join(", ") ?? "");

  if (!idea) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.colors.background }}>
        <Text style={{ color: theme.colors.text }}>Idea no encontrada</Text>
      </View>
    );
  }

  const handleSave = () => {
    if (editTitle.trim().length < 3) {
      Alert.alert("Error", "El título debe tener al menos 3 caracteres");
      return;
    }
    const tags = editTags.split(",").map((t) => t.trim()).filter((t) => t.length > 0);
    if (tags.length === 0) {
      Alert.alert("Error", "Añade al menos una etiqueta");
      return;
    }
    updateIdea(idea.id, { title: editTitle, color: editColor, tags });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setIsEditing(false);
  };

  const handleDelete = () => {
    Alert.alert("Eliminar idea", "¿Estás segura?", [
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
    ]);
  };

  const handleArchive = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    archiveIdea(idea.id);
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: theme.colors.background }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 12,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border,
        }}
      >
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={26} color={theme.colors.text} />
        </Pressable>

        <View style={{ flexDirection: "row", gap: 16 }}>
          {isEditing ? (
            <>
              <Pressable onPress={() => setIsEditing(false)}>
                <Text style={{ color: theme.colors.textSecondary, fontSize: 15 }}>Cancelar</Text>
              </Pressable>
              <Pressable onPress={handleSave}>
                <Text style={{ color: theme.colors.text, fontSize: 15, fontWeight: "600" }}>Guardar</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Pressable onPress={handleArchive}>
                <Ionicons name="archive-outline" size={22} color={theme.colors.text} />
              </Pressable>
              <Pressable onPress={() => setIsEditing(true)}>
                <Ionicons name="create-outline" size={22} color={theme.colors.text} />
              </Pressable>
              <Pressable onPress={handleDelete}>
                <Ionicons name="trash-outline" size={22} color="#D33" />
              </Pressable>
            </>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
        {isEditing ? (
          <>
            <TextInput
              value={editTitle}
              onChangeText={setEditTitle}
              placeholder="Título"
              placeholderTextColor={theme.colors.textSecondary}
              style={{
                color: theme.colors.text,
                fontSize: 22,
                fontWeight: "700",
                marginBottom: 16,
                borderBottomWidth: 1,
                borderBottomColor: theme.colors.border,
                paddingBottom: 8,
              }}
            />
            <Text style={{ color: theme.colors.text, fontSize: 13, fontWeight: "600", marginBottom: 8 }}>
              Color
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              {IDEA_COLORS.map((c) => (
                <Pressable
                  key={c}
                  onPress={() => setEditColor(c)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: c,
                    borderWidth: editColor === c ? 3 : 1,
                    borderColor: editColor === c ? theme.colors.text : theme.colors.border,
                  }}
                />
              ))}
            </View>
            <Text style={{ color: theme.colors.text, fontSize: 13, fontWeight: "600", marginBottom: 8 }}>
              Etiquetas (separadas por comas)
            </Text>
            <TextInput
              value={editTags}
              onChangeText={setEditTags}
              placeholder="trabajo, idea, importante"
              placeholderTextColor={theme.colors.textSecondary}
              style={{
                backgroundColor: theme.colors.surface,
                color: theme.colors.text,
                padding: 12,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: theme.colors.border,
                fontSize: 14,
              }}
            />
          </>
        ) : (
          <>
            <View
              style={{
                backgroundColor: idea.color,
                padding: 20,
                borderRadius: 4,
                marginBottom: 20,
                shadowColor: "#000",
                shadowOffset: { width: 2, height: 3 },
                shadowOpacity: 0.1,
                shadowRadius: 0,
              }}
            >
              <Text style={{ color: "#2A2A2A", fontSize: 22, fontWeight: "700" }}>
                {idea.title}
              </Text>
            </View>
            <Text style={{ color: theme.colors.text, fontSize: 13, fontWeight: "600", marginBottom: 8 }}>
              Etiquetas
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
              {idea.tags.map((tag, idx) => (
                <View
                  key={idx}
                  style={{
                    backgroundColor: theme.colors.surface,
                    paddingVertical: 4,
                    paddingHorizontal: 10,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                  }}
                >
                  <Text style={{ color: theme.colors.textSecondary, fontSize: 12 }}>#{tag}</Text>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}