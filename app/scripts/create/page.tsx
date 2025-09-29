import { auth } from "@/app/(auth)/auth";
import { redirect } from "next/navigation";
import { ScriptCreatePageContent } from "@/components/custom/script-create-page-content";

export default async function CreateScriptPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }

  return <ScriptCreatePageContent user={session.user} />;
}