import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Memory } from "@/db/schema"; // Assuming Memory type is exported from schema
import { Trash2 } from "lucide-react";

interface ListMemoriesProps {
  memories: Memory[];
  // TODO: Add function prop to handle forget action
  // onForgetMemory: (memoryId: string) => void;
}

export function ListMemories({ memories }: ListMemoriesProps) {
  const multipleFound = memories.length > 1;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Recalled Memories</CardTitle>
        <CardDescription>
          {memories.length > 0
            ? "Here are the things I remember for you:"
            : "I don't have any memories saved for you yet."}
        </CardDescription>
      </CardHeader>
      {memories.length > 0 && (
        <CardContent>
          <ul className="space-y-3">
            {memories.map((memory) => (
              <li key={memory.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-2">
                <span className="flex-grow mb-1 sm:mb-0">{memory.content}</span>
                <code className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded select-all">
                  ID: {memory.id}
                </code>
              </li>
            ))}
          </ul>
          {multipleFound && (
            <p className="text-xs text-muted-foreground mt-3">I found multiple matches. Please tell me the full ID of the one you want to forget.</p>
          )}
          {!multipleFound && memories.length === 1 && (
            <p className="text-xs text-muted-foreground mt-3">To forget this, tell me: "Forget memory {memories[0].id}".</p>
          )}
        </CardContent>
      )}
    </Card>
  );
}
