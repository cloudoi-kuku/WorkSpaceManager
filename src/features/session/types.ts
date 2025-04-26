/**
 * Type definitions for the session management feature
 */

// Recovery point represents a snapshot of the application state
export interface RecoveryPoint {
  id: string;
  timestamp: string;
  description: string;
  stateKey: string;
  snapshotType: 'auto' | 'manual';
  operationContext?: Record<string, any>;
}

// Application state that will be persisted
export interface AppState {
  tasks?: Record<string, any>[];
  currentWorkspace?: Record<string, any>;
  formState?: Record<string, any>;
  viewState?: Record<string, any>;
  [key: string]: any;
}

// Session info type
export interface SessionInfo {
  sessionId: string;
  windowId: string;
  startTime: string;
  lastActive: string;
  recoveryPoints: RecoveryPoint[];
}

// Context for the Session Provider
export interface SessionContextType {
  sessionId: string;
  windowId: string;
  recoveryPoints: RecoveryPoint[];
  createRecoveryPoint: (description: string, type?: 'auto' | 'manual', context?: any) => Promise<string>;
  restoreFromRecoveryPoint: (recoveryPointId: string) => Promise<boolean>;
  saveSessionState: <T>(key: string, state: T) => Promise<void>;
  getSessionState: <T>(key: string, defaultValue?: T) => Promise<T>;
  clearRecoveryPoints: (type?: 'auto' | 'manual') => Promise<void>;
}

// Options for the Session Provider
export interface SessionProviderOptions {
  sessionId?: string;
  maxRecoveryPoints?: number;
  autoSaveInterval?: number;
}

// Storage provider interface
export interface StorageProvider {
  get<T>(key: string, defaultValue?: T): Promise<T>;
  set<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
}

// Event types for session monitoring
export type SessionEventType = 
  | 'session-created'
  | 'recovery-point-created' 
  | 'state-saved' 
  | 'state-restored'
  | 'session-error'
  | 'session-inactive'
  | 'session-resumed';

// Event data for session events
export interface SessionEvent {
  type: SessionEventType;
  timestamp: string;
  data?: any;
}
