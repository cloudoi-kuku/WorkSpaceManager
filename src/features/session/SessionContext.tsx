/**
 * Session management context provider
 */
import { createContext, useState, useEffect, useCallback, useRef, useContext, ReactNode } from 'react';
import { SessionContextType, RecoveryPoint, SessionProviderOptions, AppState, SessionEvent } from './types';
import { defaultStorage } from './storage';
import { collectAppState, safeAsync, generateId, getCurrentTimestamp, debounce } from './utils';

// Default context implementation
const defaultSessionContext: SessionContextType = {
  sessionId: '',
  windowId: '',
  recoveryPoints: [],
  createRecoveryPoint: async () => '',
  restoreFromRecoveryPoint: async () => false,
  saveSessionState: async () => {},
  getSessionState: async <T,>(key: string, defaultValue?: T) => defaultValue as T,
  clearRecoveryPoints: async () => {},
};

// Create the context
export const SessionContext = createContext<SessionContextType>(defaultSessionContext);

// Provider props
interface SessionProviderProps {
  children: ReactNode;
  options?: SessionProviderOptions;
}

// Recovery Point config
const DEFAULT_MAX_RECOVERY_POINTS = 20;
const DEFAULT_AUTO_SAVE_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Provider component for session management
 */
export const SessionProvider: React.FC<SessionProviderProps> = ({ 
  children, 
  options = {} 
}) => {
  // Extract options
  const { 
    sessionId: providedSessionId,
    maxRecoveryPoints = DEFAULT_MAX_RECOVERY_POINTS,
    autoSaveInterval = DEFAULT_AUTO_SAVE_INTERVAL
  } = options;

  // Generate or use provided session and window IDs
  const [sessionId] = useState(() => providedSessionId || generateId());
  const [windowId] = useState(() => generateId());
  
  // State for recovery points
  const [recoveryPoints, setRecoveryPoints] = useState<RecoveryPoint[]>([]);
  
  // Reference to auto-save interval
  const autoSaveIntervalRef = useRef<number | null>(null);
  
  // Reference to track last activity time
  const lastActivityRef = useRef<Date>(new Date());
  
  // Reference to track if tab is active
  const isTabActiveRef = useRef<boolean>(true);
  
  // Session data
  const sessionEventChannel = useRef<BroadcastChannel | null>(null);

  // Load recovery points on mount
  useEffect(() => {
    const loadRecoveryPoints = async () => {
      const [loadedPoints, error] = await safeAsync(async () => {
        return await defaultStorage.get<RecoveryPoint[]>(`recovery-points-${sessionId}`, []);
      });
      
      if (error) {
        console.error('Error loading recovery points:', error);
        return;
      }
      
      setRecoveryPoints(loadedPoints || []);
    };
    
    loadRecoveryPoints();
  }, [sessionId]);

  // Save recovery points when they change
  useEffect(() => {
    const saveRecoveryPoints = async () => {
      await safeAsync(async () => {
        await defaultStorage.set(`recovery-points-${sessionId}`, recoveryPoints);
      });
    };
    
    saveRecoveryPoints();
  }, [sessionId, recoveryPoints]);
  
  // Set up auto-save timer
  useEffect(() => {
    const createAutoRecoveryPoint = async () => {
      // Only create if user has been active recently (within last 15 minutes)
      const now = new Date();
      const timeSinceLastActivity = now.getTime() - lastActivityRef.current.getTime();
      
      // If user has been inactive for more than 15 minutes, don't create auto recovery point
      if (timeSinceLastActivity > 15 * 60 * 1000) {
        return;
      }
      
      if (isTabActiveRef.current) {
        await createRecoveryPoint('Auto-saved recovery point', 'auto');
      }
    };
    
    // Set up auto-save interval
    autoSaveIntervalRef.current = window.setInterval(createAutoRecoveryPoint, autoSaveInterval);
    
    // Clean up on unmount
    return () => {
      if (autoSaveIntervalRef.current !== null) {
        clearInterval(autoSaveIntervalRef.current);
      }
    };
  }, [autoSaveInterval]);
  
  // Set up activity tracking
  useEffect(() => {
    const updateLastActivity = () => {
      lastActivityRef.current = new Date();
    };
    
    // Track various user activities
    window.addEventListener('mousemove', updateLastActivity);
    window.addEventListener('keydown', updateLastActivity);
    window.addEventListener('click', updateLastActivity);
    window.addEventListener('scroll', updateLastActivity);
    window.addEventListener('touchstart', updateLastActivity);
    
    // Track tab visibility
    const handleVisibilityChange = () => {
      isTabActiveRef.current = document.visibilityState === 'visible';
      updateLastActivity();
      
      // Create recovery point when tab becomes visible
      if (isTabActiveRef.current) {
        createRecoveryPoint('Tab resumed', 'auto');
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Create initial recovery point
    createRecoveryPoint('Session started', 'auto');
    
    // Clean up on unmount
    return () => {
      window.removeEventListener('mousemove', updateLastActivity);
      window.removeEventListener('keydown', updateLastActivity);
      window.removeEventListener('click', updateLastActivity);
      window.removeEventListener('scroll', updateLastActivity);
      window.removeEventListener('touchstart', updateLastActivity);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  
  // Handle beforeunload event to create a recovery point before page unloads
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // Create a recovery point synchronously (can't use async here)
      try {
        const timestamp = getCurrentTimestamp();
        const stateKey = `recovery-point-${sessionId}-${timestamp}`;
        const currentState = collectAppState();
        
        localStorage.setItem(stateKey, JSON.stringify(currentState));
        
        const recoveryPoint: RecoveryPoint = {
          id: generateId(),
          timestamp,
          description: 'Window closing',
          stateKey,
          snapshotType: 'auto',
        };
        
        const updatedPoints = [...recoveryPoints, recoveryPoint];
        localStorage.setItem(`recovery-points-${sessionId}`, JSON.stringify(updatedPoints));
      } catch (error) {
        console.error('Error creating recovery point during unload:', error);
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [sessionId, recoveryPoints]);
  
  // Set up cross-window communication
  useEffect(() => {
    try {
      // Create channel for cross-window communication
      sessionEventChannel.current = new BroadcastChannel(`session-events-${sessionId}`);
      
      // Listen for events from other windows
      sessionEventChannel.current.onmessage = (event) => {
        const sessionEvent = event.data as SessionEvent;
        
        if (sessionEvent.type === 'recovery-point-created') {
          // Update recovery points from other windows
          const newRecoveryPoint = sessionEvent.data as RecoveryPoint;
          setRecoveryPoints(prevPoints => {
            // Avoid duplicates
            if (prevPoints.some(p => p.id === newRecoveryPoint.id)) {
              return prevPoints;
            }
            
            return [...prevPoints, newRecoveryPoint];
          });
        }
      };
      
      // Clean up on unmount
      return () => {
        sessionEventChannel.current?.close();
      };
    } catch (error) {
      console.error('Error setting up broadcast channel:', error);
      return undefined;
    }
  }, [sessionId]);
  
  // Function to broadcast session events to other windows
  const broadcastSessionEvent = useCallback((eventType: SessionEvent['type'], data?: any) => {
    try {
      if (sessionEventChannel.current) {
        sessionEventChannel.current.postMessage({
          type: eventType,
          timestamp: getCurrentTimestamp(),
          data,
        } as SessionEvent);
      }
    } catch (error) {
      console.error('Error broadcasting session event:', error);
    }
  }, []);

  // Create a recovery point with the current state
  const createRecoveryPoint = useCallback(async (
    description: string, 
    type: 'auto' | 'manual' = 'auto', 
    context?: any
  ): Promise<string> => {
    try {
      const timestamp = getCurrentTimestamp();
      const stateKey = `recovery-point-${sessionId}-${timestamp}`;
      
      // Collect app state
      const currentState = collectAppState();
      
      // Save state
      await defaultStorage.set(stateKey, currentState);
      
      // Create recovery point
      const recoveryPoint: RecoveryPoint = {
        id: generateId(),
        timestamp,
        description,
        stateKey,
        snapshotType: type,
        operationContext: context,
      };
      
      // Limit number of recovery points
      setRecoveryPoints(prevPoints => {
        let newPoints = [...prevPoints, recoveryPoint];
        
        // Enforce the max recovery points limit, keeping newer points
        // and prioritizing manual recovery points
        if (newPoints.length > maxRecoveryPoints) {
          // First, try to remove older auto recovery points
          const autoPoints = newPoints.filter(p => p.snapshotType === 'auto');
          
          if (autoPoints.length > 0) {
            // Sort by timestamp (oldest first)
            autoPoints.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
            
            // Remove oldest auto point
            const oldestAutoPointId = autoPoints[0].id;
            newPoints = newPoints.filter(p => p.id !== oldestAutoPointId);
          } else {
            // If no auto points, remove oldest manual point
            const manualPoints = newPoints.filter(p => p.snapshotType === 'manual');
            manualPoints.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
            
            const oldestManualPointId = manualPoints[0].id;
            newPoints = newPoints.filter(p => p.id !== oldestManualPointId);
          }
        }
        
        return newPoints;
      });
      
      // Broadcast to other windows
      broadcastSessionEvent('recovery-point-created', recoveryPoint);
      
      return recoveryPoint.id;
    } catch (error) {
      console.error('Error creating recovery point:', error);
      throw error;
    }
  }, [sessionId, broadcastSessionEvent, maxRecoveryPoints]);

  // Restore app state from a recovery point
  const restoreFromRecoveryPoint = useCallback(async (recoveryPointId: string): Promise<boolean> => {
    try {
      // Find the recovery point
      const recoveryPoint = recoveryPoints.find(p => p.id === recoveryPointId);
      
      if (!recoveryPoint) {
        console.error(`Recovery point ${recoveryPointId} not found`);
        return false;
      }
      
      // Get the state from storage
      const [state, error] = await safeAsync(async () => {
        return await defaultStorage.get<AppState>(recoveryPoint.stateKey);
      });
      
      if (error || !state) {
        console.error(`Error retrieving state for recovery point ${recoveryPointId}:`, error);
        return false;
      }
      
      // Restore the state
      if (state.tasks) {
        await defaultStorage.set('workspace-manager:tasks', state.tasks);
      }
      
      if (state.currentWorkspace) {
        await defaultStorage.set('workspace-manager:currentWorkspace', state.currentWorkspace);
      }
      
      if (state.formState) {
        for (const [formName, formData] of Object.entries(state.formState)) {
          await defaultStorage.set(`workspace-manager:form:${formName}`, formData);
        }
      }
      
      if (state.viewState) {
        for (const [viewName, viewData] of Object.entries(state.viewState)) {
          await defaultStorage.set(`workspace-manager:view:${viewName}`, viewData);
        }
      }
      
      // Create a recovery point after restoration
      await createRecoveryPoint(`Restored from: ${recoveryPoint.description}`, 'auto', {
        restoredFrom: recoveryPointId,
        originalTimestamp: recoveryPoint.timestamp,
      });
      
      // Reload the page to apply the restored state
      window.location.reload();
      
      return true;
    } catch (error) {
      console.error('Error restoring from recovery point:', error);
      return false;
    }
  }, [recoveryPoints, createRecoveryPoint]);

  // Save session state with a specific key
  const saveSessionState = useCallback(async <T,>(key: string, state: T): Promise<void> => {
    try {
      await defaultStorage.set(`session-state-${sessionId}-${key}`, state);
    } catch (error) {
      console.error(`Error saving session state for key ${key}:`, error);
      throw error;
    }
  }, [sessionId]);

  // Get session state by key
  const getSessionState = useCallback(async <T,>(key: string, defaultValue?: T): Promise<T> => {
    try {
      return await defaultStorage.get<T>(`session-state-${sessionId}-${key}`, defaultValue);
    } catch (error) {
      console.error(`Error getting session state for key ${key}:`, error);
      return defaultValue as T;
    }
  }, [sessionId]);

  // Clear recovery points by type
  const clearRecoveryPoints = useCallback(async (type?: 'auto' | 'manual'): Promise<void> => {
    try {
      if (type) {
        // Only remove recovery points of specified type
        setRecoveryPoints(prevPoints => prevPoints.filter(p => p.snapshotType !== type));
      } else {
        // Remove all recovery points
        setRecoveryPoints([]);
      }
    } catch (error) {
      console.error('Error clearing recovery points:', error);
      throw error;
    }
  }, []);
  
  // Create the context value
  const contextValue: SessionContextType = {
    sessionId,
    windowId,
    recoveryPoints,
    createRecoveryPoint,
    restoreFromRecoveryPoint,
    saveSessionState,
    getSessionState,
    clearRecoveryPoints,
  };

  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  );
};

/**
 * Hook to use the session context
 */
export function useSession(): SessionContextType {
  const context = useContext(SessionContext);
  
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  
  return context;
}

/**
 * Helper hook to create recovery points
 */
export function useRecoveryPoint() {
  const { createRecoveryPoint } = useSession();
  
  // Debounced version to avoid creating too many recovery points
  const debouncedCreateRecoveryPoint = useCallback(
    debounce((description: string, context?: any) => {
      createRecoveryPoint(description, 'auto', context);
    }, 1000),
    [createRecoveryPoint]
  );
  
  return {
    // For immediate creation
    createRecoveryPoint,
    
    // For debounced creation (e.g., during form editing)
    createDebouncedRecoveryPoint: debouncedCreateRecoveryPoint,
    
    // For manual recovery points that user explicitly creates
    createManualRecoveryPoint: (description: string, context?: any) => {
      return createRecoveryPoint(description, 'manual', context);
    }
  };
}
