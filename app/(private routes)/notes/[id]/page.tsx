import css from "./page.module.css";
import { fetchNoteById } from "@/lib/api/serverApi";
import { NoteDetailsClient } from "./NoteDetails.client";

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
        <NoteDetailsClient note={note} />
      </div>
    </main>
  );
}
