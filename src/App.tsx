import { useState, useEffect, FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  SessionProvider,
  ErrorBoundary,
  ErrorBoundaryProvider,
  SessionControls,
  RecoveryPointList,
  SessionStatus,
  useRecoveryPoint,
  useSessionForm,
  useSession
} from './features/session';

// Define types for our data
interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'completed';
  dueDate?: string;
}

// Form values interface
interface TaskFormValues {
  title: string;
  description: string;
}

// Task Form component with session persistence
function TaskForm({ onSubmitSuccess }: { onSubmitSuccess?: () => void }) {
  const { createManualRecoveryPoint } = useRecoveryPoint();
  const [loading, setLoading] = useState(false);

  // Use our session form hook
  const form = useSessionForm<TaskFormValues>({
    formId: 'create-task',
    initialValues: {
      title: '',
      description: '',
    },
    createRecoveryPointOnChange: true,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    form.handleSubmit(e);

    if (!form.values.title) return;

    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: form.values.title,
          description: form.values.description,
          status: 'todo',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      // Create a recovery point after successful submission
      await createManualRecoveryPoint('Task created', {
        taskTitle: form.values.title,
        action: 'create'
      });

      // Reset form and notify parent
      form.resetForm();
      onSubmitSuccess?.();
    } catch (error) {
      console.error('Error creating task:', error);
      form.setErrors({
        form: error instanceof Error ? error.message : 'An unknown error occurred'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Task</CardTitle>
        <CardDescription>Add a new task to your list</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter task title"
              value={form.values.title}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              required
            />
            {form.errors.title && form.touched.title && (
              <p className="text-sm text-destructive">{form.errors.title}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              placeholder="Enter task description"
              value={form.values.description}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
            />
            {form.errors.description && form.touched.description && (
              <p className="text-sm text-destructive">{form.errors.description}</p>
            )}
          </div>
          {form.errors.form && (
            <div className="p-2 bg-destructive/10 rounded-md text-destructive text-sm">
              {form.errors.form}
            </div>
          )}
          {!form.isPristine && (
            <div className="text-xs text-muted-foreground">
              Form state saved automatically. You can resume this form later.
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Submitting...' : 'Add Task'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

// Task List component
function TaskList({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        No tasks available. Create your first task above.
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Tasks</CardTitle>
        <CardDescription>Manage your tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li key={task.id} className="p-3 border rounded-md">
              <h3 className="font-medium">{task.title}</h3>
              {task.description && <p className="text-sm text-muted-foreground">{task.description}</p>}
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs px-2 py-1 bg-primary/10 rounded-full">{task.status}</span>
                {task.dueDate && <span className="text-xs">{new Date(task.dueDate).toLocaleDateString()}</span>}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

// Session Info component
function SessionInfo() {
  useSession(); // Access session context

  return (
    <Card>
      <CardHeader>
        <CardTitle>Session Management</CardTitle>
        <CardDescription>Manage your work session</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <SessionStatus />

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Create Checkpoint</h3>
          <SessionControls />
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Recent Checkpoints</h3>
          <RecoveryPointList max={5} />
        </div>
      </CardContent>
    </Card>
  );
}

// Main App component
function AppContent() {
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [tasks, setTasks] = useState<Task[]>([]);

  // Fetch server status and tasks
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/api/hello');
        const data = await response.json();
        setMessage(data.message);

        // Try to fetch tasks if server is running
        try {
          const tasksResponse = await fetch('http://localhost:3000/api/tasks');
          const tasksData = await tasksResponse.json();
          if (tasksData.docs) {
            setTasks(tasksData.docs);
          }
        } catch (error) {
          console.error('Error fetching tasks:', error);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setMessage('Failed to connect to server');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Refresh tasks
  const refreshTasks = async () => {
    try {
      setLoading(true);
      const tasksResponse = await fetch('http://localhost:3000/api/tasks');
      const tasksData = await tasksResponse.json();
      if (tasksData.docs) {
        setTasks(tasksData.docs);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Workspace Manager</h1>
          <p className="text-muted-foreground mt-2">
            Powered by Payload CMS with PostgreSQL
            <span className="ml-2 px-2 py-0.5 rounded-full bg-primary/10 text-xs">
              {loading ? 'Connecting...' : message || 'Not connected'}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <TaskForm onSubmitSuccess={refreshTasks} />
            <TaskList tasks={tasks} />
          </div>

          <div>
            <SessionInfo />
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrap the app with providers
function App() {
  return (
    <ErrorBoundary>
      <SessionProvider>
        <ErrorBoundaryProvider>
          <AppContent />
        </ErrorBoundaryProvider>
      </SessionProvider>
    </ErrorBoundary>
  );
}

export default App;
