"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Note } from "@/types/note";
import { deleteNote, getErrorMessage } from "@/lib/api/clientApi";
import css from "./NoteList.module.css";

type NoteListProps = {
  notes: Note[];
};

export function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();
  const [deleteError, setDeleteError] = useState("");

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: async () => {
      setDeleteError("");
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (error) => {
      setDeleteError(getErrorMessage(error));
    },
  });

  if (!notes.length) {
    return <p className={css.empty}>No notes found for the current filters yet.</p>;
  }

  return (
    <>
      <div className={css.grid}>
        {notes.map((note) => (
          <article key={note.id} className={css.noteCard}>
            <div>
              <p className={css.noteMeta}>{note.tag}</p>
              <h2 className={css.noteTitle}>{note.title}</h2>
            </div>
            <p className={css.noteText}>{note.content || "No content provided."}</p>
            <div className={css.footer}>
              <Link href={`/notes/${note.id}`} className={css.noteLink}>
                Open note
              </Link>
              <button
                type="button"
                className={css.dangerButton}
                onClick={() => deleteMutation.mutate(note.id)}
                disabled={deleteMutation.isPending}
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
      {deleteError ? <p className={css.error}>{deleteError}</p> : null}
    </>
  );
}
