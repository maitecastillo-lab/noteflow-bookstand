import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Stack } from "expo-router";
import { useThemeStore } from "@/store/themeStore";

export default function RootLayout() {
  const mode = useThemeStore((state) => state.mode);

  return (
    <GluestackUIProvider mode={mode}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="nueva-nota"
          options={{ presentation: "modal" }}
        />
      </Stack>
    </GluestackUIProvider>
  );
}