/**
 * Session feature exports
 */

// Context and hooks
export { 
  SessionContext, 
  SessionProvider, 
  useSession, 
  useRecoveryPoint 
} from './SessionContext';

// Components
export { SessionControls } from './components/SessionControls';
export { RecoveryPointList } from './components/RecoveryPointList';
export { SessionStatus } from './components/SessionStatus';

export { 
  ErrorBoundary, 
  ErrorBoundaryProvider 
} from './components/ErrorBoundary';

// Types
export type { 
  SessionContextType, 
  RecoveryPoint, 
  AppState, 
  SessionInfo, 
  StorageProvider, 
  SessionProviderOptions,
  SessionEventType,
  SessionEvent
} from './types';

// Storage
export { 
  createStorage, 
  defaultStorage, 
  LocalStorageProvider, 
  IndexedDBStorageProvider 
} from './storage';

// Hooks
export { 
  usePersistentState, 
  useSessionState, 
  useWindowState 
} from './hooks/usePersistentState';

export { 
  useSessionForm 
} from './hooks/useSessionForm';

// Utilities
export {
  safeAsync,
  safeExecute,
  collectAppState,
  debounce,
  generateId,
  getCurrentTimestamp,
  formatDate,
  safeJsonParse,
  safeJsonStringify,
  useDocumentVisibility
} from './utils';
