import { create } from "zustand";
import * as api from "@/lib/api";
import type { Note, ChecklistNote, IdeaNote, ChecklistItem, AnyNote } from "@/types";

interface NotesStore {
  // ---------------- STATE ----------------
  notes: Note[];
  checklists: ChecklistNote[];
  ideas: IdeaNote[];
  isLoading: boolean;
  error: string | null;

  // ---------------- FETCH (cargar del backend) ----------------
  fetchAll: () => Promise<void>;

  // ---------------- NOTES ----------------
  addNote: (note: Note) => Promise<void>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  archiveNote: (id: string) => void;
  unarchiveNote: (id: string) => void;

  // ---------------- CHECKLISTS ----------------
  addChecklist: (checklist: ChecklistNote) => Promise<void>;
  updateChecklist: (id: string, updates: Partial<ChecklistNote>) => Promise<void>;
  deleteChecklist: (id: string) => Promise<void>;
  archiveChecklist: (id: string) => void;
  unarchiveChecklist: (id: string) => void;
  toggleChecklistItem: (checklistId: string, itemId: string) => Promise<void>;

  // ---------------- IDEAS ----------------
  addIdea: (idea: IdeaNote) => Promise<void>;
  updateIdea: (id: string, updates: Partial<IdeaNote>) => Promise<void>;
  deleteIdea: (id: string) => Promise<void>;
  archiveIdea: (id: string) => void;
  unarchiveIdea: (id: string) => void;
}

export const useNotesStore = create<NotesStore>((set, get) => ({
  // ---------------- INITIAL STATE ----------------
  notes: [],
  checklists: [],
  ideas: [],
  isLoading: false,
  error: null,

  // ---------------- FETCH ----------------
  fetchAll: async () => {
    set({ isLoading: true, error: null });
    try {
      const all = await api.getNotes();
      const notes = all.filter((n): n is Note => n.type === "note");
      const checklists = all.filter((n): n is ChecklistNote => n.type === "checklist");
      const ideas = all.filter((n): n is IdeaNote => n.type === "idea");
      set({ notes, checklists, ideas, isLoading: false });
    } catch (e) {
      console.error(e);
      set({ error: "Error al cargar datos", isLoading: false });
    }
  },

  // ---------------- NOTES ----------------
  addNote: async (note) => {
    try {
      const created = await api.createNote({
        title: note.title,
        type: "note",
        content: note.content,
      });
      set((state) => ({ notes: [...state.notes, created as Note] }));
    } catch (e) {
      console.error(e);
      set({ error: "Error al crear nota" });
    }
  },

  updateNote: async (id, updates) => {
    try {
      const updated = await api.updateNote(id, {
        title: updates.title,
        content: updates.content,
      });
      set((state) => ({
        notes: state.notes.map((n) => (n.id === id ? (updated as Note) : n)),
      }));
    } catch (e) {
      console.error(e);
      set({ error: "Error al actualizar nota" });
    }
  },

  deleteNote: async (id) => {
    try {
      await api.deleteNote(id);
      set((state) => ({ notes: state.notes.filter((n) => n.id !== id) }));
    } catch (e) {
      console.error(e);
      set({ error: "Error al borrar nota" });
    }
  },

  archiveNote: (id) =>
    set((state) => ({
      notes: state.notes.map((n) =>
        n.id === id ? { ...n, isArchived: true, updatedAt: new Date() } : n
      ),
    })),

  unarchiveNote: (id) =>
    set((state) => ({
      notes: state.notes.map((n) =>
        n.id === id ? { ...n, isArchived: false, updatedAt: new Date() } : n
      ),
    })),

  // ---------------- CHECKLISTS ----------------
  addChecklist: async (checklist) => {
    try {
      // 1. crear checklist
      const created =
        await api.createNote({
          title: checklist.title,

          type: "checklist",
        });

      const createdChecklist =
        created as ChecklistNote;

      // 2. crear items reales en backend
      const createdItems =
        await Promise.all(
          (checklist.items ?? []).map(
            async (item) => {
              return await api.createChecklistItem(
                createdChecklist.id,
                item.text
              );
            }
          )
        );

      // 3. guardar local
      set((state) => ({
        checklists: [
          ...state.checklists,

          {
            ...createdChecklist,

            items: createdItems,
          },
        ],
      }));
    } catch (e) {
      console.error(e);

      set({
        error:
          "Error al crear checklist",
      });
    }
  },

  updateChecklist: async (id, updates) => {
    try {
      const updated = await api.updateNote(id, {
        title: updates.title,
      });
      set((state) => ({
        checklists: state.checklists.map((c) =>
          c.id === id ? { ...(updated as ChecklistNote), items: c.items } : c
        ),
      }));
    } catch (e) {
      console.error(e);
      set({ error: "Error al actualizar checklist" });
    }
  },

  deleteChecklist: async (id) => {
    try {
      await api.deleteNote(id);
      set((state) => ({ checklists: state.checklists.filter((c) => c.id !== id) }));
    } catch (e) {
      console.error(e);
      set({ error: "Error al borrar checklist" });
    }
  },

  archiveChecklist: (id) =>
    set((state) => ({
      checklists: state.checklists.map((c) =>
        c.id === id ? { ...c, isArchived: true, updatedAt: new Date() } : c
      ),
    })),

  unarchiveChecklist: (id) =>
    set((state) => ({
      checklists: state.checklists.map((c) =>
        c.id === id ? { ...c, isArchived: false, updatedAt: new Date() } : c
      ),
    })),

  toggleChecklistItem: async (checklistId, itemId) => {
    const checklist = get().checklists.find((c) => c.id === checklistId);
    const item = checklist?.items.find((i) => i.id === itemId);
    if (!item) return;

    try {
      const updated = await api.toggleChecklistItem(itemId, !item.isCompleted);
      set((state) => ({
        checklists: state.checklists.map((c) =>
          c.id !== checklistId
            ? c
            : {
              ...c,
              items: c.items.map((i) => (i.id === itemId ? updated : i)),
              updatedAt: new Date(),
            }
        ),
      }));
    } catch (e) {
      console.error(e);
      set({ error: "Error al cambiar item" });
    }
  },

  // ---------------- IDEAS ----------------
  addIdea: async (idea) => {
    try {
      const created = await api.createNote({
        title: idea.title,
        type: "idea",
        color: idea.color,
      });
      set((state) => ({ ideas: [...state.ideas, created as IdeaNote] }));
    } catch (e) {
      console.error(e);
      set({ error: "Error al crear idea" });
    }
  },

  updateIdea: async (id, updates) => {
    try {
      const updated = await api.updateNote(id, {
        title: updates.title,
        color: updates.color,
      });
      set((state) => ({
        ideas: state.ideas.map((i) =>
          i.id === id ? { ...(updated as IdeaNote), tags: i.tags } : i
        ),
      }));
    } catch (e) {
      console.error(e);
      set({ error: "Error al actualizar idea" });
    }
  },

  deleteIdea: async (id) => {
    try {
      await api.deleteNote(id);
      set((state) => ({ ideas: state.ideas.filter((i) => i.id !== id) }));
    } catch (e) {
      console.error(e);
      set({ error: "Error al borrar idea" });
    }
  },

  archiveIdea: (id) =>
    set((state) => ({
      ideas: state.ideas.map((i) =>
        i.id === id ? { ...i, isArchived: true, updatedAt: new Date() } : i
      ),
    })),

  unarchiveIdea: (id) =>
    set((state) => ({
      ideas: state.ideas.map((i) =>
        i.id === id ? { ...i, isArchived: false, updatedAt: new Date() } : i
      ),
    })),
}));