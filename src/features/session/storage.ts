/**
 * Storage implementations for session management
 */
import { StorageProvider } from './types';

/**
 * Storage provider based on localStorage
 */
export class LocalStorageProvider implements StorageProvider {
  private prefix: string;

  constructor(prefix = 'workspace-manager') {
    this.prefix = prefix;
  }

  private getFullKey(key: string): string {
    return `${this.prefix}:${key}`;
  }

  async get<T>(key: string, defaultValue?: T): Promise<T> {
    try {
      const fullKey = this.getFullKey(key);
      const value = localStorage.getItem(fullKey);

      if (value === null) {
        return defaultValue as T;
      }

      return JSON.parse(value) as T;
    } catch (error) {
      console.error(`Error getting key ${key} from localStorage:`, error);
      return defaultValue as T;
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    try {
      const fullKey = this.getFullKey(key);
      localStorage.setItem(fullKey, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting key ${key} in localStorage:`, error);
      throw error;
    }
  }

  async remove(key: string): Promise<void> {
    try {
      const fullKey = this.getFullKey(key);
      localStorage.removeItem(fullKey);
    } catch (error) {
      console.error(`Error removing key ${key} from localStorage:`, error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      // Only clear keys with our prefix
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      throw error;
    }
  }
}

/**
 * Storage provider based on IndexedDB for larger data
 */
export class IndexedDBStorageProvider implements StorageProvider {
  private dbName: string;
  private storeName: string;
  private dbPromise: Promise<IDBDatabase> | null = null;

  constructor(dbName = 'workspace-manager-db', storeName = 'session-store') {
    this.dbName = dbName;
    this.storeName = storeName;
  }

  private getDB(): Promise<IDBDatabase> {
    if (!this.dbPromise) {
      this.dbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(this.dbName, 1);

        request.onerror = () => {
          reject(request.error);
        };

        request.onsuccess = () => {
          resolve(request.result);
        };

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(this.storeName)) {
            db.createObjectStore(this.storeName, { keyPath: 'key' });
          }
        };
      });
    }

    return this.dbPromise;
  }

  async get<T>(key: string, defaultValue?: T): Promise<T> {
    try {
      const db = await this.getDB();
      
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.storeName, 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.get(key);

        request.onerror = () => {
          reject(request.error);
        };

        request.onsuccess = () => {
          if (request.result) {
            resolve(request.result.value as T);
          } else {
            resolve(defaultValue as T);
          }
        };
      });
    } catch (error) {
      console.error(`Error getting key ${key} from IndexedDB:`, error);
      return defaultValue as T;
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    try {
      const db = await this.getDB();
      
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.storeName, 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.put({ key, value });

        request.onerror = () => {
          reject(request.error);
        };

        request.onsuccess = () => {
          resolve();
        };
      });
    } catch (error) {
      console.error(`Error setting key ${key} in IndexedDB:`, error);
      throw error;
    }
  }

  async remove(key: string): Promise<void> {
    try {
      const db = await this.getDB();
      
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.storeName, 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.delete(key);

        request.onerror = () => {
          reject(request.error);
        };

        request.onsuccess = () => {
          resolve();
        };
      });
    } catch (error) {
      console.error(`Error removing key ${key} from IndexedDB:`, error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      const db = await this.getDB();
      
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.storeName, 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.clear();

        request.onerror = () => {
          reject(request.error);
        };

        request.onsuccess = () => {
          resolve();
        };
      });
    } catch (error) {
      console.error('Error clearing IndexedDB:', error);
      throw error;
    }
  }
}

/**
 * Factory function to create a storage provider based on environment and needs
 */
export function createStorage(type: 'local' | 'indexed-db' = 'local'): StorageProvider {
  if (type === 'indexed-db') {
    return new IndexedDBStorageProvider();
  }
  
  return new LocalStorageProvider();
}

/**
 * Default storage provider instance
 */
export const defaultStorage = createStorage('local');
