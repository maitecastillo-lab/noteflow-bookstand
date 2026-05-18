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

  const allIdeas = useNotesStore((state) => state.ideas);
  const ideas = allIdeas.filter((i) => !i.isArchived);

  const [search, setSearch] = useState("");

  const filtered = ideas.filter(
    (i) =>
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.tags.some((t) =>
        t.toLowerCase().includes(search.toLowerCase())
      )
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
            Ideas
          </Text>

          <Text
            style={{
              color: theme.colors.textSecondary,
              fontSize: 12,
              marginTop: 2,
            }}
          >
            {ideas.length}{" "}
            {ideas.length === 1 ? "idea" : "ideas"}
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
          placeholder="Buscar ideas o etiquetas..."
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
            {ideas.length === 0
              ? "No tienes ideas todavía"
              : "Sin resultados"}
          </Text>

          <Text
            style={{
              color: theme.colors.textSecondary,
              fontSize: 14,
              textAlign: "center",
            }}
          >
            {ideas.length === 0
              ? "Toca el + para apuntar tu primera idea."
              : "Prueba con otra búsqueda."}
          </Text>
        </View>
      ) : (
        <View style={{ flex: 1, paddingHorizontal: 20 }}>
          <FlashList
            data={filtered}
            renderItem={({ item, index }) => (
              <IdeaCard idea={item} index={index} />
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
      )}

      {/* BOTÓN FLOTANTE */}
      <AddButton type="idea" />
    </View>
  );
}