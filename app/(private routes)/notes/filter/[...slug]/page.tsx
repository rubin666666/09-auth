import { redirect } from "next/navigation";

type FilterSlugPageProps = {
  params: Promise<{
    slug?: string[];
  }>;
};

export default async function FilterSlugPage({ params }: FilterSlugPageProps) {
  const { slug = [] } = await params;
  const searchParams = new URLSearchParams();

  if (slug[0]) {
    searchParams.set("tag", slug[0]);
  }

  redirect(`/notes${searchParams.toString() ? `?${searchParams.toString()}` : ""}`);
}
