import { Chat } from "@/components/custom/chat";
import { generateUUID } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function Page() {
  const id = generateUUID();
  return <Chat key={id} id={id} initialMessages={[]} />;
}
