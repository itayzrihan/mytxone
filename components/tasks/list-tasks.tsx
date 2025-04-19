import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox"; // Assuming you have a Checkbox component
import { Label } from "@/components/ui/label";

interface Task {
  taskId: string;
  description: string;
  status: 'pending' | 'completed';
}

interface ListTasksProps {
  tasks: Task[];
}

export function ListTasks({ tasks }: ListTasksProps) {
  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Your Tasks</CardTitle>
        <CardDescription>Here's your current task list.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {pendingTasks.length > 0 && (
          <div>
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">Pending</h3>
            <ul className="space-y-2">
              {pendingTasks.map((task) => (
                <li key={task.taskId} className="flex items-center space-x-2">
                  <Checkbox id={`task-${task.taskId}`} disabled />
                  <Label htmlFor={`task-${task.taskId}`} className="flex-grow">{task.description}</Label>
                  {/* Add a button/action here later to mark as complete? */}
                </li>
              ))}
            </ul>
          </div>
        )}
        {completedTasks.length > 0 && (
          <div>
            <h3 className="mt-4 mb-2 text-sm font-medium text-muted-foreground">Completed</h3>
            <ul className="space-y-2">
              {completedTasks.map((task) => (
                <li key={task.taskId} className="flex items-center space-x-2">
                  <Checkbox id={`task-${task.taskId}`} checked disabled />
                  <Label htmlFor={`task-${task.taskId}`} className="flex-grow line-through text-muted-foreground">{task.description}</Label>
                </li>
              ))}
            </ul>
          </div>
        )}
        {tasks.length === 0 && (
          <p className="text-sm text-muted-foreground">You have no tasks yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
