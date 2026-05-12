import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useNotesStore } from "@/store/notesStore";
import { useTheme } from "@/hooks/useTheme";
import { useEffect, useRef } from "react";

export default function ChecklistDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const checklist = useNotesStore((state) => state.checklists.find((c) => c.id === id));
  const toggleItem = useNotesStore((state) => state.toggleChecklistItem);
  const deleteChecklist = useNotesStore((state) => state.deleteChecklist);

  // Detectar cuando se completan todas las tareas para hacer haptic de éxito
  const wasAllCompleted = useRef(false);
  useEffect(() => {
    if (!checklist) return;
    const allCompleted = checklist.items.length > 0 && checklist.items.every((i) => i.isCompleted);
    if (allCompleted && !wasAllCompleted.current) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    wasAllCompleted.current = allCompleted;
  }, [checklist]);

  if (!checklist) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.colors.background }}>
        <Text style={{ color: theme.colors.text }}>Lista no encontrada</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      "Eliminar lista",
      "¿Estás segura de que quieres eliminar esta lista?",
      [
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
      ]
    );
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }} contentContainerStyle={{ padding: theme.spacing.lg }}>
      <Text style={{ color: theme.colors.text, fontSize: theme.typography.sizes["2xl"], fontWeight: theme.typography.weights.bold, marginBottom: theme.spacing.lg }}>
        {checklist.title}
      </Text>

      {checklist.items.map((item) => (
        <Pressable
          key={item.id}
          onPress={() => toggleItem(checklist.id, item.id)}
          style={{ flexDirection: "row", alignItems: "center", paddingVertical: theme.spacing.sm, borderBottomWidth: 1, borderBottomColor: theme.colors.border }}
        >
          <Ionicons
            name={item.isCompleted ? "checkbox" : "square-outline"}
            size={24}
            color={item.isCompleted ? theme.colors.primary : theme.colors.textSecondary}
          />
          <Text
            style={{
              color: item.isCompleted ? theme.colors.textSecondary : theme.colors.text,
              fontSize: theme.typography.sizes.base,
              marginLeft: theme.spacing.sm,
              flex: 1,
              textDecorationLine: item.isCompleted ? "line-through" : "none",
            }}
          >
            {item.text}
          </Text>
        </Pressable>
      ))}

      <Pressable
        onPress={handleDelete}
        style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", padding: theme.spacing.md, marginTop: theme.spacing.xl, borderRadius: theme.radius.md, borderWidth: 1, borderColor: "#D33" }}
      >
        <Ionicons name="trash-outline" size={20} color="#D33" />
        <Text style={{ color: "#D33", fontSize: theme.typography.sizes.base, marginLeft: theme.spacing.sm }}>Eliminar lista</Text>
      </Pressable>
    </ScrollView>
  );
}