import { useState } from "react";
import { View, Text, TextInput, ScrollView, Pressable, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useNotesStore } from "@/store/notesStore";
import { useTheme } from "@/hooks/useTheme";

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();

  const note = useNotesStore((state) => state.notes.find((n) => n.id === id));
  const updateNote = useNotesStore((state) => state.updateNote);
  const deleteNote = useNotesStore((state) => state.deleteNote);
  const archiveNote = useNotesStore((state) => state.archiveNote);

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note?.title ?? "");
  const [editContent, setEditContent] = useState(note?.content ?? "");

  if (!note) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.colors.background }}>
        <Text style={{ color: theme.colors.text }}>Nota no encontrada</Text>
      </View>
    );
  }

  const handleSave = () => {
    if (editTitle.trim().length < 3) {
      Alert.alert("Error", "El título debe tener al menos 3 caracteres");
      return;
    }
    updateNote(note.id, { title: editTitle, content: editContent });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setIsEditing(false);
  };

  const handleDelete = () => {
    Alert.alert("Eliminar nota", "¿Estás segura?", [
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
    ]);
  };

  const handleArchive = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    archiveNote(note.id);
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: theme.colors.background }}
    >
      {/* Header con botones */}
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
                fontSize: 24,
                fontWeight: "700",
                marginBottom: 12,
                borderBottomWidth: 1,
                borderBottomColor: theme.colors.border,
                paddingBottom: 8,
              }}
            />
            <TextInput
              value={editContent}
              onChangeText={setEditContent}
              placeholder="Contenido..."
              placeholderTextColor={theme.colors.textSecondary}
              multiline
              style={{
                color: theme.colors.text,
                fontSize: 16,
                lineHeight: 24,
                minHeight: 200,
                textAlignVertical: "top",
              }}
            />
          </>
        ) : (
          <>
            <Text style={{ color: theme.colors.text, fontSize: 24, fontWeight: "700", marginBottom: 6 }}>
              {note.title}
            </Text>
            <Text style={{ color: theme.colors.textSecondary, fontSize: 13, marginBottom: 20 }}>
              {new Date(note.updatedAt).toLocaleDateString("es-ES")}
            </Text>
            <Text style={{ color: theme.colors.text, fontSize: 16, lineHeight: 24 }}>
              {note.content}
            </Text>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}