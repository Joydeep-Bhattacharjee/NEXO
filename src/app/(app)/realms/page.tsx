import { redirect } from "next/navigation";

/** Realms moved into the separate anonymous zone. */
export default function RealmsPage() {
  redirect("/anon");
}
