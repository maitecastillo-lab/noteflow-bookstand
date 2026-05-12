import { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Ionicons } from "@expo/vector-icons";
import { useNotesStore } from "@/store/notesStore";
import { IdeaCard } from "@/components/items/IdeaCard";
import { AddButton } from "@/components/AddButton";
import { useTheme } from "@/hooks/useTheme";

export default function IdeasScreen() {
  const theme = useTheme();
  const ideas = useNotesStore((state) =>
    state.ideas.filter((i) => !i.isArchived)
  );
  const [search, setSearch] = useState("");

  const filtered = ideas.filter(
    (i) =>
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
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
          placeholder="Buscar ideas o etiquetas..."
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
            {ideas.length === 0 ? "No tienes ideas todavía" : "Sin resultados"}
          </Text>
          <Text
            style={{
              color: theme.colors.textSecondary,
              fontSize: theme.typography.sizes.base,
              textAlign: "center",
            }}
          >
            {ideas.length === 0
              ? "Toca el botón + para apuntar tu primera idea."
              : "Prueba con otra búsqueda."}
          </Text>
        </View>
      ) : (
        <View style={{ flex: 1, paddingHorizontal: theme.spacing.md }}>
          <FlashList
            data={filtered}
            renderItem={({ item, index }) => (
              <IdeaCard idea={item} index={index} />
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
      )}

      <AddButton type="idea" />
    </View>
  );
}