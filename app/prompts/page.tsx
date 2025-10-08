import { auth } from "@/app/(auth)/auth";
import { redirect } from "next/navigation";
import { PromptsPageContent } from "@/components/custom/prompts-page-content";

export default async function PromptsPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }

  return <PromptsPageContent user={session.user} />;
}
