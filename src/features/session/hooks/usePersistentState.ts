/**
 * Custom hook for persisting state across sessions
 */
import { useState, useEffect, useCallback, Dispatch, SetStateAction } from 'react';
import { StorageProvider } from '../types';
import { defaultStorage } from '../storage';

export interface PersistentStateOptions<T> {
  storage?: StorageProvider;
  onError?: (error: any) => void;
  transform?: {
    serialize?: (value: T) => any;
    deserialize?: (value: any) => T;
  };
}

/**
 * Hook for persisting state across browser sessions
 * Similar to useState but persists the state to storage
 */
export function usePersistentState<T>(
  key: string, 
  initialValue: T, 
  options: PersistentStateOptions<T> = {}
): [T, Dispatch<SetStateAction<T>>, () => Promise<void>] {
  const { 
    storage = defaultStorage,
    onError = console.error,
    transform = {} 
  } = options;
  
  const { serialize, deserialize } = transform;

  // Internal state
  const [state, setState] = useState<T>(initialValue);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load the initial state from storage
  useEffect(() => {
    const loadInitialState = async () => {
      try {
        const storedValue = await storage.get<T>(key, initialValue);
        const parsedValue = deserialize ? deserialize(storedValue) : storedValue;
        setState(parsedValue);
      } catch (error) {
        onError(`Error loading state for key ${key}: ${error}`);
        setState(initialValue);
      } finally {
        setIsInitialized(true);
      }
    };

    loadInitialState();
  }, [key, initialValue, storage, deserialize, onError]);

  // Update storage when state changes
  useEffect(() => {
    if (!isInitialized) return;

    const persistState = async () => {
      try {
        const valueToStore = serialize ? serialize(state) : state;
        await storage.set(key, valueToStore);
      } catch (error) {
        onError(`Error persisting state for key ${key}: ${error}`);
      }
    };

    persistState();
  }, [key, state, isInitialized, storage, serialize, onError]);

  // Function to reset state to initial value
  const resetState = useCallback(async () => {
    setState(initialValue);
    try {
      await storage.remove(key);
    } catch (error) {
      onError(`Error resetting state for key ${key}: ${error}`);
    }
  }, [key, initialValue, storage, onError]);

  return [state, setState, resetState];
}

/**
 * Hook for state that only persists for the current session
 */
export function useSessionState<T>(
  key: string,
  initialValue: T,
  options: PersistentStateOptions<T> = {}
): [T, Dispatch<SetStateAction<T>>, () => Promise<void>] {
  const sessionKey = `session:${key}`;
  return usePersistentState(sessionKey, initialValue, options);
}

/**
 * Hook for state that persists between windows but is removed when browser is closed
 */
export function useWindowState<T>(
  key: string,
  initialValue: T,
  options: PersistentStateOptions<T> = {}
): [T, Dispatch<SetStateAction<T>>, () => Promise<void>] {
  // Use session storage by creating a custom storage provider
  const sessionStorageProvider: StorageProvider = {
    async get<V>(k: string, defaultValue?: V): Promise<V> {
      try {
        const value = sessionStorage.getItem(k);
        if (value === null) return defaultValue as V;
        return JSON.parse(value) as V;
      } catch (error) {
        console.error(`Error getting key ${k} from sessionStorage:`, error);
        return defaultValue as V;
      }
    },
    async set<V>(k: string, value: V): Promise<void> {
      try {
        sessionStorage.setItem(k, JSON.stringify(value));
      } catch (error) {
        console.error(`Error setting key ${k} in sessionStorage:`, error);
        throw error;
      }
    },
    async remove(k: string): Promise<void> {
      try {
        sessionStorage.removeItem(k);
      } catch (error) {
        console.error(`Error removing key ${k} from sessionStorage:`, error);
        throw error;
      }
    },
    async clear(): Promise<void> {
      try {
        sessionStorage.clear();
      } catch (error) {
        console.error('Error clearing sessionStorage:', error);
        throw error;
      }
    }
  };

  const windowKey = `window:${key}`;
  return usePersistentState(windowKey, initialValue, { 
    ...options, 
    storage: sessionStorageProvider 
  });
}
