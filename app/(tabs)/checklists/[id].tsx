import { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, ScrollView, Pressable, KeyboardAvoidingView, Platform, Modal, ActivityIndicator } from "react-native";
import { useLocalSearchParams, router, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useNotesStore } from "@/store/notesStore";
import { useTheme } from "@/hooks/useTheme";
import type { ChecklistItem } from "@/types";

export default function ChecklistDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const navigation = useNavigation();

  // Oculta el título automático del navegador
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const fetchAll = useNotesStore((state) => state.fetchAll);
  const isLoadingStore = useNotesStore((state) => state.isLoading);
  const checklist = useNotesStore((state) => state.checklists.find((c) => c.id === id));
  
  const updateChecklist = useNotesStore((state) => state.updateChecklist);
  const toggleItem = useNotesStore((state) => state.toggleChecklistItem);
  const deleteChecklist = useNotesStore((state) => state.deleteChecklist);

  // Estados del formulario controlados
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editItems, setEditItems] = useState<string[]>([]);
  const [showDeleteSheet, setShowDeleteSheet] = useState(false);

  // 🛠️ SI RECARGAS CON F5: Si el store se queda vacío, pedimos los datos al servidor inmediatamente
  useEffect(() => {
    if (!checklist && !isLoadingStore) {
      fetchAll();
    }
  }, [checklist]);

  // 🛠️ ALINEACIÓN DE DATOS: En cuanto la checklist llegue del servidor, rellenamos los inputs de edición
  useEffect(() => {
    if (checklist) {
      setEditTitle(checklist.title);
      setEditItems(checklist.items ? checklist.items.map((i) => i.text) : []);
    }
  }, [checklist]);

  // Haptic cuando se completan todas
  const wasAllCompleted = useRef(false);
  useEffect(() => {
    if (!checklist || !checklist.items) return;
    const all = checklist.items.length > 0 && checklist.items.every((i) => i.isCompleted);
    if (all && !wasAllCompleted.current) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    wasAllCompleted.current = all;
  }, [checklist]);

  // 🛠️ EL MURO DE SEGURIDAD: Si no hay datos todavía, mostramos un indicador de carga.
  // Esto evita que React intente leer variables vacías y rompa la pantalla con errores.
  if (!checklist) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.text} />
        <Text style={{ color: theme.colors.textSecondary, marginTop: 12 }}>Cargando tus tareas...</Text>
      </View>
    );
  }

  // Una vez pasado el muro anterior, ya podemos calcular los totales con total seguridad de que existen
  const totalItems = checklist.items?.length ?? 0;
  const completedItems = checklist.items?.filter((i) => i.isCompleted).length ?? 0;

  const handleSave = () => {
    if (editTitle.trim().length < 3) return;
    
    const cleanItems = editItems.filter((t) => t.trim().length > 0);
    
    const newItems = cleanItems.map((text, idx) => {
      const existing = checklist.items?.[idx];
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: theme.colors.background }}
    >
      {/* Header */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: theme.colors.border }}>
        <Pressable onPress={() => router.replace("/checklists")}>
          <Ionicons name="chevron-back" size={26} color={theme.colors.text} />
        </Pressable>

        <View style={{ flexDirection: "row", gap: 16 }}>
          {isEditing ? (
            <>
              <Pressable onPress={() => { setEditTitle(checklist.title); setEditItems(checklist.items ? checklist.items.map((i) => i.text) : []); setIsEditing(false); }}>
                <Text style={{ color: theme.colors.textSecondary, fontSize: 15 }}>Cancelar</Text>
              </Pressable>
              <Pressable onPress={handleSave}>
                <Text style={{ color: theme.colors.text, fontSize: 15, fontWeight: "600" }}>Guardar</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Pressable onPress={() => setIsEditing(true)}>
                <Ionicons name="create-outline" size={22} color={theme.colors.text} />
              </Pressable>
              <Pressable onPress={() => setShowDeleteSheet(true)}>
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
              style={{ color: theme.colors.text, fontSize: 24, fontWeight: "700", marginBottom: 16, borderBottomWidth: 1, borderBottomColor: theme.colors.border, paddingBottom: 8 }}
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
                  style={{ flex: 1, backgroundColor: theme.colors.surface, color: theme.colors.text, padding: 10, borderRadius: 8, borderWidth: 1, borderColor: theme.colors.border, fontSize: 14 }}
                />
                {editItems.length > 1 && (
                  <Pressable onPress={() => setEditItems(editItems.filter((_, i) => i !== idx))} style={{ marginLeft: 8 }}>
                    <Ionicons name="close-circle" size={20} color={theme.colors.textSecondary} />
                  </Pressable>
                )}
              </View>
            ))}
            <Pressable onPress={() => setEditItems([...editItems, ""])} style={{ paddingVertical: 10, alignItems: "center", borderWidth: 1, borderColor: theme.colors.border, borderRadius: 8, borderStyle: "dashed" }}>
              <Text style={{ color: theme.colors.text, fontSize: 13 }}>+ Añadir tarea</Text>
            </Pressable>
          </>
        ) : (
          /* 💎 TU DISEÑO PREFERIDO: Tarjeta blanca impecable con óvalo contador de progreso */
          <View style={{ backgroundColor: "#FFFFFF", borderRadius: 16, padding: 24, borderWidth: 1, borderColor: "#EAEAEA", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: totalItems > 0 ? 20 : 0 }}>
              <Text style={{ color: "#000000", fontSize: 20, fontWeight: "700", flex: 1, paddingRight: 16 }}>
                {checklist.title}
              </Text>
              
              {totalItems > 0 && (
                <View style={{ backgroundColor: "#F0F0F0", paddingVertical: 4, paddingHorizontal: 12, borderRadius: 12 }}>
                  <Text style={{ color: "#7F7F7F", fontSize: 13, fontWeight: "600" }}>
                    {completedItems}/{totalItems}
                  </Text>
                </View>
              )}
            </View>

            {/* Mapeo de las tareas con sus casillas */}
            {checklist.items && checklist.items.length > 0 ? (
              checklist.items.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => {
                    Haptics.selectionAsync();
                    toggleItem(checklist.id, item.id);
                  }}
                  style={{ flexDirection: "row", alignItems: "center", paddingVertical: 10 }}
                >
                  <Ionicons
                    name={item.isCompleted ? "checkbox" : "square-outline"}
                    size={22}
                    color={item.isCompleted ? "#000000" : "#A0A0A0"}
                  />
                  <Text
                    style={{
                      color: item.isCompleted ? "#A0A0A0" : "#000000",
                      fontSize: 16,
                      marginLeft: 12,
                      flex: 1,
                      textDecorationLine: item.isCompleted ? "line-through" : "none",
                    }}
                  >
                    {item.text}
                  </Text>
                </Pressable>
              ))
            ) : (
              <Text style={{ color: "#A0A0A0", fontSize: 14, marginTop: 12, fontStyle: "italic" }}>
                No hay tareas en esta lista.
              </Text>
            )}
          </View>
        )}
      </ScrollView>

      {/* Modal inferior negro moderno para eliminar */}
      <Modal visible={showDeleteSheet} transparent={true} animationType="slide">
        <View style={{ flex: 1, backgroundColor: "transparent", justifyContent: "flex-end" }}>
          <Pressable style={{ flex: 1 }} onPress={() => setShowDeleteSheet(false)} />
          <View style={{ backgroundColor: theme.colors.surface || "#1E1E1E", borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 24, paddingTop: 16, paddingBottom: Platform.OS === "ios" ? 44 : 24, borderTopWidth: 1, borderColor: theme.colors.border }}>
            <View style={{ width: 36, height: 4, backgroundColor: theme.colors.border, borderRadius: 2, alignSelf: "center", marginBottom: 24 }} />
            <Text style={{ color: theme.colors.text, fontSize: 18, fontWeight: "700", textAlign: "center", marginBottom: 8 }}>
              ¿Eliminar lista de tareas?
            </Text>
            <View style={{ flexDirection: "row", gap: 12, marginTop: 20 }}>
              <Pressable onPress={() => setShowDeleteSheet(false)} style={{ flex: 1, backgroundColor: theme.colors.border, paddingVertical: 16, borderRadius: 14, alignItems: "center" }}>
                <Text style={{ color: theme.colors.text, fontWeight: "600" }}>Cancelar</Text>
              </Pressable>
              <Pressable onPress={() => { deleteChecklist(checklist.id); router.replace("/checklists"); }} style={{ flex: 1, backgroundColor: "#FF6B6B", paddingVertical: 16, borderRadius: 14, alignItems: "center" }}>
                <Text style={{ color: "#FFF", fontWeight: "600" }}>Eliminar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}