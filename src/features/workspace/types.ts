/**
 * Type definitions for workspace management
 */

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  tasks: WorkspaceTask[];
  settings: WorkspaceSettings;
}

export interface WorkspaceTask {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'completed';
  dueDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceSettings {
  theme?: 'light' | 'dark' | 'system';
  autoSaveInterval?: number; // in milliseconds
  showCompletedTasks?: boolean;
  prioritizeByDueDate?: boolean;
  notificationsEnabled?: boolean;
}

export interface WorkspaceState {
  currentWorkspace: Workspace | null;
  workspaces: Workspace[];
  isLoading: boolean;
  error: string | null;
}

export type WorkspaceAction = 
  | { type: 'SET_CURRENT_WORKSPACE', payload: Workspace }
  | { type: 'LOAD_WORKSPACES', payload: Workspace[] }
  | { type: 'ADD_WORKSPACE', payload: Workspace }
  | { type: 'UPDATE_WORKSPACE', payload: Workspace }
  | { type: 'DELETE_WORKSPACE', payload: string }
  | { type: 'ADD_TASK', payload: { workspaceId: string, task: WorkspaceTask } }
  | { type: 'UPDATE_TASK', payload: { workspaceId: string, task: WorkspaceTask } }
  | { type: 'DELETE_TASK', payload: { workspaceId: string, taskId: string } }
  | { type: 'SET_LOADING', payload: boolean }
  | { type: 'SET_ERROR', payload: string | null };
