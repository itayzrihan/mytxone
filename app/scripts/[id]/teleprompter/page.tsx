import { auth } from "@/app/(auth)/auth";
import { redirect } from "next/navigation";
import { TeleprompterPageContent } from "@/components/custom/teleprompter-page-content";

interface TeleprompterPageProps {
  params: {
    id: string;
  };
}

export default async function TeleprompterPage({ params }: TeleprompterPageProps) {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }

  return <TeleprompterPageContent scriptId={params.id} user={session.user} />;
}