import { View, Text, ScrollView, Pressable } from "react-native";
import { useThemeStore } from "@/store/themeStore";
import { useTheme } from "@/hooks/useTheme";
import { useNotesStore } from "@/store/notesStore";
import { Ionicons } from "@expo/vector-icons";

export default function SettingsScreen() {
  const theme = useTheme();
  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);
  const notes = useNotesStore((s) => s.notes);
  const checklists = useNotesStore((s) => s.checklists);
  const ideas = useNotesStore((s) => s.ideas);

  const options: {
    value: "light" | "dark";
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
  }[] = [
    { value: "light", label: "Claro", icon: "sunny-outline" },
    { value: "dark", label: "Oscuro", icon: "moon-outline" },
  ];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={{ padding: 20, paddingTop: 60 }}
    >
      <Text
        style={{
          color: theme.colors.text,
          fontSize: 26,
          fontWeight: "600",
          marginBottom: 20,
        }}
      >
        Ajustes
      </Text>

      <Text
        style={{
          color: theme.colors.text,
          fontSize: 14,
          fontWeight: "600",
          marginBottom: 10,
        }}
      >
        Tema
      </Text>
      <View style={{ flexDirection: "row", gap: 8, marginBottom: 24 }}>
        {options.map((opt) => {
          const selected = mode === opt.value;
          return (
            <Pressable
              key={opt.value}
              onPress={() => setMode(opt.value)}
              style={{
                flex: 1,
                paddingVertical: 14,
                borderRadius: 10,
                backgroundColor: selected ? theme.colors.text : theme.colors.surface,
                borderWidth: 1,
                borderColor: selected ? theme.colors.text : theme.colors.border,
                alignItems: "center",
              }}
            >
              <Ionicons
                name={opt.icon}
                size={20}
                color={selected ? theme.colors.background : theme.colors.text}
              />
              <Text
                style={{
                  color: selected ? theme.colors.background : theme.colors.text,
                  fontSize: 12,
                  marginTop: 4,
                  fontWeight: "500",
                }}
              >
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text
        style={{
          color: theme.colors.text,
          fontSize: 14,
          fontWeight: "600",
          marginBottom: 10,
        }}
      >
        Estadísticas
      </Text>
      <View
        style={{
          backgroundColor: theme.colors.surface,
          padding: 14,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: theme.colors.border,
        }}
      >
        <Text style={{ color: theme.colors.text, fontSize: 14, marginBottom: 6 }}>
          Notas: {notes.length}
        </Text>
        <Text style={{ color: theme.colors.text, fontSize: 14, marginBottom: 6 }}>
          Lista de tareas: {checklists.length}
        </Text>
        <Text style={{ color: theme.colors.text, fontSize: 14 }}>
          Ideas: {ideas.length}
        </Text>
      </View>
    </ScrollView>
  );
}