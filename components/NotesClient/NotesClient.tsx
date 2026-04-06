"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { startTransition } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import css from "./NotesClient.module.css";
import type { NoteTag, NotesResponse } from "@/types/note";
import {
  createNote,
  deleteNote,
  fetchNotes,
  getErrorMessage,
} from "@/lib/api/clientApi";

type NotesClientProps = {
  initialData: NotesResponse;
  initialSearch: string;
  initialTag: string;
  page: number;
};

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

export function NotesClient({
  initialData,
  initialSearch,
  initialTag,
  page,
}: NotesClientProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState(initialSearch);
  const [tag, setTag] = useState(initialTag);
  const [createError, setCreateError] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const notesQuery = useQuery({
    queryKey: ["notes", search, tag, page],
    queryFn: () =>
      fetchNotes({
        search,
        tag,
        page,
        perPage: 12,
      }),
    initialData,
  });

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: async () => {
      setCreateError("");
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (error) => {
      setCreateError(getErrorMessage(error));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: async () => {
      setDeleteError("");
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (error) => {
      setDeleteError(getErrorMessage(error));
    },
  });

  function updateRoute(nextSearch: string, nextTag: string, nextPage: number) {
    const params = new URLSearchParams();

    if (nextSearch) {
      params.set("search", nextSearch);
    }

    if (nextTag && nextTag !== "All") {
      params.set("tag", nextTag);
    }

    if (nextPage > 1) {
      params.set("page", String(nextPage));
    }

    startTransition(() => {
      router.push(`/notes${params.toString() ? `?${params.toString()}` : ""}`);
    });
  }

  function handleFiltersSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateRoute(search, tag, 1);
  }

  function handleCreateNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreateError("");

    const formData = new FormData(event.currentTarget);

    createMutation.mutate(
      {
        title: String(formData.get("title") ?? ""),
        content: String(formData.get("content") ?? "") || null,
        tag: String(formData.get("tag") ?? "Todo") as Exclude<NoteTag, "All">,
      },
      {
        onSuccess: () => {
          event.currentTarget.reset();
        },
      },
    );
  }

  const notes = notesQuery.data.notes;

  return (
    <div className={css.layout}>
      <section className={css.panel}>
        <form onSubmit={handleFiltersSubmit}>
          <div className={css.filters}>
            <label className={css.field}>
              <span>Search</span>
              <input
                className={css.input}
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Find notes"
              />
            </label>

            <label className={css.field}>
              <span>Tag</span>
              <select
                className={css.select}
                value={tag}
                onChange={(event) => setTag(event.target.value)}
              >
                {tags.map((tagOption) => (
                  <option key={tagOption} value={tagOption}>
                    {tagOption}
                  </option>
                ))}
              </select>
            </label>

            <div className={css.actions}>
              <button type="submit" className={css.primaryButton}>
                Apply filters
              </button>
              <button
                type="button"
                className={css.secondaryButton}
                onClick={() => {
                  setSearch("");
                  setTag("All");
                  updateRoute("", "All", 1);
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </form>
      </section>

      <section className={css.panel}>
        <form onSubmit={handleCreateNote}>
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
            <button
              type="submit"
              className={css.primaryButton}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Saving..." : "Create note"}
            </button>
          </div>
          {createError ? <p className={css.error}>{createError}</p> : null}
        </form>
      </section>

      <section className={css.panel}>
        {notes.length ? (
          <div className={css.grid}>
            {notes.map((note) => (
              <article key={note.id} className={css.noteCard}>
                <div>
                  <p className={css.noteMeta}>{note.tag}</p>
                  <h2 className={css.noteTitle}>{note.title}</h2>
                </div>
                <p className={css.noteText}>
                  {note.content || "No content provided."}
                </p>
                <div className={css.footer}>
                  <Link href={`/notes/${note.id}`} className={css.noteLink}>
                    Open note
                  </Link>
                  <button
                    type="button"
                    className={css.dangerButton}
                    onClick={() => deleteMutation.mutate(note.id)}
                    disabled={deleteMutation.isPending}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className={css.empty}>
            No notes found for the current filters yet.
          </p>
        )}

        {deleteError ? <p className={css.error}>{deleteError}</p> : null}

        <div className={css.actions}>
          <button
            type="button"
            className={css.secondaryButton}
            disabled={page <= 1}
            onClick={() => updateRoute(search, tag, page - 1)}
          >
            Previous
          </button>
          <span>
            Page {page} of {notesQuery.data.totalPages || 1}
          </span>
          <button
            type="button"
            className={css.secondaryButton}
            disabled={page >= notesQuery.data.totalPages}
            onClick={() => updateRoute(search, tag, page + 1)}
          >
            Next
          </button>
        </div>
      </section>
    </div>
  );
}
