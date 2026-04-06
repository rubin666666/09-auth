"use client";

import { create } from "zustand";
import type { NoteTag } from "@/types/note";

interface NoteStore {
  search: string;
  tag: NoteTag;
  page: number;
  title: string;
  content: string;
  draftTag: Exclude<NoteTag, "All">;
  setSearch: (search: string) => void;
  setTag: (tag: NoteTag) => void;
  setPage: (page: number) => void;
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setDraftTag: (draftTag: Exclude<NoteTag, "All">) => void;
  clearDraft: () => void;
  resetFilters: () => void;
}

export const useNoteStore = create<NoteStore>()((set) => ({
  search: "",
  tag: "All",
  page: 1,
  title: "",
  content: "",
  draftTag: "Todo",
  setSearch: (search) => set({ search }),
  setTag: (tag) => set({ tag }),
  setPage: (page) => set({ page }),
  setTitle: (title) => set({ title }),
  setContent: (content) => set({ content }),
  setDraftTag: (draftTag) => set({ draftTag }),
  clearDraft: () =>
    set({
      title: "",
      content: "",
      draftTag: "Todo",
    }),
  resetFilters: () =>
    set({
      search: "",
      tag: "All",
      page: 1,
    }),
}));
