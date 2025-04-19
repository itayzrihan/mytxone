import { CheckCircle, Save, Trash2 } from "lucide-react";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface MemoryConfirmationProps {
  memoryId: string;
  content?: string; // Optional: only present when saving
  status: 'saved' | 'forgotten';
}

export function MemoryConfirmation({ memoryId, content, status }: MemoryConfirmationProps) {
  const isSaved = status === 'saved';

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="flex items-center">
          {isSaved ? (
            <><Save className="mr-2 size-5 text-green-500" /> Memory Saved</>
          ) : (
            <><Trash2 className="mr-2 size-5 text-orange-500" /> Memory Forgotten</>
          )}
        </CardTitle>
        <CardDescription>
          {isSaved
            ? `Okay, I'll remember: "${content}"`
            : `Okay, I've forgotten the memory.`}
          {` (ID: ${memoryId.substring(0, 6)}...)`}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
