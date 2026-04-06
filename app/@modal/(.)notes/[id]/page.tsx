import { fetchNoteById } from "@/lib/api/serverApi";
import { NotePreviewClient } from "./NotePreview.client";

type NotePreviewPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function NotePreviewPage({ params }: NotePreviewPageProps) {
  const { id } = await params;
  const note = await fetchNoteById(id);

  return <NotePreviewClient note={note} />;
}
