/**
 * Utility functions for session management
 */
import { AppState } from './types';

/**
 * Helper function to safely execute async functions
 * Returns a tuple with [result, error]
 */
export async function safeAsync<T>(
  operation: () => Promise<T>,
  errorHandler?: (error: any) => void
): Promise<[T | null, Error | null]> {
  try {
    const result = await operation();
    return [result, null];
  } catch (error) {
    if (errorHandler) {
      errorHandler(error);
    } else {
      console.error('Operation failed:', error);
    }
    
    return [null, error instanceof Error ? error : new Error(String(error))];
  }
}

/**
 * Helper function to safely execute synchronous functions
 * Returns a tuple with [result, error]
 */
export function safeExecute<T>(
  operation: () => T,
  errorHandler?: (error: any) => void
): [T | null, Error | null] {
  try {
    const result = operation();
    return [result, null];
  } catch (error) {
    if (errorHandler) {
      errorHandler(error);
    } else {
      console.error('Operation failed:', error);
    }
    
    return [null, error instanceof Error ? error : new Error(String(error))];
  }
}

/**
 * Collects the current application state for snapshot
 */
export function collectAppState(): AppState {
  // In a real implementation, this would gather state from various parts of the app
  // For now, we'll just get what we can from localStorage
  const state: AppState = {};
  
  // Try to get tasks
  try {
    const tasksJson = localStorage.getItem('workspace-manager:tasks');
    if (tasksJson) {
      state.tasks = JSON.parse(tasksJson);
    }
  } catch (error) {
    console.error('Error collecting tasks state:', error);
  }
  
  // Try to get current workspace
  try {
    const workspaceJson = localStorage.getItem('workspace-manager:currentWorkspace');
    if (workspaceJson) {
      state.currentWorkspace = JSON.parse(workspaceJson);
    }
  } catch (error) {
    console.error('Error collecting workspace state:', error);
  }
  
  // Try to get form states
  try {
    const formStateKeys = Object.keys(localStorage).filter(key => 
      key.startsWith('workspace-manager:form:')
    );
    
    if (formStateKeys.length > 0) {
      state.formState = {};
      
      formStateKeys.forEach(key => {
        const formName = key.replace('workspace-manager:form:', '');
        try {
          state.formState![formName] = JSON.parse(localStorage.getItem(key) || '{}');
        } catch (e) {
          console.error(`Error parsing form state for ${formName}:`, e);
        }
      });
    }
  } catch (error) {
    console.error('Error collecting form states:', error);
  }
  
  // Try to get view states
  try {
    const viewStateKeys = Object.keys(localStorage).filter(key => 
      key.startsWith('workspace-manager:view:')
    );
    
    if (viewStateKeys.length > 0) {
      state.viewState = {};
      
      viewStateKeys.forEach(key => {
        const viewName = key.replace('workspace-manager:view:', '');
        try {
          state.viewState![viewName] = JSON.parse(localStorage.getItem(key) || '{}');
        } catch (e) {
          console.error(`Error parsing view state for ${viewName}:`, e);
        }
      });
    }
  } catch (error) {
    console.error('Error collecting view states:', error);
  }
  
  return state;
}

/**
 * Debounce function to limit function calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number | null = null;
  
  return function(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    
    timeout = window.setTimeout(later, wait);
  };
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return crypto.randomUUID();
}

/**
 * Get current timestamp in ISO format
 */
export function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Format a date for display
 */
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleString();
}

/**
 * Safely parse JSON
 */
export function safeJsonParse<T>(json: string, defaultValue: T): T {
  try {
    return JSON.parse(json) as T;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return defaultValue;
  }
}

/**
 * Safely stringify JSON
 */
export function safeJsonStringify<T>(value: T, defaultValue: string = '{}'): string {
  try {
    return JSON.stringify(value);
  } catch (error) {
    console.error('Error stringifying JSON:', error);
    return defaultValue;
  }
}

/**
 * Detect if browser tab is active or not
 */
export function useDocumentVisibility(): boolean {
  return document.visibilityState === 'visible';
}
