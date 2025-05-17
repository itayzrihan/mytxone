import { Main } from "@/components/custom/shmn/main";
import { generateUUID } from "@/lib/utils";

export default async function Page() {
  const id = generateUUID();
  return <Main/>;
}
