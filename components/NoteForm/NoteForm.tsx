"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { NoteTag } from "@/types/note";
import { createNote, getErrorMessage } from "@/lib/api/clientApi";
import { useNoteStore } from "@/lib/store/noteStore";
import css from "./NoteForm.module.css";

type NoteFormProps = {
  tags: NoteTag[];
};

export function NoteForm({ tags }: NoteFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const title = useNoteStore((state) => state.title);
  const content = useNoteStore((state) => state.content);
  const draftTag = useNoteStore((state) => state.draftTag);
  const setTitle = useNoteStore((state) => state.setTitle);
  const setContent = useNoteStore((state) => state.setContent);
  const setDraftTag = useNoteStore((state) => state.setDraftTag);
  const clearDraft = useNoteStore((state) => state.clearDraft);

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: async () => {
      clearDraft();
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
      router.push("/notes");
      router.refresh();
    },
  });

  const error = createMutation.error ? getErrorMessage(createMutation.error) : "";

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        createMutation.mutate({
          title,
          content: content || null,
          tag: draftTag,
        });
      }}
    >
      <div className={css.filters}>
        <label className={css.field}>
          <span>Title</span>
          <input
            className={css.input}
            name="title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </label>

        <label className={css.field}>
          <span>Tag</span>
          <select
            className={css.select}
            name="tag"
            value={draftTag}
            onChange={(event) =>
              setDraftTag(event.target.value as Exclude<NoteTag, "All">)
            }
          >
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
          <textarea
            className={css.textarea}
            name="content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
          />
        </label>
      </div>

      <div className={css.actions}>
        <button
          type="submit"
          className={css.submitButton}
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? "Saving..." : "Create note"}
        </button>
        <button
          type="button"
          className={css.cancelButton}
          onClick={() => {
            clearDraft();
            router.back();
          }}
        >
          Cancel
        </button>
      </div>
      {error ? <p className={css.error}>{error}</p> : null}
    </form>
  );
}
