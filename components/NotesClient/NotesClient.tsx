"use client";

import { useState, type FormEvent } from "react";
import { startTransition } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import css from "./NotesClient.module.css";
import type { NoteTag, NotesResponse } from "@/types/note";
import { SearchBox } from "@/components/SearchBox/SearchBox";
import { NoteForm } from "@/components/NoteForm/NoteForm";
import { NoteList } from "@/components/NoteList/NoteList";
import { Pagination } from "@/components/Pagination/Pagination";
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
            <SearchBox value={search} onChange={setSearch} />

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
        <NoteForm
          tags={tags}
          isSubmitting={createMutation.isPending}
          error={createError}
          onSubmit={handleCreateNote}
        />
      </section>

      <section className={css.panel}>
        <NoteList
          notes={notes}
          deleteError={deleteError}
          isDeleting={deleteMutation.isPending}
          onDelete={(id) => deleteMutation.mutate(id)}
        />

        <Pagination
          page={page}
          totalPages={notesQuery.data.totalPages}
          onPrevious={() => updateRoute(search, tag, page - 1)}
          onNext={() => updateRoute(search, tag, page + 1)}
        />
      </section>
    </div>
  );
}
