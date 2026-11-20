import { redirect } from "next/navigation";

/** Old Realm URLs now open inside the anonymous zone. */
export default async function RealmRedirect({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  redirect(`/anon/${slug}`);
}
