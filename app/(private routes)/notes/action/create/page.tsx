import { NoteForm } from "@/components/NoteForm/NoteForm";
import type { NoteTag } from "@/types/note";

const tags: NoteTag[] = [
  "All",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
  "Ideas",
  "Travel",
  "Finance",
  "Health",
  "Important",
  "Todo",
];

export default function CreateNoteActionPage() {
  return (
    <main style={{ flex: 1, padding: "32px 0 56px" }}>
      <div className="container">
        <NoteForm tags={tags} />
      </div>
    </main>
  );
}
