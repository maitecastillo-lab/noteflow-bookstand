import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const mode = colorScheme === "dark" ? "dark" : "light";

  return (
    <GluestackUIProvider mode={mode}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="nueva-nota"
          options={{
            presentation: "modal",
            title: "Nueva nota",
          }}
        />
      </Stack>
    </GluestackUIProvider>
  );
}