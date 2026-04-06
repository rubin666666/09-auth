"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api/clientApi";
import css from "./page.module.css";

type NoteDetailsClientProps = {
  noteId: string;
};

export function NoteDetailsClient({ noteId }: NoteDetailsClientProps) {
  const { data: note, isLoading, isError } = useQuery({
    queryKey: ["note", noteId],
    queryFn: () => fetchNoteById(noteId),
  });

  if (isLoading) {
    return <article className={css.card}>Loading note...</article>;
  }

  if (isError) {
    return <article className={css.card}>Failed to load note.</article>;
  }

  if (!note) {
    return <article className={css.card}>Note not found.</article>;
  }

  return (
    <article className={css.card}>
      <span className={css.tag}>{note.tag}</span>
      <h1 className={css.title}>{note.title}</h1>
      <p className={css.meta}>
        Created: {new Date(note.createdAt).toLocaleString()} | Updated:{" "}
        {new Date(note.updatedAt).toLocaleString()}
      </p>
      <div className={css.content}>{note.content || "No content provided."}</div>
      <Link href="/notes" className={css.backLink}>
        Back to notes
      </Link>
    </article>
  );
}
