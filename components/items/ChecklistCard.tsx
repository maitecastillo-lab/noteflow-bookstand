import { View, Text, Pressable } from "react-native";
import Animated, { FadeInDown, FadeOutLeft } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import type { ChecklistNote } from "@/types";
import { useTheme } from "@/hooks/useTheme";

interface ChecklistCardProps {
  checklist: ChecklistNote;
  index?: number;
}

export function ChecklistCard({ checklist, index = 0 }: ChecklistCardProps) {
  const theme = useTheme();

  const completedCount = checklist.items.filter((i) => i.isCompleted).length;
  const totalCount = checklist.items.length;
  const previewItems = checklist.items.slice(0, 3); // máximo 3 de previa
  const remainingItems = totalCount - 3;

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50).duration(300)}
      exiting={FadeOutLeft.duration(200)}
    >
      <Pressable
        onPress={() => router.push(`/checklists/${checklist.id}`)}
        style={{
          backgroundColor: theme.colors.surface,
          borderRadius: 12,
          padding: 16,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: theme.colors.border,
        }}
      >
        {/* Cabecera con título y contador */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Text style={{ color: theme.colors.text, fontSize: 16, fontWeight: "600", flex: 1 }}>
            {checklist.title}
          </Text>
          <View
            style={{
              backgroundColor: theme.colors.background,
              paddingVertical: 2,
              paddingHorizontal: 10,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: theme.colors.border,
            }}
          >
            <Text style={{ color: theme.colors.textSecondary, fontSize: 11, fontWeight: "500" }}>
              {completedCount}/{totalCount}
            </Text>
          </View>
        </View>

        {/* Lista de tareas (preview de máximo 3) */}
        {previewItems.map((item) => (
          <View
            key={item.id}
            style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}
          >
            <Ionicons
              name={item.isCompleted ? "checkbox" : "square-outline"}
              size={16}
              color={item.isCompleted ? theme.colors.text : theme.colors.textSecondary}
              style={{ marginRight: 8 }}
            />
            <Text
              numberOfLines={1}
              style={{
                color: item.isCompleted ? theme.colors.textSecondary : theme.colors.text,
                fontSize: 13,
                flex: 1,
                textDecorationLine: item.isCompleted ? "line-through" : "none",
              }}
            >
              {item.text}
            </Text>
          </View>
        ))}

        {/* Indicador de "y X más" */}
        {remainingItems > 0 && (
          <Text style={{ color: theme.colors.textSecondary, fontSize: 12, marginTop: 4 }}>
            ...y {remainingItems} {remainingItems === 1 ? "más" : "más"}
          </Text>
        )}
      </Pressable>
    </Animated.View>
  );
}