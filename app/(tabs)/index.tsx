import { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Ionicons } from "@expo/vector-icons";
import { useNotesStore } from "@/store/notesStore";
import { NoteCard } from "@/components/items/NoteCard";
import { AddButton } from "@/components/AddButton";
import { useTheme } from "@/hooks/useTheme";

export default function NotesScreen() {
  const theme = useTheme();
  const notes = useNotesStore((state) =>
    state.notes.filter((n) => !n.isArchived)
  );
  const [search, setSearch] = useState("");

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase())
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
          placeholder="Buscar notas..."
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

      {filteredNotes.length === 0 ? (
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
            {notes.length === 0 ? "No tienes notas todavía" : "Sin resultados"}
          </Text>
          <Text
            style={{
              color: theme.colors.textSecondary,
              fontSize: theme.typography.sizes.base,
              textAlign: "center",
            }}
          >
            {notes.length === 0
              ? "Toca el botón + para crear tu primera nota."
              : "Prueba con otra búsqueda."}
          </Text>
        </View>
      ) : (
        <View style={{ flex: 1, paddingHorizontal: theme.spacing.md }}>
          <FlashList
            data={filteredNotes}
            renderItem={({ item, index }) => (
              <NoteCard note={item} index={index} />
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
      )}

      <AddButton type="note" />
    </View>
  );
}