import { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, ScrollView, Pressable, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useNotesStore } from "@/store/notesStore";
import { useTheme } from "@/hooks/useTheme";

export default function ChecklistDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();

  const checklist = useNotesStore((state) => state.checklists.find((c) => c.id === id));
  const updateChecklist = useNotesStore((state) => state.updateChecklist);
  const toggleItem = useNotesStore((state) => state.toggleChecklistItem);
  const deleteChecklist = useNotesStore((state) => state.deleteChecklist);
  const archiveChecklist = useNotesStore((state) => state.archiveChecklist);

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(checklist?.title ?? "");
  const [editItems, setEditItems] = useState<string[]>(checklist?.items.map((i) => i.text) ?? [""]);

  // Haptic cuando se completan todas
  const wasAllCompleted = useRef(false);
  useEffect(() => {
    if (!checklist) return;
    const all = checklist.items.length > 0 && checklist.items.every((i) => i.isCompleted);
    if (all && !wasAllCompleted.current) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    wasAllCompleted.current = all;
  }, [checklist]);

  if (!checklist) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.colors.background }}>
        <Text style={{ color: theme.colors.text }}>Lista no encontrada</Text>
      </View>
    );
  }

  const handleSave = () => {
    if (editTitle.trim().length < 3) {
      Alert.alert("Error", "El título debe tener al menos 3 caracteres");
      return;
    }
    const cleanItems = editItems.filter((t) => t.trim().length > 0);
    if (cleanItems.length === 0) {
      Alert.alert("Error", "Añade al menos una tarea");
      return;
    }
    // Conservamos el estado isCompleted de los items existentes por orden
    const newItems = cleanItems.map((text, idx) => {
      const existing = checklist.items[idx];
      return {
        id: existing?.id ?? `${checklist.id}-${Date.now()}-${idx}`,
        text,
        isCompleted: existing?.isCompleted ?? false,
      };
    });
    updateChecklist(checklist.id, { title: editTitle, items: newItems });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setIsEditing(false);
  };

  const handleDelete = () => {
    Alert.alert("Eliminar lista", "¿Estás segura?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          deleteChecklist(checklist.id);
          router.back();
        },
      },
    ]);
  };

  const handleArchive = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    archiveChecklist(checklist.id);
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: theme.colors.background }}
    >
      {/* Header */}
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
                marginBottom: 16,
                borderBottomWidth: 1,
                borderBottomColor: theme.colors.border,
                paddingBottom: 8,
              }}
            />
            {editItems.map((text, idx) => (
              <View key={idx} style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                <TextInput
                  value={text}
                  onChangeText={(v) => {
                    const copy = [...editItems];
                    copy[idx] = v;
                    setEditItems(copy);
                  }}
                  placeholder={`Tarea ${idx + 1}`}
                  placeholderTextColor={theme.colors.textSecondary}
                  style={{
                    flex: 1,
                    backgroundColor: theme.colors.surface,
                    color: theme.colors.text,
                    padding: 10,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                    fontSize: 14,
                  }}
                />
                {editItems.length > 1 && (
                  <Pressable
                    onPress={() => setEditItems(editItems.filter((_, i) => i !== idx))}
                    style={{ marginLeft: 8 }}
                  >
                    <Ionicons name="close-circle" size={20} color={theme.colors.textSecondary} />
                  </Pressable>
                )}
              </View>
            ))}
            <Pressable
              onPress={() => setEditItems([...editItems, ""])}
              style={{
                paddingVertical: 10,
                alignItems: "center",
                borderWidth: 1,
                borderColor: theme.colors.border,
                borderRadius: 8,
                borderStyle: "dashed",
              }}
            >
              <Text style={{ color: theme.colors.text, fontSize: 13 }}>+ Añadir tarea</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Text style={{ color: theme.colors.text, fontSize: 24, fontWeight: "700", marginBottom: 16 }}>
              {checklist.title}
            </Text>
            {checklist.items.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => {
                  Haptics.selectionAsync();
                  toggleItem(checklist.id, item.id);
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: theme.colors.border,
                }}
              >
                <Ionicons
                  name={item.isCompleted ? "checkbox" : "square-outline"}
                  size={24}
                  color={item.isCompleted ? theme.colors.text : theme.colors.textSecondary}
                />
                <Text
                  style={{
                    color: item.isCompleted ? theme.colors.textSecondary : theme.colors.text,
                    fontSize: 15,
                    marginLeft: 10,
                    flex: 1,
                    textDecorationLine: item.isCompleted ? "line-through" : "none",
                  }}
                >
                  {item.text}
                </Text>
              </Pressable>
            ))}
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}