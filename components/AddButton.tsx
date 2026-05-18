import { Pressable } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function AddButton({ type }: { type: "note" | "checklist" | "idea" }) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Pressable
      onPress={() => router.push(`/nueva-nota?type=${type}`)}
      style={{
        position: "absolute",
        bottom: insets.bottom + 20, // 👈 aquí
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: theme.colors.text,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 10,
        zIndex: 999,
      }}
    >
      <Ionicons name="add" size={32} color={theme.colors.background} />
    </Pressable>
  );
}