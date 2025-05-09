import { CheckCircle, PlusCircle, CircleSlash } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface TaskConfirmationProps {
  taskId: string;
  description?: string; // Optional: only present when adding
  status: 'added' | 'completed' | 'pending';
}

export function TaskConfirmation({ taskId, description, status }: TaskConfirmationProps) {
  const isAdded = status === 'added';
  const isCompleted = status === 'completed';
  const isPending = status === 'pending';

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="flex items-center">
          {isAdded ? (
            <><PlusCircle className="mr-2 size-5 text-green-500" /> Task Added</>
          ) : isCompleted ? (
            <><CheckCircle className="mr-2 size-5 text-blue-500" /> Task Completed</>
          ) : (
            <><CircleSlash className="mr-2 size-5 text-amber-500" /> Task Uncompleted</>
          )}
        </CardTitle>
        <CardDescription>
          {isAdded
            ? `Task "${description}" has been added.`
            : isCompleted
            ? `Task has been marked as complete.`
            : `Task has been marked as incomplete.`}
        </CardDescription>
      </CardHeader>
      {/* Optionally add more details or actions here */}
      {/* <CardContent>
        <p className="text-xs text-muted-foreground">Task ID: {taskId}</p>
      </CardContent> */}
    </Card>
  );
}
