"use client";

import type { NotesResponse } from "@/types/note";
import { NoteForm } from "@/components/NoteForm/NoteForm";
import { NotesFilterClient } from "@/app/(private routes)/notes/filter/[...slug]/Notes.client";

type NotesClientProps = {
  initialData: NotesResponse;
  initialSearch: string;
  initialTag: string;
  page: number;
};

const tags = [
  "All",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
  "Ideas",
  "Travel",
  "Finance",
  "Health",
  "Important",
  "Todo",
] as const;

export function NotesClient({
  initialData,
  initialSearch,
  initialTag,
  page,
}: NotesClientProps) {
  return (
    <>
      <section style={{ marginBottom: 24 }}>
        <NoteForm tags={[...tags]} />
      </section>
      <NotesFilterClient
        initialData={initialData}
        initialSearch={initialSearch}
        initialTag={initialTag}
        page={page}
      />
    </>
  );
}
