import css from "./page.module.css";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api/serverApi";
import { NoteDetailsClient } from "./NoteDetails.client";

type NoteDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function NoteDetailsPage({
  params,
}: NoteDetailsPageProps) {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <main className={css.main}>
      <div className="container">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <NoteDetailsClient noteId={id} />
        </HydrationBoundary>
      </div>
    </main>
  );
}
