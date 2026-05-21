import type { AnyNote, Note, ChecklistNote, IdeaNote, ChecklistItem } from "@/types";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000/api";

// --- Tipos auxiliares ---

// Lo que devuelve el backend (campos snake_case en SQL)
interface BackendNote {
  id: string;
  title: string;
  content: string | null;
  type: "note" | "checklist" | "idea";
  color: string | null;
  created_at: string;
  updated_at: string;
  items: { id: string; text: string; is_completed: boolean }[] | null;
  tags: string[] | null;
}

// --- Helper: convertir formato backend → formato app móvil ---
function mapBackendNote(backendNote: BackendNote): AnyNote {
  const base = {
    id: backendNote.id,
    title: backendNote.title,
    createdAt: new Date(backendNote.created_at),
    updatedAt: new Date(backendNote.updated_at),
  };

  if (backendNote.type === "note") {
    return {
      ...base,
      type: "note",
      content: backendNote.content ?? "",
    } as Note;
  }

  if (backendNote.type === "checklist") {
    return {
      ...base,
      type: "checklist",
      items: (backendNote.items ?? []).map((i) => ({
        id: i.id,
        text: i.text,
        isCompleted: i.is_completed,
      })),
    } as ChecklistNote;
  }

  return {
    ...base,
    type: "idea",
    tags: backendNote.tags ?? [],
    color: backendNote.color ?? "#FFFFFF",
  } as IdeaNote;
}

// --- Funciones de la API ---

// Listar todas las notas
export async function getNotes(): Promise<AnyNote[]> {
  const res = await fetch(`${BASE_URL}/notes`);
  if (!res.ok) throw new Error("Error al cargar notas");
  const data: BackendNote[] = await res.json();
  return data.map(mapBackendNote);
}

// Crear una nota nueva
export async function createNote(data: {
  title: string;
  type: "note" | "checklist" | "idea";
  content?: string;
  color?: string;
}): Promise<AnyNote> {
  const res = await fetch(`${BASE_URL}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear nota");
  const backendNote: BackendNote = await res.json();
  // Una nota recién creada no tiene items ni tags todavía
  return mapBackendNote({ ...backendNote, items: null, tags: null });
}

// Modificar una nota
export async function updateNote(
  id: string,
  updates: { title?: string; content?: string; color?: string; type?: "note" | "checklist" | "idea" }
): Promise<AnyNote> {
  const res = await fetch(`${BASE_URL}/notes/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Error al actualizar nota");
  const backendNote: BackendNote = await res.json();
  return mapBackendNote({ ...backendNote, items: null, tags: null });
}

// Borrar una nota
export async function deleteNote(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/notes/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al borrar nota");
}

// --- Funciones de checklist items ---

// Crear un item nuevo en una nota
export async function createChecklistItem(
  noteId: string,
  text: string
): Promise<ChecklistItem> {
  const res = await fetch(`${BASE_URL}/notes/${noteId}/checklist-items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error("Error al crear item");
  const item = await res.json();
  return {
    id: item.id,
    text: item.text,
    isCompleted: item.is_completed,
  };
}

// Marcar/desmarcar un item
export async function toggleChecklistItem(
  itemId: string,
  isCompleted: boolean
): Promise<ChecklistItem> {
  const res = await fetch(`${BASE_URL}/checklist-items/${itemId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ is_completed: isCompleted }),
  });
  if (!res.ok) throw new Error("Error al actualizar item");
  const item = await res.json();
  return {
    id: item.id,
    text: item.text,
    isCompleted: item.is_completed,
  };
}

// Borrar un item
export async function deleteChecklistItem(itemId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/checklist-items/${itemId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al borrar item");
}