import { View, Text, Pressable } from "react-native";
import Animated, { FadeInDown, FadeOutLeft } from "react-native-reanimated";
import { router } from "expo-router";
import type { IdeaNote } from "@/types";
import { useTheme } from "@/hooks/useTheme";

interface IdeaCardProps {
  idea: IdeaNote;
  index?: number;
}

function getRotation(index: number) {
  const rotations = [-1, 0.7, -0.5, 1.2, -0.8, 0.5];
  return rotations[index % rotations.length];
}

export function IdeaCard({ idea, index = 0 }: IdeaCardProps) {
  const theme = useTheme();

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50).duration(300)}
      exiting={FadeOutLeft.duration(200)}
      style={{
        transform: [{ rotate: `${getRotation(index)}deg` }],
        marginBottom: 14,
      }}
    >
      <Pressable
        onPress={() => router.push(`/ideas/${idea.id}`)}
        style={{
          backgroundColor: idea.color || "#FFE4F1",
          padding: 16,
          borderRadius: 2,
          shadowColor: "#000",
          shadowOffset: { width: 2, height: 3 },
          shadowOpacity: 0.1,
          shadowRadius: 0,
          elevation: 2,
        }}
      >
        <Text style={{ color: "#2A2A2A", fontSize: 17, fontWeight: "600", marginBottom: 10 }}>
          {idea.title}
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
          {idea.tags.map((tag, idx) => (
            <View
              key={idx}
              style={{
                backgroundColor: "rgba(0,0,0,0.1)",
                paddingVertical: 2,
                paddingHorizontal: 10,
                borderRadius: 10,
              }}
            >
              <Text style={{ color: "#2A2A2A", fontSize: 11, fontWeight: "500" }}>
                #{tag}
              </Text>
            </View>
          ))}
        </View>
      </Pressable>
    </Animated.View>
  );
}