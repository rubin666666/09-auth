import type { FormEvent } from "react";
import type { NoteTag } from "@/types/note";
import css from "./NoteForm.module.css";

type NoteFormProps = {
  tags: NoteTag[];
  isSubmitting: boolean;
  error: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function NoteForm({
  tags,
  isSubmitting,
  error,
  onSubmit,
}: NoteFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <div className={css.filters}>
        <label className={css.field}>
          <span>Title</span>
          <input className={css.input} name="title" type="text" required />
        </label>

        <label className={css.field}>
          <span>Tag</span>
          <select className={css.select} name="tag" defaultValue="Todo">
            {tags
              .filter((tagOption) => tagOption !== "All")
              .map((tagOption) => (
                <option key={tagOption} value={tagOption}>
                  {tagOption}
                </option>
              ))}
          </select>
        </label>

        <label className={css.field}>
          <span>Content</span>
          <textarea className={css.textarea} name="content" />
        </label>
      </div>

      <div className={css.actions}>
        <button type="submit" className={css.submitButton} disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Create note"}
        </button>
      </div>
      {error ? <p className={css.error}>{error}</p> : null}
    </form>
  );
}
