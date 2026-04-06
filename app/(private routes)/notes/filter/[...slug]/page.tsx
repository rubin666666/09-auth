import { redirect } from "next/navigation";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api/serverApi";
import { Notes } from "./Notes.client";

type FilterSlugPageProps = {
  params: Promise<{
    slug?: string[];
  }>;
};

export default async function FilterSlugPage({ params }: FilterSlugPageProps) {
  const { slug = [] } = await params;
  const tag = slug[0] ?? "All";

  if (slug.length > 1) {
    redirect("/notes");
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", "", tag, 1],
    queryFn: () => fetchNotes({ tag, page: 1, perPage: 12 }),
  });

  return (
    <main style={{ flex: 1, padding: "32px 0 56px" }}>
      <div className="container">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Notes initialSearch="" initialTag={tag} page={1} />
        </HydrationBoundary>
      </div>
    </main>
  );
}
