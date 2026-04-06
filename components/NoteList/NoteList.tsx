import Link from "next/link";
import type { Note } from "@/types/note";
import css from "./NoteList.module.css";

type NoteListProps = {
  notes: Note[];
  deleteError: string;
  isDeleting: boolean;
  onDelete: (id: string) => void;
};

export function NoteList({
  notes,
  deleteError,
  isDeleting,
  onDelete,
}: NoteListProps) {
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
                onClick={() => onDelete(note.id)}
                disabled={isDeleting}
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
