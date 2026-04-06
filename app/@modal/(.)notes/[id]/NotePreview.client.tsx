"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Modal } from "@/components/Modal/Modal";
import { fetchNoteById } from "@/lib/api/clientApi";
import { NoteDetailsClient } from "@/app/(private routes)/notes/[id]/NoteDetails.client";

type NotePreviewClientProps = {
  noteId: string;
};

export function NotePreviewClient({ noteId }: NotePreviewClientProps) {
  const router = useRouter();
  const { data: note, isLoading, isError } = useQuery({
    queryKey: ["note", noteId],
    queryFn: () => fetchNoteById(noteId),
  });

  return (
    <Modal onClose={() => router.back()}>
      <button type="button" onClick={() => router.back()}>
        Close preview
      </button>
      {isLoading ? <p>Loading note preview...</p> : null}
      {isError ? <p>Failed to load note preview.</p> : null}
      {note ? <NoteDetailsClient noteId={noteId} /> : null}
    </Modal>
  );
}
