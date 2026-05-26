import "@/global.css";
import { useEffect, useState } from "react";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Stack, useRouter, useSegments } from "expo-router";
import { useThemeStore } from "@/store/themeStore";
import { useNotesStore } from "@/store/notesStore";
import { getToken } from "@/lib/auth";
import { View, ActivityIndicator } from "react-native";

export default function RootLayout() {
  const mode = useThemeStore((state) => state.mode);
  const router = useRouter();
  const segments = useSegments();
  const [ready, setReady] = useState(false);
  const [hasToken, setHasToken] = useState<boolean | null>(null);

  // Comprobar token al arrancar (solo una vez)
  useEffect(() => {
    const init = async () => {
      try {
        const token = await getToken();
        if (token) {
          setHasToken(true);
          // Cargar notas del backend
          await useNotesStore.getState().fetchAll();
        } else {
          setHasToken(false);
        }
      } catch (e) {
        console.error(e);
        setHasToken(false);
      } finally {
        setReady(true);
      }
    };
    init();
  }, []);

  // Redirigir según token
  useEffect(() => {
    if (!ready || hasToken === null) return;

    const inAuthScreen = segments[0] === "login" || segments[0] === "register";

    if (!hasToken && !inAuthScreen) {
      router.replace("/login");
    } else if (hasToken && inAuthScreen) {
      router.replace("/(tabs)");
    }
  }, [ready, hasToken, segments, router]);

  if (!ready) {
    return (
      <GluestackUIProvider mode={mode}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" />
        </View>
      </GluestackUIProvider>
    );
  }

  return (
    <GluestackUIProvider mode={mode}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen
          name="nueva-nota"
          options={{ presentation: "modal" }}
        />
      </Stack>
    </GluestackUIProvider>
  );
}