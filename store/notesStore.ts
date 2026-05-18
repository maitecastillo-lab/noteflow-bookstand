import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

import type { Note, ChecklistNote, IdeaNote, ChecklistItem } from "@/types";

interface NotesStore {
  // ---------------- STATE ----------------
  notes: Note[];
  checklists: ChecklistNote[];
  ideas: IdeaNote[];

  // ---------------- NOTES ----------------
  addNote: (note: Note) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  archiveNote: (id: string) => void;
  unarchiveNote: (id: string) => void;

  // ---------------- CHECKLISTS ----------------
  addChecklist: (checklist: ChecklistNote) => void;
  updateChecklist: (id: string, updates: Partial<ChecklistNote>) => void;
  deleteChecklist: (id: string) => void;
  archiveChecklist: (id: string) => void;
  unarchiveChecklist: (id: string) => void;
  toggleChecklistItem: (checklistId: string, itemId: string) => void;

  // ---------------- IDEAS ----------------
  addIdea: (idea: IdeaNote) => void;
  updateIdea: (id: string, updates: Partial<IdeaNote>) => void;
  deleteIdea: (id: string) => void;
  archiveIdea: (id: string) => void;
  unarchiveIdea: (id: string) => void;
}

export const useNotesStore = create<NotesStore>()(
  persist(
    (set) => ({
      // ---------------- INITIAL STATE ----------------
      notes: [],
      checklists: [],
      ideas: [],

      
      //  NOTES 
      
      addNote: (note) =>
        set((state) => ({
          notes: [...state.notes, note],
        })),

      updateNote: (id, updates) =>
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id
              ? { ...n, ...updates, updatedAt: new Date() }
              : n
          ),
        })),

      deleteNote: (id) =>
        set((state) => ({
          notes: state.notes.filter((n) => n.id !== id),
        })),

      archiveNote: (id) =>
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id
              ? { ...n, isArchived: true, updatedAt: new Date() }
              : n
          ),
        })),

      unarchiveNote: (id) =>
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id
              ? { ...n, isArchived: false, updatedAt: new Date() }
              : n
          ),
        })),

    
      //  CHECKLISTS 
    
      addChecklist: (checklist) =>
        set((state) => ({
          checklists: [...state.checklists, checklist],
        })),

      updateChecklist: (id, updates) =>
        set((state) => ({
          checklists: state.checklists.map((c) =>
            c.id === id
              ? { ...c, ...updates, updatedAt: new Date() }
              : c
          ),
        })),

      deleteChecklist: (id) =>
        set((state) => ({
          checklists: state.checklists.filter((c) => c.id !== id),
        })),

      archiveChecklist: (id) =>
        set((state) => ({
          checklists: state.checklists.map((c) =>
            c.id === id
              ? { ...c, isArchived: true, updatedAt: new Date() }
              : c
          ),
        })),

      unarchiveChecklist: (id) =>
        set((state) => ({
          checklists: state.checklists.map((c) =>
            c.id === id
              ? { ...c, isArchived: false, updatedAt: new Date() }
              : c
          ),
        })),

      toggleChecklistItem: (checklistId, itemId) =>
        set((state) => ({
          checklists: state.checklists.map((c) =>
            c.id !== checklistId
              ? c
              : {
                  ...c,
                  items: c.items.map((i: ChecklistItem) =>
                    i.id === itemId
                      ? { ...i, isCompleted: !i.isCompleted }
                      : i
                  ),
                  updatedAt: new Date(),
                }
          ),
        })),

      //  IDEAS 
      addIdea: (idea) =>
        set((state) => ({
          ideas: [...state.ideas, idea],
        })),

      updateIdea: (id, updates) =>
        set((state) => ({
          ideas: state.ideas.map((i) =>
            i.id === id
              ? { ...i, ...updates, updatedAt: new Date() }
              : i
          ),
        })),

      deleteIdea: (id) =>
        set((state) => ({
          ideas: state.ideas.filter((i) => i.id !== id),
        })),

      archiveIdea: (id) =>
        set((state) => ({
          ideas: state.ideas.map((i) =>
            i.id === id
              ? { ...i, isArchived: true, updatedAt: new Date() }
              : i
          ),
        })),

      unarchiveIdea: (id) =>
        set((state) => ({
          ideas: state.ideas.map((i) =>
            i.id === id
              ? { ...i, isArchived: false, updatedAt: new Date() }
              : i
          ),
        })),
    }),
    {
      name: "noteflow-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);