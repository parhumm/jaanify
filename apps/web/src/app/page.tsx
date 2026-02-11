import { redirect } from "next/navigation";

export default async function HomePage() {
  // TODO: Check auth/guest session state
  redirect("/onboarding");
}
