import { useState, useEffect, FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Define types for our data
interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'completed';
  dueDate?: string;
}

function App() {
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  // Fetch server status
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3001/api/hello');
        const data = await response.json();
        setMessage(data.message);

        // Try to fetch tasks if server is running
        try {
          const tasksResponse = await fetch('http://localhost:3001/api/tasks');
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

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!title) return;

    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          status: 'todo',
        }),
      });

      const newTask = await response.json();

      // Add the new task to the list
      setTasks([...tasks, newTask]);

      // Clear the form
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Task Manager</h1>
          <p className="text-muted-foreground mt-2">Powered by Payload CMS with PostgreSQL</p>
        </div>

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
                  placeholder="Enter task title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Enter task description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="pt-2">
                <p className="text-sm font-medium">Server Status:</p>
                <p className="text-sm text-muted-foreground">
                  {loading ? 'Loading...' : message || 'Not connected'}
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Submitting...' : 'Add Task'}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {tasks.length > 0 && (
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
        )}
      </div>
    </div>
  );
}

export default App;
