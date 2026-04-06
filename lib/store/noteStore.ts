"use client";

import { create } from "zustand";
import type { NoteTag } from "@/types/note";

interface NoteStore {
  search: string;
  tag: NoteTag;
  page: number;
  setSearch: (search: string) => void;
  setTag: (tag: NoteTag) => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
}

export const useNoteStore = create<NoteStore>()((set) => ({
  search: "",
  tag: "All",
  page: 1,
  setSearch: (search) => set({ search }),
  setTag: (tag) => set({ tag }),
  setPage: (page) => set({ page }),
  resetFilters: () =>
    set({
      search: "",
      tag: "All",
      page: 1,
    }),
}));
