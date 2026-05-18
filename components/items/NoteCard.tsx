import { Pressable, View, Text } from "react-native";
import Animated, { FadeInDown, FadeOutLeft } from "react-native-reanimated";
import { router } from "expo-router";
import type { Note } from "@/types";
import { useTheme } from "@/hooks/useTheme";

interface NoteCardProps {
  note: Note;
  index?: number;
}

export function NoteCard({ note, index = 0 }: NoteCardProps) {
  const theme = useTheme();

  const preview = note.content.length > 80 ? note.content.substring(0, 80) + "..." : note.content;
  const formattedDate = new Date(note.updatedAt).toLocaleDateString("es-ES");

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50).duration(300)}
      exiting={FadeOutLeft.duration(200)}
    >
      <Pressable
        onPress={() => router.push(`/notas/${note.id}`)}
        style={{
          flexDirection: "row",
          backgroundColor: theme.colors.surface,
          borderRadius: 12,
          overflow: "hidden",
          marginBottom: 12,
          shadowColor: "#000",
          shadowOpacity: 0.05,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 2 },
          elevation: 2,
        }}
      >
        {/* BARRA negra a la izquierda */}
        <View style={{ width: 5, backgroundColor: theme.colors.text }} />

        {/* Contenido */}
        <View style={{ flex: 1, padding: 16 }}>
          <Text
            numberOfLines={1}
            style={{
              color: theme.colors.text,
              fontSize: 17,
              fontWeight: "600",
              marginBottom: 4,
            }}
          >
            {note.title}
          </Text>
          <Text style={{ color: theme.colors.textSecondary, fontSize: 12, marginBottom: 6 }}>
            {formattedDate}
          </Text>
          <Text
            numberOfLines={2}
            style={{ color: theme.colors.textSecondary, fontSize: 14, lineHeight: 20 }}
          >
            {preview}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}