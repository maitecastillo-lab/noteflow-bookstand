import type { AnyNote, Note, ChecklistNote, IdeaNote, ChecklistItem } from "@/types";
import { getToken } from "./auth";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000/api";

// --- Tipos auxiliares ---

interface BackendChecklistItem {
  id: string;
  text: string;
  is_completed: boolean;
}

interface BackendNote {
  id: string;

  title: string;

  content: string | null;

  type: "note" | "checklist" | "idea";

  color: string | null;

  created_at: string;

  updated_at: string;

  items: BackendChecklistItem[] | null;

  tags: string[] | null;
}

// ======================================
// AUTH HEADERS
// ======================================

async function authHeaders(): Promise<
  Record<string, string>
> {
  const token = await getToken();

  if (!token) return {};

  return {
    Authorization: `Bearer ${token}`,
  };
}

// ======================================
// BACKEND → APP
// ======================================

function mapBackendNote(
  backendNote: BackendNote
): AnyNote {
  const base = {
    id: backendNote.id,

    title: backendNote.title,

    createdAt: new Date(
      backendNote.created_at
    ),

    updatedAt: new Date(
      backendNote.updated_at
    ),
  };

  // ================= NOTE =================

  if (backendNote.type === "note") {
    return {
      ...base,

      type: "note",

      content:
        backendNote.content ?? "",
    } as Note;
  }

  // ================= CHECKLIST =================

  if (
    backendNote.type === "checklist"
  ) {
    return {
      ...base,

      type: "checklist",

      items: (
        backendNote.items ?? []
      ).map((i) => ({
        id: i.id,

        text: i.text,

        isCompleted:
          i.is_completed,
      })),
    } as ChecklistNote;
  }

  // ================= IDEA =================

  return {
    ...base,

    type: "idea",

    tags:
      backendNote.tags ?? [],

    color:
      backendNote.color ??
      "#FFFFFF",
  } as IdeaNote;
}

// ======================================
// AUTH
// ======================================

export async function register(
  email: string,
  password: string
): Promise<string> {
  const res = await fetch(
    `${BASE_URL}/auth/register`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  if (!res.ok) {
    const data = await res
      .json()
      .catch(() => ({}));

    throw new Error(
      data.error ??
        "Error al registrar"
    );
  }

  const data = await res.json();

  return data.token;
}

export async function login(
  email: string,
  password: string
): Promise<string> {
  const res = await fetch(
    `${BASE_URL}/auth/login`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  if (!res.ok) {
    const data = await res
      .json()
      .catch(() => ({}));

    throw new Error(
      data.error ??
        "Error al iniciar sesión"
    );
  }

  const data = await res.json();

  return data.token;
}

// ======================================
// GET NOTES
// ======================================

export async function getNotes(): Promise<
  AnyNote[]
> {
  const headers =
    await authHeaders();

  const res = await fetch(
    `${BASE_URL}/notes`,
    {
      headers,
    }
  );

  if (!res.ok) {
    throw new Error(
      "Error al cargar notas"
    );
  }

  const data: BackendNote[] =
    await res.json();

  return data.map(mapBackendNote);
}

// ======================================
// CREATE NOTE
// ======================================

export async function createNote(
  data: {
    title: string;

    type:
      | "note"
      | "checklist"
      | "idea";

    content?: string;

    color?: string;
    items?: ChecklistItem[];
  }
): Promise<AnyNote> {
  const headers =
    await authHeaders();

  const res = await fetch(
    `${BASE_URL}/notes`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",

        ...headers,
      },

      body: JSON.stringify(data),
    }
  );

  if (!res.ok) {
    throw new Error(
      "Error al crear nota"
    );
  }

  const backendNote: BackendNote =
    await res.json();

  return mapBackendNote(
    backendNote
  );
}

// ======================================
// UPDATE NOTE
// ======================================

export async function updateNote(
  id: string,

  updates: {
    title?: string;

    content?: string;

    color?: string;

    type?:
      | "note"
      | "checklist"
      | "idea";

    // ✅ IMPORTANTE
    items?: ChecklistItem[];
  }
): Promise<AnyNote> {
  const headers =
    await authHeaders();

  const res = await fetch(
    `${BASE_URL}/notes/${id}`,
    {
      method: "PATCH",

      headers: {
        "Content-Type":
          "application/json",

        ...headers,
      },

      body: JSON.stringify(updates),
    }
  );

  if (!res.ok) {
    throw new Error(
      "Error al actualizar nota"
    );
  }

  const backendNote: BackendNote =
    await res.json();

  return mapBackendNote(
    backendNote
  );
}

// ======================================
// DELETE NOTE
// ======================================

export async function deleteNote(
  id: string
): Promise<void> {
  const headers =
    await authHeaders();

  const res = await fetch(
    `${BASE_URL}/notes/${id}`,
    {
      method: "DELETE",
      headers,
    }
  );

  if (!res.ok) {
    throw new Error(
      "Error al borrar nota"
    );
  }
}

// ======================================
// CREATE CHECKLIST ITEM
// ======================================

export async function createChecklistItem(
  noteId: string,
  text: string
): Promise<ChecklistItem> {
  const headers =
    await authHeaders();

  const res = await fetch(
    `${BASE_URL}/notes/${noteId}/checklist-items`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",

        ...headers,
      },

      body: JSON.stringify({
        text,
      }),
    }
  );

  if (!res.ok) {
    throw new Error(
      "Error al crear item"
    );
  }

  const item = await res.json();

  return {
    id: item.id,
    text: item.text,
    isCompleted:
      item.is_completed,
  };
}

// ======================================
// TOGGLE CHECKLIST ITEM
// ======================================

export async function toggleChecklistItem(
  itemId: string,
  isCompleted: boolean
): Promise<ChecklistItem> {
  const headers =
    await authHeaders();

  const res = await fetch(
    `${BASE_URL}/checklist-items/${itemId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type":
          "application/json",
        ...headers,
      },
      body: JSON.stringify({
        is_completed:
          isCompleted,
      }),
    }
  );

  if (!res.ok) {
    throw new Error(
      "Error al actualizar item"
    );
  }

  const item = await res.json();

  return {
    id: item.id,
    text: item.text,
    isCompleted:
      item.is_completed,
  };
}

// ======================================
// DELETE CHECKLIST ITEM
// ======================================

export async function deleteChecklistItem(
  itemId: string
): Promise<void> {
  const headers =
    await authHeaders();

  const res = await fetch(
    `${BASE_URL}/checklist-items/${itemId}`,
    {
      method: "DELETE",

      headers,
    }
  );

  if (!res.ok) {
    throw new Error(
      "Error al borrar item"
    );
  }
}