import { redirect } from "next/navigation";

/** Old thread URLs now open inside the anonymous zone. */
export default async function ThreadRedirect({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  redirect(`/anon/${slug}/${id}`);
}
