"use client";

import { Modal } from "@/components/Modal/Modal";
import type { Note } from "@/types/note";
import { NoteDetailsClient } from "@/app/(private routes)/notes/[id]/NoteDetails.client";

type NotePreviewClientProps = {
  note: Note;
};

export function NotePreviewClient({ note }: NotePreviewClientProps) {
  return (
    <Modal>
      <NoteDetailsClient note={note} />
    </Modal>
  );
}
