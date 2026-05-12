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
  const checklists = useNotesStore((state) => state.checklists);
  const [search, setSearch] = useState("");

  const filtered = checklists.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: theme.colors.surface,
          margin: theme.spacing.md,
          paddingHorizontal: theme.spacing.md,
          borderRadius: theme.radius.md,
          borderWidth: 1,
          borderColor: theme.colors.border,
        }}
      >
        <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar tareas..."
          placeholderTextColor={theme.colors.textSecondary}
          style={{
            flex: 1,
            color: theme.colors.text,
            padding: theme.spacing.sm,
            fontSize: theme.typography.sizes.base,
            marginLeft: theme.spacing.sm,
          }}
        />
      </View>

      {filtered.length === 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: theme.spacing.lg,
          }}
        >
          <Text
            style={{
              color: theme.colors.text,
              fontSize: theme.typography.sizes.lg,
              fontWeight: theme.typography.weights.semibold,
              marginBottom: theme.spacing.sm,
            }}
          >
            {checklists.length === 0 ? "No tienes tareas todavía" : "Sin resultados"}
          </Text>
          <Text
            style={{
              color: theme.colors.textSecondary,
              fontSize: theme.typography.sizes.base,
              textAlign: "center",
            }}
          >
            {checklists.length === 0
              ? "Toca el botón + para crear tu primera lista."
              : "Prueba con otra búsqueda."}
          </Text>
        </View>
      ) : (
        <View style={{ flex: 1, paddingHorizontal: theme.spacing.md }}>
          <FlashList
            data={filtered}
            renderItem={({ item, index }) => <ChecklistCard checklist={item} index={index} />}
            keyExtractor={(item) => item.id}
          />
        </View>
      )}

      <AddButton type="checklist" />
    </View>
  );
}