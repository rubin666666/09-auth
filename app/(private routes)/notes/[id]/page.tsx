import Link from "next/link";
import css from "./page.module.css";
import { fetchNoteById } from "@/lib/api/serverApi";

type NoteDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function NoteDetailsPage({
  params,
}: NoteDetailsPageProps) {
  const { id } = await params;
  const note = await fetchNoteById(id);

  return (
    <main className={css.main}>
      <div className="container">
        <article className={css.card}>
          <span className={css.tag}>{note.tag}</span>
          <h1 className={css.title}>{note.title}</h1>
          <p className={css.meta}>
            Created: {new Date(note.createdAt).toLocaleString()} | Updated:{" "}
            {new Date(note.updatedAt).toLocaleString()}
          </p>
          <div className={css.content}>
            {note.content || "No content provided."}
          </div>
          <Link href="/notes" className={css.backLink}>
            Back to notes
          </Link>
        </article>
      </div>
    </main>
  );
}
