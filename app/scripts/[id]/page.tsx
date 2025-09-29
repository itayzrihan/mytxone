import { auth } from "@/app/(auth)/auth";
import { redirect } from "next/navigation";
import { ScriptDetailPageContent } from "@/components/custom/script-detail-page-content";

interface ScriptDetailPageProps {
  params: {
    id: string;
  };
}

export default async function ScriptDetailPage({ params }: ScriptDetailPageProps) {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }

  return <ScriptDetailPageContent scriptId={params.id} user={session.user} />;
}