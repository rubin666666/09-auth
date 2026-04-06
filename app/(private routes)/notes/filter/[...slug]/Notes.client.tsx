"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { startTransition } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { SearchBox } from "@/components/SearchBox/SearchBox";
import { NoteList } from "@/components/NoteList/NoteList";
import { Pagination } from "@/components/Pagination/Pagination";
import { fetchNotes } from "@/lib/api/clientApi";
import { useNoteStore } from "@/lib/store/noteStore";
import type { NoteTag, NotesResponse } from "@/types/note";
import css from "@/components/NotesClient/NotesClient.module.css";

type NotesFilterClientProps = {
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

export function NotesFilterClient({
  initialData,
  initialSearch,
  initialTag,
  page,
}: NotesFilterClientProps) {
  const router = useRouter();
  const search = useNoteStore((state) => state.search);
  const tag = useNoteStore((state) => state.tag);
  const currentPage = useNoteStore((state) => state.page);
  const setSearch = useNoteStore((state) => state.setSearch);
  const setTag = useNoteStore((state) => state.setTag);
  const setPage = useNoteStore((state) => state.setPage);
  const resetFilters = useNoteStore((state) => state.resetFilters);
  const [searchInput, setSearchInput] = useState(initialSearch);

  useEffect(() => {
    router.refresh();
    setSearch(initialSearch);
    setTag((initialTag || "All") as NoteTag);
    setPage(page);
  }, [initialSearch, initialTag, page, router, setPage, setSearch, setTag]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSearch(searchInput);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [searchInput, setSearch]);

  const notesQuery = useQuery({
    queryKey: ["notes", search, tag, currentPage],
    queryFn: () =>
      fetchNotes({
        search,
        tag,
        page: currentPage,
        perPage: 12,
      }),
    initialData,
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

    setPage(nextPage);
    startTransition(() => {
      router.push(`/notes${params.toString() ? `?${params.toString()}` : ""}`);
    });
  }

  return (
    <div className={css.layout}>
      <section className={css.panel}>
        <div className={css.filters}>
          <SearchBox value={searchInput} onChange={setSearchInput} />

          <label className={css.field}>
            <span>Tag</span>
            <select
              className={css.select}
              value={tag}
              onChange={(event) => {
                const nextTag = event.target.value as NoteTag;
                setTag(nextTag);
                updateRoute(search, nextTag, 1);
              }}
            >
              {tags.map((tagOption) => (
                <option key={tagOption} value={tagOption}>
                  {tagOption}
                </option>
              ))}
            </select>
          </label>

          <div className={css.actions}>
            <Link href="/notes/action/create" className={css.primaryButton}>
              Create note
            </Link>
            <button
              type="button"
              className={css.secondaryButton}
              onClick={() => {
                setSearchInput("");
                resetFilters();
                updateRoute("", "All", 1);
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </section>

      <section className={css.panel}>
        <NoteList notes={notesQuery.data.notes} />
        <Pagination
          page={currentPage}
          totalPages={notesQuery.data.totalPages}
          onPrevious={() => updateRoute(search, tag, currentPage - 1)}
          onNext={() => updateRoute(search, tag, currentPage + 1)}
        />
      </section>
    </div>
  );
}
