import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface Task {
  taskId: string;
  description: string;
  status: 'pending' | 'completed';
}

interface ListTasksProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onRemoveTask: (taskId: string) => void;
}

export function ListTasks({ tasks, onToggleTask, onRemoveTask }: ListTasksProps) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Current Tasks</CardTitle>
        <CardDescription>
          {tasks.length > 0
            ? "Here&apos;s your current task list:"
            : "You don't have any tasks yet."}
        </CardDescription>
      </CardHeader>
      {tasks.length > 0 && (
        <CardContent>
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li key={task.taskId} className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center grow mr-2">
                  <Checkbox
                    id={`task-${task.taskId}`}
                    checked={task.status === 'completed'}
                    onChange={() => onToggleTask(task.taskId)}
                  />
                  <span className={`ml-2 ${task.status === 'completed' ? "line-through text-muted-foreground" : ""}`}>
                    {task.description}
                  </span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => onRemoveTask(task.taskId)}>
                  <Trash2 className="size-4" />
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      )}
    </Card>
  );
}
