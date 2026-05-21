import "@/global.css";
import { useEffect } from "react";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Stack } from "expo-router";
import { useThemeStore } from "@/store/themeStore";
import { useNotesStore } from "@/store/notesStore";

export default function RootLayout() {
  const mode = useThemeStore((state) => state.mode);
  const fetchAll = useNotesStore((state) => state.fetchAll);

  // Cargar las notas del backend al arrancar la app
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

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