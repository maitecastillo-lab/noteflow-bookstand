import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { z } from "zod";
import { useTheme } from "@/hooks/useTheme";
import { useNotesStore } from "@/store/notesStore";
import type { Note, ChecklistNote, IdeaNote, ChecklistItem } from "@/types";

// --- Schemas de validación ---
const noteSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  content: z.string().min(1, "El contenido no puede estar vacío"),
});

const checklistSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  items: z
    .array(z.string().min(1))
    .min(1, "Añade al menos un item"),
});

const ideaSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  color: z.string().min(1, "Elige un color"),
  tags: z.array(z.string()).min(1, "Añade al menos una etiqueta"),
});

// Colores disponibles para las ideas
const IDEA_COLORS = ["#FFD6A5", "#FDFFB6", "#CAFFBF", "#9BF6FF", "#A0C4FF", "#BDB2FF", "#FFC6FF"];

export default function NuevaNotaScreen() {
  const theme = useTheme();
  const params = useLocalSearchParams<{ type?: string }>();
  const type = (params.type as "note" | "checklist" | "idea") || "note";

  // Estado del formulario
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [itemsText, setItemsText] = useState<string[]>([""]);
  const [color, setColor] = useState(IDEA_COLORS[0]);
  const [tagsInput, setTagsInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Acciones del store
  const addNote = useNotesStore((state) => state.addNote);
  const addChecklist = useNotesStore((state) => state.addChecklist);
  const addIdea = useNotesStore((state) => state.addIdea);

  // --- Lógica de items dinámicos (para checklist) ---
  const addItem = () => setItemsText([...itemsText, ""]);
  const updateItem = (index: number, value: string) => {
    const newItems = [...itemsText];
    newItems[index] = value;
    setItemsText(newItems);
  };
  const removeItem = (index: number) => {
    setItemsText(itemsText.filter((_, i) => i !== index));
  };

  // --- Guardar ---
  const handleSave = () => {
    setErrors({});
    const now = new Date();
    const id = Date.now().toString();

    if (type === "note") {
      const result = noteSchema.safeParse({ title, content });
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.issues.forEach((issue) => {
          if (issue.path[0]) fieldErrors[issue.path[0].toString()] = issue.message;
        });
        setErrors(fieldErrors);
        return;
      }
      const newNote: Note = {
        id,
        type: "note",
        title,
        content,
        createdAt: now,
        updatedAt: now,
      };
      addNote(newNote);
    } else if (type === "checklist") {
      const cleanItems = itemsText.filter((i) => i.trim().length > 0);
      const result = checklistSchema.safeParse({ title, items: cleanItems });
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.issues.forEach((issue) => {
          if (issue.path[0]) fieldErrors[issue.path[0].toString()] = issue.message;
        });
        setErrors(fieldErrors);
        return;
      }
      const newChecklist: ChecklistNote = {
        id,
        type: "checklist",
        title,
        items: cleanItems.map(
          (text, idx): ChecklistItem => ({
            id: `${id}-${idx}`,
            text,
            isCompleted: false,
          })
        ),
        createdAt: now,
        updatedAt: now,
      };
      addChecklist(newChecklist);
    } else if (type === "idea") {
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
      const result = ideaSchema.safeParse({ title, color, tags });
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.issues.forEach((issue) => {
          if (issue.path[0]) fieldErrors[issue.path[0].toString()] = issue.message;
        });
        setErrors(fieldErrors);
        return;
      }
      const newIdea: IdeaNote = {
        id,
        type: "idea",
        title,
        color,
        tags,
        createdAt: now,
        updatedAt: now,
      };
      addIdea(newIdea);
    }

    router.back();
  };

  // --- Render ---
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: theme.colors.background }}
    >
      <ScrollView
        contentContainerStyle={{ padding: theme.spacing.lg }}
        keyboardShouldPersistTaps="handled"
      >
        <Text
          style={{
            color: theme.colors.text,
            fontSize: theme.typography.sizes["2xl"],
            fontWeight: theme.typography.weights.bold,
            marginBottom: theme.spacing.lg,
          }}
        >
          {type === "note" && "Nueva nota"}
          {type === "checklist" && "Nueva lista de tareas"}
          {type === "idea" && "Nueva idea"}
        </Text>

        {/* Campo título (común a los tres) */}
        <Text
          style={{
            color: theme.colors.text,
            fontSize: theme.typography.sizes.sm,
            fontWeight: theme.typography.weights.medium,
            marginBottom: theme.spacing.xs,
          }}
        >
          Título
        </Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Escribe un título..."
          placeholderTextColor={theme.colors.textSecondary}
          style={{
            backgroundColor: theme.colors.surface,
            color: theme.colors.text,
            padding: theme.spacing.md,
            borderRadius: theme.radius.md,
            borderWidth: 1,
            borderColor: theme.colors.border,
            fontSize: theme.typography.sizes.base,
            marginBottom: theme.spacing.xs,
          }}
        />
        {errors.title && (
          <Text style={{ color: "#D33", fontSize: theme.typography.sizes.sm, marginBottom: theme.spacing.sm }}>
            {errors.title}
          </Text>
        )}

        {/* Campos específicos por tipo */}
        {type === "note" && (
          <View style={{ marginTop: theme.spacing.md }}>
            <Text
              style={{
                color: theme.colors.text,
                fontSize: theme.typography.sizes.sm,
                fontWeight: theme.typography.weights.medium,
                marginBottom: theme.spacing.xs,
              }}
            >
              Contenido
            </Text>
            <TextInput
              value={content}
              onChangeText={setContent}
              placeholder="Escribe aquí..."
              placeholderTextColor={theme.colors.textSecondary}
              multiline
              numberOfLines={6}
              style={{
                backgroundColor: theme.colors.surface,
                color: theme.colors.text,
                padding: theme.spacing.md,
                borderRadius: theme.radius.md,
                borderWidth: 1,
                borderColor: theme.colors.border,
                fontSize: theme.typography.sizes.base,
                minHeight: 120,
                textAlignVertical: "top",
              }}
            />
            {errors.content && (
              <Text style={{ color: "#D33", fontSize: theme.typography.sizes.sm, marginTop: theme.spacing.xs }}>
                {errors.content}
              </Text>
            )}
          </View>
        )}

        {type === "checklist" && (
          <View style={{ marginTop: theme.spacing.md }}>
            <Text
              style={{
                color: theme.colors.text,
                fontSize: theme.typography.sizes.sm,
                fontWeight: theme.typography.weights.medium,
                marginBottom: theme.spacing.xs,
              }}
            >
              Tareas
            </Text>
            {itemsText.map((item, index) => (
              <View
                key={index}
                style={{ flexDirection: "row", alignItems: "center", marginBottom: theme.spacing.sm }}
              >
                <TextInput
                  value={item}
                  onChangeText={(value) => updateItem(index, value)}
                  placeholder={`Tarea ${index + 1}`}
                  placeholderTextColor={theme.colors.textSecondary}
                  style={{
                    flex: 1,
                    backgroundColor: theme.colors.surface,
                    color: theme.colors.text,
                    padding: theme.spacing.sm,
                    borderRadius: theme.radius.md,
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                    fontSize: theme.typography.sizes.base,
                  }}
                />
                {itemsText.length > 1 && (
                  <Pressable onPress={() => removeItem(index)} style={{ marginLeft: theme.spacing.sm }}>
                    <Ionicons name="trash-outline" size={20} color={theme.colors.textSecondary} />
                  </Pressable>
                )}
              </View>
            ))}
            <Pressable
              onPress={addItem}
              style={{
                paddingVertical: theme.spacing.sm,
                alignItems: "center",
                borderWidth: 1,
                borderColor: theme.colors.border,
                borderRadius: theme.radius.md,
                borderStyle: "dashed",
              }}
            >
              <Text style={{ color: theme.colors.text, fontSize: theme.typography.sizes.sm }}>
                + Añadir tarea
              </Text>
            </Pressable>
            {errors.items && (
              <Text style={{ color: "#D33", fontSize: theme.typography.sizes.sm, marginTop: theme.spacing.xs }}>
                {errors.items}
              </Text>
            )}
          </View>
        )}

        {type === "idea" && (
          <View style={{ marginTop: theme.spacing.md }}>
            <Text
              style={{
                color: theme.colors.text,
                fontSize: theme.typography.sizes.sm,
                fontWeight: theme.typography.weights.medium,
                marginBottom: theme.spacing.xs,
              }}
            >
              Color
            </Text>
            <View
              style={{
                flexDirection: "row",
                gap: theme.spacing.sm,
                marginBottom: theme.spacing.md,
                flexWrap: "wrap",
              }}
            >
              {IDEA_COLORS.map((c) => (
                <Pressable
                  key={c}
                  onPress={() => setColor(c)}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: theme.radius.full,
                    backgroundColor: c,
                    borderWidth: color === c ? 3 : 1,
                    borderColor: color === c ? theme.colors.primary : theme.colors.border,
                  }}
                />
              ))}
            </View>

            <Text
              style={{
                color: theme.colors.text,
                fontSize: theme.typography.sizes.sm,
                fontWeight: theme.typography.weights.medium,
                marginBottom: theme.spacing.xs,
              }}
            >
              Etiquetas (separadas por comas)
            </Text>
            <TextInput
              value={tagsInput}
              onChangeText={setTagsInput}
              placeholder="trabajo, idea, importante"
              placeholderTextColor={theme.colors.textSecondary}
              style={{
                backgroundColor: theme.colors.surface,
                color: theme.colors.text,
                padding: theme.spacing.md,
                borderRadius: theme.radius.md,
                borderWidth: 1,
                borderColor: theme.colors.border,
                fontSize: theme.typography.sizes.base,
              }}
            />
            {errors.tags && (
              <Text style={{ color: "#D33", fontSize: theme.typography.sizes.sm, marginTop: theme.spacing.xs }}>
                {errors.tags}
              </Text>
            )}
          </View>
        )}

        {/* Botones */}
        <View style={{ flexDirection: "row", gap: theme.spacing.sm, marginTop: theme.spacing.xl }}>
          <Pressable
            onPress={() => router.back()}
            style={{
              flex: 1,
              padding: theme.spacing.md,
              borderRadius: theme.radius.md,
              borderWidth: 1,
              borderColor: theme.colors.border,
              alignItems: "center",
            }}
          >
            <Text style={{ color: theme.colors.text, fontSize: theme.typography.sizes.base }}>
              Cancelar
            </Text>
          </Pressable>
          <Pressable
            onPress={handleSave}
            style={{
              flex: 1,
              padding: theme.spacing.md,
              borderRadius: theme.radius.md,
              backgroundColor: theme.colors.primary,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: theme.colors.surface,
                fontSize: theme.typography.sizes.base,
                fontWeight: theme.typography.weights.semibold,
              }}
            >
              Guardar
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}