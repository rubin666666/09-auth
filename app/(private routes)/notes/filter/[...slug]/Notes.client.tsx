"use client";

import { NotesClient } from "@/components/NotesClient/NotesClient";
import type { NotesResponse } from "@/types/note";

type NotesFilterClientProps = {
  initialData: NotesResponse;
  initialSearch: string;
  initialTag: string;
  page: number;
};

export function NotesFilterClient(props: NotesFilterClientProps) {
  return <NotesClient {...props} />;
}
