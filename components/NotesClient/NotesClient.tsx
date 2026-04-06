"use client";

import { NoteForm } from "@/components/NoteForm/NoteForm";
import { Notes } from "@/app/(private routes)/notes/filter/[...slug]/Notes.client";

type NotesClientProps = {
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
  initialSearch,
  initialTag,
  page,
}: NotesClientProps) {
  return (
    <>
      <section style={{ marginBottom: 24 }}>
        <NoteForm tags={[...tags]} />
      </section>
      <Notes initialSearch={initialSearch} initialTag={initialTag} page={page} />
    </>
  );
}
