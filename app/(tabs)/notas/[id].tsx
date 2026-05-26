import { useState } from "react";
import { View, Text, TextInput, ScrollView, Pressable, KeyboardAvoidingView, Platform, Modal } from "react-native";
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

  // Estado para controlar el menú de eliminación inferior
  const [showDeleteSheet, setShowDeleteSheet] = useState(false);

  if (!note) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.colors.background }}>
        <Text style={{ color: theme.colors.text }}>Nota no encontrada</Text>
      </View>
    );
  }

  const handleSave = () => {
    if (editTitle.trim().length < 3) {
      setIsEditing(false);
      return;
    }
    updateNote(note.id, { title: editTitle, content: editContent });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setIsEditing(false);
  };

  // Abre el panel inferior
  const handleDeleteTrigger = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowDeleteSheet(true);
  };

  // Ejecuta el borrado real de la nota
  const confirmDelete = () => {
    setShowDeleteSheet(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    deleteNote(note.id);
    router.back();
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

      {/* PANEL BOTTOM SHEET NEGRO SUPERPUESTO DIRECTAMENTE SIN CAPA OPACA */}
      <Modal
        visible={showDeleteSheet}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDeleteSheet(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: "transparent", // Cambiado a transparente para no oscurecer tu app negra
          justifyContent: "flex-end",
        }}>
          
          <Pressable style={{ flex: 1 }} onPress={() => setShowDeleteSheet(false)} />

          <View style={{
            backgroundColor: theme.colors.surface || "#1E1E1E", // Sigue la estética oscura de tu app
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            paddingHorizontal: 24,
            paddingTop: 16,
            paddingBottom: Platform.OS === "ios" ? 44 : 24,
            borderTopWidth: 1,
            borderColor: theme.colors.border,
            // Sombra acentuada para crear separación real sobre el fondo nítido
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 20,
          }}>
            
            {/* Indicador táctil superior */}
            <View style={{
              width: 36,
              height: 4,
              backgroundColor: theme.colors.border,
              borderRadius: 2,
              alignSelf: "center",
              marginBottom: 24,
            }} />

            <Text style={{ color: theme.colors.text, fontSize: 18, fontWeight: "700", textAlign: "center", marginBottom: 8 }}>
              ¿Eliminar nota?
            </Text>

            <Text style={{ color: theme.colors.textSecondary, fontSize: 14, textAlign: "center", marginBottom: 28, lineHeight: 20 }}>
              Esta acción no se puede deshacer. Tu nota se perderá permanentemente.
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
                  backgroundColor: "#FF6B6B", // Rojo minimalista suave
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