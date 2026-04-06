import { redirect } from "next/navigation";
import { fetchNotes } from "@/lib/api/serverApi";
import { NotesFilterClient } from "./Notes.client";

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

  const initialData = await fetchNotes({ tag, page: 1, perPage: 12 });

  return (
    <main style={{ flex: 1, padding: "32px 0 56px" }}>
      <div className="container">
        <NotesFilterClient
          initialData={initialData}
          initialSearch=""
          initialTag={tag}
          page={1}
        />
      </div>
    </main>
  );
}
