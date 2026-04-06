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
  const { data: note } = useQuery({
    queryKey: ["note", noteId],
    queryFn: () => fetchNoteById(noteId),
  });

  if (!note) {
    return null;
  }

  return (
    <Modal onClose={() => router.back()}>
      <NoteDetailsClient noteId={noteId} />
    </Modal>
  );
}
