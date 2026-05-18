import { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Ionicons } from "@expo/vector-icons";

import { useNotesStore } from "@/store/notesStore";
import { ChecklistCard } from "@/components/items/ChecklistCard";
import { AddButton } from "@/components/AddButton";
import { useTheme } from "@/hooks/useTheme";

export default function ChecklistsScreen() {
  const theme = useTheme();

  const allChecklists = useNotesStore((state) => state.checklists);
  const checklists = allChecklists.filter((c) => !c.isArchived);

  const [search, setSearch] = useState("");

  const filtered = checklists.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* HEADER */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 8,
        }}
      >
        <View>
          <Text
            style={{
              color: theme.colors.text,
              fontSize: 26,
              fontWeight: "600",
            }}
          >
            Tareas
          </Text>

          <Text
            style={{
              color: theme.colors.textSecondary,
              fontSize: 12,
              marginTop: 2,
            }}
          >
            {checklists.length}{" "}
            {checklists.length === 1 ? "lista" : "listas"}
          </Text>
        </View>
      </View>

      {/* BUSCADOR */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: theme.colors.surface,
          marginHorizontal: 20,
          paddingHorizontal: 14,
          borderRadius: 22,
          borderWidth: 1,
          borderColor: theme.colors.border,
          marginBottom: 14,
        }}
      >
        <Ionicons
          name="search"
          size={16}
          color={theme.colors.textSecondary}
        />

        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar..."
          placeholderTextColor={theme.colors.textSecondary}
          style={{
            flex: 1,
            color: theme.colors.text,
            paddingVertical: 8,
            paddingHorizontal: 10,
            fontSize: 13,
          }}
        />
      </View>

      {/* CONTENIDO */}
      {filtered.length === 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <Text
            style={{
              color: theme.colors.text,
              fontSize: 16,
              fontWeight: "600",
              marginBottom: 8,
            }}
          >
            {checklists.length === 0
              ? "No tienes tareas todavía"
              : "Sin resultados"}
          </Text>

          <Text
            style={{
              color: theme.colors.textSecondary,
              fontSize: 14,
              textAlign: "center",
            }}
          >
            {checklists.length === 0
              ? "Toca el + para crear tu primera lista."
              : "Prueba con otra búsqueda."}
          </Text>
        </View>
      ) : (
        <View style={{ flex: 1, paddingHorizontal: 20 }}>
          <FlashList
            data={filtered}
            renderItem={({ item, index }) => (
              <ChecklistCard checklist={item} index={index} />
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
      )}

      {/* BOTÓN FLOTANTE */}
      <AddButton type="checklist" />
    </View>
  );
}