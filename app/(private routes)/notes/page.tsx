import css from "./page.module.css";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api/serverApi";
import { NotesClient } from "@/components/NotesClient/NotesClient";

type NotesPageProps = {
  searchParams: Promise<{
    search?: string;
    page?: string;
    tag?: string;
  }>;
};

export default async function NotesPage({ searchParams }: NotesPageProps) {
  const params = await searchParams;
  const search = params.search ?? "";
  const tag = params.tag ?? "All";
  const page = Number(params.page ?? "1");
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", search, tag, page],
    queryFn: () => fetchNotes({ search, tag, page, perPage: 12 }),
  });

  return (
    <main className={css.main}>
      <div className="container">
        <div className={css.header}>
          <h1 className={css.title}>Your Notes</h1>
          <p className={css.subtitle}>
            Browse, create, filter, and delete notes inside your protected
            workspace.
          </p>
        </div>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <NotesClient initialSearch={search} initialTag={tag} page={page} />
        </HydrationBoundary>
      </div>
    </main>
  );
}
