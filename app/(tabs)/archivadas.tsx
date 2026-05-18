import { View, Text, ScrollView, Pressable } from "react-native";
import { useNotesStore } from "@/store/notesStore";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";

export default function ArchivadasScreen() {
  const theme = useTheme();

  // ---------------- STORE ACTIONS ----------------
  const unarchiveNote = useNotesStore((s) => s.unarchiveNote);
  const deleteNote = useNotesStore((s) => s.deleteNote);

  const unarchiveChecklist = useNotesStore((s) => s.unarchiveChecklist);
  const deleteChecklist = useNotesStore((s) => s.deleteChecklist);

  const unarchiveIdea = useNotesStore((s) => s.unarchiveIdea);
  const deleteIdea = useNotesStore((s) => s.deleteIdea);

  // ---------------- RAW STATE (IMPORTANTE) ----------------
  const notes = useNotesStore((s) => s.notes);
  const checklists = useNotesStore((s) => s.checklists);
  const ideas = useNotesStore((s) => s.ideas);

  // ---------------- FILTER OUTSIDE HOOK ----------------
  const archivedNotes = notes.filter((n) => n.isArchived);
  const archivedChecklists = checklists.filter((c) => c.isArchived);
  const archivedIdeas = ideas.filter((i) => i.isArchived);

  const total =
    archivedNotes.length +
    archivedChecklists.length +
    archivedIdeas.length;

  // ---------------- UI COMPONENTS ----------------
  const Card = ({ children }: any) => (
    <View
      style={{
        backgroundColor: theme.colors.surface,
        padding: 14,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: theme.colors.border,
      }}
    >
      {children}
    </View>
  );

  const ActionBtn = ({ onPress, icon }: any) => (
    <Pressable onPress={onPress} style={{ marginLeft: 10 }}>
      <Ionicons name={icon} size={20} color={theme.colors.text} />
    </Pressable>
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={{ padding: 20 }}
    >
      <Text
        style={{
          color: theme.colors.text,
          fontSize: 26,
          fontWeight: "600",
          marginBottom: 20,
        }}
      >
        Archivadas
      </Text>

      {total === 0 ? (
        <Text
          style={{
            color: theme.colors.textSecondary,
            textAlign: "center",
            marginTop: 40,
          }}
        >
          No tienes nada archivado.
        </Text>
      ) : (
        <>
          {/* ---------------- NOTES ---------------- */}
          {archivedNotes.map((n) => (
            <Card key={n.id}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ color: theme.colors.text }}>
                  📝 {n.title}
                </Text>

                <View style={{ flexDirection: "row" }}>
                  <ActionBtn
                    icon="arrow-undo"
                    onPress={() => unarchiveNote(n.id)}
                  />
                  <ActionBtn
                    icon="trash"
                    onPress={() => deleteNote(n.id)}
                  />
                </View>
              </View>
            </Card>
          ))}

          {/* ---------------- CHECKLISTS ---------------- */}
          {archivedChecklists.map((c) => (
            <Card key={c.id}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ color: theme.colors.text }}>
                  ✓ {c.title}
                </Text>

                <View style={{ flexDirection: "row" }}>
                  <ActionBtn
                    icon="arrow-undo"
                    onPress={() => unarchiveChecklist(c.id)}
                  />
                  <ActionBtn
                    icon="trash"
                    onPress={() => deleteChecklist(c.id)}
                  />
                </View>
              </View>
            </Card>
          ))}

          {/* ---------------- IDEAS ---------------- */}
          {archivedIdeas.map((i) => (
            <Card key={i.id}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ color: theme.colors.text }}>
                  💡 {i.title}
                </Text>

                <View style={{ flexDirection: "row" }}>
                  <ActionBtn
                    icon="arrow-undo"
                    onPress={() => unarchiveIdea(i.id)}
                  />
                  <ActionBtn
                    icon="trash"
                    onPress={() => deleteIdea(i.id)}
                  />
                </View>
              </View>
            </Card>
          ))}
        </>
      )}
    </ScrollView>
  );
}