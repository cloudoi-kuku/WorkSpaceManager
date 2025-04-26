/**
 * Workspace management context provider with persistence
 */
import { createContext, useContext, useReducer, useEffect, useRef, ReactNode } from 'react';
import { Workspace, WorkspaceState, WorkspaceAction, WorkspaceTask } from './types';
import { defaultStorage } from '../session/storage';
import { useSession, useRecoveryPoint } from '../session/SessionContext';
import { generateId, getCurrentTimestamp } from '../session/utils';

// Initial state for workspace management
const initialState: WorkspaceState = {
  currentWorkspace: null,
  workspaces: [],
  isLoading: false,
  error: null,
};

// Workspace context type
type WorkspaceContextType = {
  state: WorkspaceState;
  dispatch: React.Dispatch<WorkspaceAction>;
  createWorkspace: (name: string, description?: string) => Promise<Workspace>;
  updateWorkspace: (workspace: Workspace) => Promise<void>;
  deleteWorkspace: (workspaceId: string) => Promise<void>;
  switchWorkspace: (workspaceId: string) => Promise<void>;
  createTask: (title: string, description?: string) => Promise<WorkspaceTask>;
  updateTask: (task: WorkspaceTask) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
};

// Create the context
export const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

// Reducer function for workspace state management
function workspaceReducer(state: WorkspaceState, action: WorkspaceAction): WorkspaceState {
  switch (action.type) {
    case 'SET_CURRENT_WORKSPACE':
      return {
        ...state,
        currentWorkspace: action.payload,
      };
    case 'LOAD_WORKSPACES':
      return {
        ...state,
        workspaces: action.payload,
      };
    case 'ADD_WORKSPACE':
      return {
        ...state,
        workspaces: [...state.workspaces, action.payload],
        currentWorkspace: action.payload,
      };
    case 'UPDATE_WORKSPACE': {
      const updatedWorkspaces = state.workspaces.map(workspace => 
        workspace.id === action.payload.id ? action.payload : workspace
      );
      return {
        ...state,
        workspaces: updatedWorkspaces,
        currentWorkspace: state.currentWorkspace?.id === action.payload.id 
          ? action.payload 
          : state.currentWorkspace,
      };
    }
    case 'DELETE_WORKSPACE': {
      const filteredWorkspaces = state.workspaces.filter(workspace => 
        workspace.id !== action.payload
      );
      return {
        ...state,
        workspaces: filteredWorkspaces,
        currentWorkspace: state.currentWorkspace?.id === action.payload 
          ? filteredWorkspaces[0] || null 
          : state.currentWorkspace,
      };
    }
    case 'ADD_TASK': {
      if (!state.currentWorkspace || state.currentWorkspace.id !== action.payload.workspaceId) {
        return state;
      }
      
      const updatedWorkspace = {
        ...state.currentWorkspace,
        tasks: [...state.currentWorkspace.tasks, action.payload.task],
      };
      
      const updatedWorkspaces = state.workspaces.map(workspace => 
        workspace.id === updatedWorkspace.id ? updatedWorkspace : workspace
      );
      
      return {
        ...state,
        workspaces: updatedWorkspaces,
        currentWorkspace: updatedWorkspace,
      };
    }
    case 'UPDATE_TASK': {
      if (!state.currentWorkspace) {
        return state;
      }
      
      const updatedTasks = state.currentWorkspace.tasks.map(task => 
        task.id === action.payload.task.id ? action.payload.task : task
      );
      
      const updatedWorkspace = {
        ...state.currentWorkspace,
        tasks: updatedTasks,
      };
      
      const updatedWorkspaces = state.workspaces.map(workspace => 
        workspace.id === updatedWorkspace.id ? updatedWorkspace : workspace
      );
      
      return {
        ...state,
        workspaces: updatedWorkspaces,
        currentWorkspace: updatedWorkspace,
      };
    }
    case 'DELETE_TASK': {
      if (!state.currentWorkspace) {
        return state;
      }
      
      const updatedTasks = state.currentWorkspace.tasks.filter(task => 
        task.id !== action.payload.taskId
      );
      
      const updatedWorkspace = {
        ...state.currentWorkspace,
        tasks: updatedTasks,
      };
      
      const updatedWorkspaces = state.workspaces.map(workspace => 
        workspace.id === updatedWorkspace.id ? updatedWorkspace : workspace
      );
      
      return {
        ...state,
        workspaces: updatedWorkspaces,
        currentWorkspace: updatedWorkspace,
      };
    }
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
}

// Provider props
interface WorkspaceProviderProps {
  children: ReactNode;
}

/**
 * Provider component for workspace management
 */
export const WorkspaceProvider: React.FC<WorkspaceProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(workspaceReducer, initialState);
  const { sessionId } = useSession();
  const { createManualRecoveryPoint } = useRecoveryPoint();
  
  // Storage keys
  const workspacesKey = `workspaces-${sessionId}`;
  const currentWorkspaceIdKey = `current-workspace-id-${sessionId}`;
  
  // Broadcast channel for cross-window sync
  const syncChannelRef = useRef<BroadcastChannel | null>(null);
  
  // Initialize sync channel
  useEffect(() => {
    try {
      syncChannelRef.current = new BroadcastChannel(`workspace-sync-${sessionId}`);
      
      return () => {
        syncChannelRef.current?.close();
      };
    } catch (error) {
      console.error('Error setting up sync channel:', error);
      return undefined;
    }
  }, [sessionId]);
  
  // Helper for sending sync events
  const broadcastSyncEvent = (type: 'sync-start' | 'sync-complete' | 'sync-error') => {
    try {
      if (syncChannelRef.current) {
        syncChannelRef.current.postMessage({
          type,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Error broadcasting sync event:', error);
    }
  };
  
  // Load workspaces from storage on mount
  useEffect(() => {
    const loadWorkspaces = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      try {
        // Load workspaces from storage
        const workspaces = await defaultStorage.get<Workspace[]>(workspacesKey, []);
        dispatch({ type: 'LOAD_WORKSPACES', payload: workspaces });
        
        // Load current workspace ID
        const currentWorkspaceId = await defaultStorage.get<string | null>(currentWorkspaceIdKey, null);
        
        // Set current workspace if ID is found
        if (currentWorkspaceId) {
          const currentWorkspace = workspaces.find(workspace => workspace.id === currentWorkspaceId);
          
          if (currentWorkspace) {
            dispatch({ type: 'SET_CURRENT_WORKSPACE', payload: currentWorkspace });
          } else if (workspaces.length > 0) {
            // If current workspace not found, set the first workspace as current
            dispatch({ type: 'SET_CURRENT_WORKSPACE', payload: workspaces[0] });
          }
        } else if (workspaces.length > 0) {
          // If no current workspace ID, set the first workspace as current
          dispatch({ type: 'SET_CURRENT_WORKSPACE', payload: workspaces[0] });
        }
        
        // If no workspaces, create a default workspace
        if (workspaces.length === 0) {
          const defaultWorkspace: Workspace = {
            id: generateId(),
            name: 'Default Workspace',
            description: 'Your default workspace',
            createdAt: getCurrentTimestamp(),
            updatedAt: getCurrentTimestamp(),
            tasks: [],
            settings: {
              theme: 'system',
              autoSaveInterval: 300000, // 5 minutes
              showCompletedTasks: true,
              prioritizeByDueDate: true,
              notificationsEnabled: true,
            },
          };
          
          await defaultStorage.set(workspacesKey, [defaultWorkspace]);
          dispatch({ type: 'ADD_WORKSPACE', payload: defaultWorkspace });
        }
      } catch (error) {
        console.error('Error loading workspaces:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load workspaces' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    
    loadWorkspaces();
  }, [sessionId, workspacesKey, currentWorkspaceIdKey]);
  
  // Save workspaces to storage when they change
  useEffect(() => {
    const saveWorkspaces = async () => {
      try {
        // Broadcast sync start
        broadcastSyncEvent('sync-start');
        
        if (state.workspaces.length > 0) {
          await defaultStorage.set(workspacesKey, state.workspaces);
        }
        
        if (state.currentWorkspace) {
          await defaultStorage.set(currentWorkspaceIdKey, state.currentWorkspace.id);
        }
        
        // Broadcast sync complete
        broadcastSyncEvent('sync-complete');
      } catch (error) {
        console.error('Error saving workspaces:', error);
        broadcastSyncEvent('sync-error');
      }
    };
    
    saveWorkspaces();
  }, [state.workspaces, state.currentWorkspace, workspacesKey, currentWorkspaceIdKey]);
  
  // Create a new workspace
  const createWorkspace = async (name: string, description?: string): Promise<Workspace> => {
    const newWorkspace: Workspace = {
      id: generateId(),
      name,
      description,
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
      tasks: [],
      settings: {
        theme: 'system',
        autoSaveInterval: 300000, // 5 minutes
        showCompletedTasks: true,
        prioritizeByDueDate: true,
        notificationsEnabled: true,
      },
    };
    
    dispatch({ type: 'ADD_WORKSPACE', payload: newWorkspace });
    
    // Create recovery point
    await createManualRecoveryPoint('Workspace created', {
      workspaceId: newWorkspace.id,
      workspaceName: newWorkspace.name,
      action: 'create-workspace',
    });
    
    return newWorkspace;
  };
  
  // Update an existing workspace
  const updateWorkspace = async (workspace: Workspace): Promise<void> => {
    const updatedWorkspace = {
      ...workspace,
      updatedAt: getCurrentTimestamp(),
    };
    
    dispatch({ type: 'UPDATE_WORKSPACE', payload: updatedWorkspace });
    
    // Create recovery point
    await createManualRecoveryPoint('Workspace updated', {
      workspaceId: updatedWorkspace.id,
      workspaceName: updatedWorkspace.name,
      action: 'update-workspace',
    });
  };
  
  // Delete a workspace
  const deleteWorkspace = async (workspaceId: string): Promise<void> => {
    dispatch({ type: 'DELETE_WORKSPACE', payload: workspaceId });
    
    // Create recovery point
    await createManualRecoveryPoint('Workspace deleted', {
      workspaceId,
      action: 'delete-workspace',
    });
  };
  
  // Switch to a different workspace
  const switchWorkspace = async (workspaceId: string): Promise<void> => {
    const workspace = state.workspaces.find(w => w.id === workspaceId);
    
    if (workspace) {
      dispatch({ type: 'SET_CURRENT_WORKSPACE', payload: workspace });
      
      // Create recovery point
      await createManualRecoveryPoint('Switched workspace', {
        workspaceId: workspace.id,
        workspaceName: workspace.name,
        action: 'switch-workspace',
      });
    } else {
      dispatch({ type: 'SET_ERROR', payload: 'Workspace not found' });
    }
  };
  
  // Create a new task in the current workspace
  const createTask = async (title: string, description?: string): Promise<WorkspaceTask> => {
    if (!state.currentWorkspace) {
      throw new Error('No active workspace');
    }
    
    const newTask: WorkspaceTask = {
      id: generateId(),
      title,
      description,
      status: 'todo',
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };
    
    dispatch({
      type: 'ADD_TASK',
      payload: {
        workspaceId: state.currentWorkspace.id,
        task: newTask,
      },
    });
    
    // Create recovery point
    await createManualRecoveryPoint('Task created', {
      workspaceId: state.currentWorkspace.id,
      taskId: newTask.id,
      taskTitle: newTask.title,
      action: 'create-task',
    });
    
    return newTask;
  };
  
  // Update an existing task
  const updateTask = async (task: WorkspaceTask): Promise<void> => {
    if (!state.currentWorkspace) {
      throw new Error('No active workspace');
    }
    
    const updatedTask = {
      ...task,
      updatedAt: getCurrentTimestamp(),
    };
    
    dispatch({
      type: 'UPDATE_TASK',
      payload: {
        workspaceId: state.currentWorkspace.id,
        task: updatedTask,
      },
    });
    
    // Create recovery point
    await createManualRecoveryPoint('Task updated', {
      workspaceId: state.currentWorkspace.id,
      taskId: updatedTask.id,
      taskTitle: updatedTask.title,
      action: 'update-task',
    });
  };
  
  // Delete a task
  const deleteTask = async (taskId: string): Promise<void> => {
    if (!state.currentWorkspace) {
      throw new Error('No active workspace');
    }
    
    dispatch({
      type: 'DELETE_TASK',
      payload: {
        workspaceId: state.currentWorkspace.id,
        taskId,
      },
    });
    
    // Create recovery point
    await createManualRecoveryPoint('Task deleted', {
      workspaceId: state.currentWorkspace.id,
      taskId,
      action: 'delete-task',
    });
  };
  
  // Create the context value
  const contextValue: WorkspaceContextType = {
    state,
    dispatch,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    switchWorkspace,
    createTask,
    updateTask,
    deleteTask,
  };
  
  return (
    <WorkspaceContext.Provider value={contextValue}>
      {children}
    </WorkspaceContext.Provider>
  );
};

/**
 * Hook to use the workspace context
 */
export function useWorkspace(): WorkspaceContextType {
  const context = useContext(WorkspaceContext);
  
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  
  return context;
}
