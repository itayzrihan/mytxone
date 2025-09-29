import { Chat } from "@/components/custom/chat";
import { generateUUID } from "@/lib/utils";

export const revalidate = 0;

export default async function Page() {
  const id = generateUUID();
  return <Chat key={id} id={id} initialMessages={[]} />;
}
