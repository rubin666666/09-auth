"use client";

import Link from "next/link";
import type { Note } from "@/types/note";
import css from "./page.module.css";

type NoteDetailsClientProps = {
  note: Note;
};

export function NoteDetailsClient({ note }: NoteDetailsClientProps) {
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
