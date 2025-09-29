import { auth } from "@/app/(auth)/auth";
import { redirect } from "next/navigation";
import { ScriptsPageContent } from "@/components/custom/scripts-page-content";

export default async function ScriptsPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }

  return <ScriptsPageContent user={session.user} />;
}