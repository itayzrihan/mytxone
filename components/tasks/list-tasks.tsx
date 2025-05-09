import { useChat } from "ai/react";
import { Trash2, Edit } from "lucide-react";

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
  chatId?: string; // Add optional chatId parameter
}

export function ListTasks({ tasks, onToggleTask, onRemoveTask, chatId }: ListTasksProps) {
  // Always call the hook, but only configure it when chatId exists
  const chat = useChat({
    id: chatId || 'default-id',
    body: chatId ? { id: chatId } : undefined,
    maxSteps: 5,
  });

  // Only use chat functionality when chatId is provided
  const hasChatId = Boolean(chatId);

  const handleTaskClick = (task: Task) => {
    if (hasChatId && chat) {
      // Append a message to rename the task
      chat.append({
        role: "user",
        content: `I want to change the name of task "${task.description}"`,
      });
    }
  };

  const handleCheckboxClick = (task: Task) => {
    if (hasChatId && chat) {
      // Append a message to mark the task as complete
      const action = task.status === 'completed' ? "mark as incomplete" : "mark as complete";
      chat.append({
        role: "user",
        content: `I want to ${action} the task "${task.description}"`,
      });
    }
    // Still call the original toggle handler
    onToggleTask(task.taskId);
  };

  const handleDeleteClick = (task: Task) => {
    if (hasChatId && chat) {
      // Append a message to delete the task
      chat.append({
        role: "user",
        content: `I want to delete the task "${task.description}"`,
      });
    }
    // Still call the original remove handler
    onRemoveTask(task.taskId);
  };

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
              <li 
                key={task.taskId} 
                className="flex items-center justify-between border-b pb-2 rounded px-1"
              >
                <div className="flex items-center grow mr-2">
                  <Checkbox
                    id={`task-${task.taskId}`}
                    checked={task.status === 'completed'}
                    onChange={(e) => {
                      e.stopPropagation();
                      if (chatId) {
                        handleCheckboxClick(task);
                      } else {
                        onToggleTask(task.taskId);
                      }
                    }}
                    className={chatId ? 'cursor-pointer' : ''}
                  />
                  <span 
                    className={`ml-2 ${task.status === 'completed' ? "line-through text-muted-foreground" : ""} ${chatId ? 'cursor-pointer hover:underline' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (chatId) {
                        handleTaskClick(task);
                      }
                    }}
                  >
                    {task.description}
                  </span>
                  {chatId && (
                    <Edit 
                      className="ml-2 size-3 text-muted-foreground hover:text-foreground cursor-pointer" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTaskClick(task);
                      }}
                    />
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (chatId) {
                      handleDeleteClick(task);
                    } else {
                      onRemoveTask(task.taskId);
                    }
                  }}
                >
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
