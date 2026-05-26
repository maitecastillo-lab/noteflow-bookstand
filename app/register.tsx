import { useState } from "react";
import { View, Text, TextInput, Pressable, Alert, ActivityIndicator } from "react-native";
import { router } from "expo-router";

import { useTheme } from "@/hooks/useTheme";
import { register as apiRegister } from "@/lib/api";
import { saveToken } from "@/lib/auth";
import { useNotesStore } from "@/store/notesStore";

export default function RegisterScreen() {
  const theme = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Rellena email y contraseña");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);
    try {
      const token = await apiRegister(email, password);
      await saveToken(token);
      await useNotesStore.getState().fetchAll();
      if (typeof window !== "undefined" && window.location) {
        window.location.href = "/";
      } else {
        router.replace("/(tabs)");
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error al registrar";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        justifyContent: "center",
        padding: 24,
      }}
    >
      <Text
        style={{
          color: theme.colors.text,
          fontSize: 32,
          fontWeight: "700",
          marginBottom: 8,
        }}
      >
        Crear cuenta
      </Text>
      <Text
        style={{
          color: theme.colors.textSecondary,
          fontSize: 14,
          marginBottom: 32,
        }}
      >
        Regístrate para empezar a usar NoteFlow
      </Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        placeholderTextColor={theme.colors.textSecondary}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{
          backgroundColor: theme.colors.surface,
          color: theme.colors.text,
          borderColor: theme.colors.border,
          borderWidth: 1,
          borderRadius: 12,
          padding: 14,
          marginBottom: 12,
          fontSize: 14,
        }}
      />

      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Contraseña (mínimo 6 caracteres)"
        placeholderTextColor={theme.colors.textSecondary}
        secureTextEntry
        style={{
          backgroundColor: theme.colors.surface,
          color: theme.colors.text,
          borderColor: theme.colors.border,
          borderWidth: 1,
          borderRadius: 12,
          padding: 14,
          marginBottom: 20,
          fontSize: 14,
        }}
      />

      <Pressable
        onPress={handleRegister}
        disabled={loading}
        style={{
          backgroundColor: theme.colors.text,
          padding: 16,
          borderRadius: 12,
          alignItems: "center",
          opacity: loading ? 0.5 : 1,
        }}
      >
        {loading ? (
          <ActivityIndicator color={theme.colors.background} />
        ) : (
          <Text
            style={{
              color: theme.colors.background,
              fontSize: 14,
              fontWeight: "600",
            }}
          >
            Crear cuenta
          </Text>
        )}
      </Pressable>

      <Pressable
        onPress={() => router.push("/login")}
        style={{ marginTop: 20, alignItems: "center" }}
      >
        <Text style={{ color: theme.colors.textSecondary, fontSize: 13 }}>
          ¿Ya tienes cuenta?{" "}
          <Text style={{ color: theme.colors.text, fontWeight: "600" }}>
            Inicia sesión
          </Text>
        </Text>
      </Pressable>
    </View>
  );
}