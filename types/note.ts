export type NoteTag =
  | "All"
  | "Work"
  | "Personal"
  | "Meeting"
  | "Shopping"
  | "Ideas"
  | "Travel"
  | "Finance"
  | "Health"
  | "Important"
  | "Todo";

export interface Note {
  id: string;
  title: string;
  content: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
  tag: Exclude<NoteTag, "All">;
}

export interface NotesResponse {
  notes: Note[];
  totalPages: number;
}
