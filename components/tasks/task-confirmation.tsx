import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, PlusCircle } from "lucide-react";

interface TaskConfirmationProps {
  taskId: string;
  description?: string; // Optional: only present when adding
  status: 'added' | 'completed';
}

export function TaskConfirmation({ taskId, description, status }: TaskConfirmationProps) {
  const isAdded = status === 'added';

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="flex items-center">
          {isAdded ? (
            <><PlusCircle className="mr-2 h-5 w-5 text-green-500" /> Task Added</>
          ) : (
            <><CheckCircle className="mr-2 h-5 w-5 text-blue-500" /> Task Completed</>
          )}
        </CardTitle>
        <CardDescription>
          {isAdded
            ? `Task "${description}" has been added.`
            : `Task has been marked as complete.`}
        </CardDescription>
      </CardHeader>
      {/* Optionally add more details or actions here */}
      {/* <CardContent>
        <p className="text-xs text-muted-foreground">Task ID: {taskId}</p>
      </CardContent> */}
    </Card>
  );
}
