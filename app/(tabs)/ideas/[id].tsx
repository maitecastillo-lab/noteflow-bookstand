import { useState } from "react";
import { View, Text, TextInput, ScrollView, Pressable, KeyboardAvoidingView, Platform, Modal } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useNotesStore } from "@/store/notesStore";
import { useTheme } from "@/hooks/useTheme";

export default function IdeaDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();

  const idea = useNotesStore((state) => state.ideas.find((i) => i.id === id));
  const updateIdea = useNotesStore((state) => state.updateIdea);
  const deleteIdea = useNotesStore((state) => state.deleteIdea);
  const archiveIdea = useNotesStore((state) => state.archiveIdea);

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(idea?.title ?? "");
  const [editColor, setEditColor] = useState(idea?.color ?? "#FFD6A5");
  const [editTags, setEditTags] = useState(idea?.tags.join(", ") ?? "");

  const [showDeleteSheet, setShowDeleteSheet] = useState(false);

  if (!idea) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.colors.background }}>
        <Text style={{ color: theme.colors.text }}>Idea no encontrada</Text>
      </View>
    );
  }

  const handleSave = () => {
    if (editTitle.trim().length < 3) {
      setIsEditing(false);
      return;
    }
    const tags = editTags.split(",").map((t) => t.trim()).filter((t) => t.length > 0);
    updateIdea(idea.id, { title: editTitle, color: editColor, tags });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setIsEditing(false);
  };

  const handleDeleteTrigger = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowDeleteSheet(true);
  };

  // 🛠️ CORRECCIÓN 1: Forzar redirección directa a la lista de ideas al eliminar
  const confirmDelete = () => {
    setShowDeleteSheet(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    deleteIdea(idea.id);
    router.replace("/ideas"); 
  };

  // 🛠️ CORRECCIÓN 2: Forzar redirección directa a la lista de ideas al archivar
  const handleArchive = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    archiveIdea(idea.id);
    router.replace("/ideas");
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
        {/* 🛠️ CORRECCIÓN 3: La flecha de volver atrás ahora va directa a /ideas */}
        <Pressable onPress={() => router.replace("/ideas")}>
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
              <Pressable onPress={handleDeleteTrigger}>
                <Ionicons name="trash-outline" size={22} color="#FF6B6B" />
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
              {["#FFD6A5", "#FDFFB6", "#CAFFBF", "#9BF6FF", "#A0C4FF", "#BDB2FF", "#FFC6FF", "#FFE4F1"].map((c) => (
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

      {/* PANEL BOTTOM SHEET NEGRO MODERNO SOBREPUESTO SIN OPACIDAD ATRÁS */}
      <Modal
        visible={showDeleteSheet}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDeleteSheet(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: "transparent", 
          justifyContent: "flex-end",
        }}>
          
          <Pressable style={{ flex: 1 }} onPress={() => setShowDeleteSheet(false)} />

          <View style={{
            backgroundColor: theme.colors.surface || "#1E1E1E", 
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            paddingHorizontal: 24,
            paddingTop: 16,
            paddingBottom: Platform.OS === "ios" ? 44 : 24,
            borderTopWidth: 1,
            borderColor: theme.colors.border,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 20,
          }}>
            
            <View style={{
              width: 36,
              height: 4,
              backgroundColor: theme.colors.border,
              borderRadius: 2,
              alignSelf: "center",
              marginBottom: 24,
            }} />

            <Text style={{ color: theme.colors.text, fontSize: 18, fontWeight: "700", textAlign: "center", marginBottom: 8 }}>
              ¿Eliminar idea?
            </Text>

            <Text style={{ color: theme.colors.textSecondary, fontSize: 14, textAlign: "center", marginBottom: 28, lineHeight: 20 }}>
              Esta acción no se puede deshacer. Tu idea se perderá permanentemente.
            </Text>

            <View style={{ flexDirection: "row", gap: 12 }}>
              <Pressable
                onPress={() => setShowDeleteSheet(false)}
                style={{
                  flex: 1,
                  backgroundColor: theme.colors.border,
                  paddingVertical: 16,
                  borderRadius: 14,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: theme.colors.text, fontWeight: "600", fontSize: 15 }}>
                  Cancelar
                </Text>
              </Pressable>

              <Pressable
                onPress={confirmDelete}
                style={{
                  flex: 1,
                  backgroundColor: "#FF6B6B", 
                  paddingVertical: 16,
                  borderRadius: 14,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#FFF", fontWeight: "600", fontSize: 15 }}>
                  Eliminar
                </Text>
              </Pressable>
            </View>

          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}