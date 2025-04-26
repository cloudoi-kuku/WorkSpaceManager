import { useState, useEffect } from 'react';
import {
  SessionProvider,
  ErrorBoundary,
  ErrorBoundaryProvider,
  SessionControls,
  RecoveryPointList,
  SessionStatus,
} from './features/session';

import { 
  WorkspaceProvider, 
  WorkspaceDashboard,
  SyncIndicator
} from './features/workspace';

// Main App component
function AppContent() {
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch server status
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/api/hello');
        const data = await response.json();
        setMessage(data.message);
      } catch (error) {
        console.error('Error fetching data:', error);
        setMessage('Failed to connect to server');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900">
      <header className="border-b border-border dark:border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Workspace Manager</h1>
            <p className="text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${message ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                {loading ? 'Connecting to server...' : message ? `Connected: ${message}` : 'Not connected'}
              </span>
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <WorkspaceDashboard />
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Session Management</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">Manage your work session</p>
              </div>
              <div className="px-4 py-5 sm:p-6 space-y-4">
                <SessionStatus />

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Create Checkpoint</h4>
                  <SessionControls />
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Recent Checkpoints</h4>
                  <RecoveryPointList max={5} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Wrap the app with providers
function App() {
  return (
    <ErrorBoundary>
      <SessionProvider>
        <WorkspaceProvider>
          <ErrorBoundaryProvider>
            <AppContent />
            <SyncIndicator />
          </ErrorBoundaryProvider>
        </WorkspaceProvider>
      </SessionProvider>
    </ErrorBoundary>
  );
}

export default App;
